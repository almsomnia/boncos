export default defineEventHandler(async (event) => {
   const config = useRuntimeConfig()
   if (!config.geminiApiKey) {
      throw createError({ statusCode: 500, statusMessage: "GEMINI_API_KEY not configured" })
   }

   const body = await readBody<{ image: string }>(event)
   if (!body?.image) {
      throw createError({ statusCode: 400, statusMessage: "Missing image data" })
   }

   const match = body.image.match(/^data:(image\/\w+);base64,(.+)$/)
   if (!match) {
      throw createError({ statusCode: 400, statusMessage: "Invalid image format, expected base64 data URI" })
   }

   const [, mimeType, base64Data] = match

   const maxSize = 4 * 1024 * 1024
   if (base64Data.length * 0.75 > maxSize) {
      throw createError({ statusCode: 400, statusMessage: "Image too large, max 4MB" })
   }

   const prompt = `Kamu adalah OCR assistant untuk struk belanja Indonesia.
Dari foto struk ini, extract semua data dalam format JSON berikut:

{
  "items": [{ "name": "...", "price": <unit price>, "qty": <jumlah> }],
  "additional_costs": [{ "name": "...", "amount": <nominal> }],
  "discounts": [{ "name": "...", "amount": <nominal>, "type": "amount" }]
}

Aturan:
- price HARUS unit price (harga per item), bukan subtotal
- Jika harga tertulis adalah subtotal dan qty > 1, bagi harga dengan qty
- qty default 1 jika tidak tertulis
- Abaikan item yang tidak ada harga DAN tidak ada qty (item kosong di form)
- Jika ada pajak/service charge, masukkan ke additional_costs
- Jika ada diskon, masukkan ke discounts dengan type "amount" atau "percentage"
- Semua nominal dalam Rupiah (angka bulat, tanpa titik/koma)
- Jangan include total/subtotal sebagai item

Respond ONLY with valid JSON, no markdown fences, no explanation.`

   let response: any
   try {
      response = await $fetch<any>(
         `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${config.geminiApiKey}`,
         {
            method: "POST",
            body: {
               contents: [{
                  parts: [
                     { text: prompt },
                     { inline_data: { mime_type: mimeType, data: base64Data } },
                  ],
               }],
               generationConfig: {
                  response_mime_type: "application/json",
               },
            },
         },
      )
   }
   catch (e: any) {
      const status = e?.response?.status || e?.statusCode || 502
      const geminiMessage = e?.data?.error?.message || e?.response?._data?.error?.message || ""

      const messages: Record<number, string> = {
         400: "Foto tidak bisa diproses. Coba foto yang lebih jelas atau format lain (JPG/PNG).",
         401: "API key Gemini tidak valid. Periksa konfigurasi GEMINI_API_KEY.",
         403: "API key tidak punya akses ke Gemini API. Periksa konfigurasi di Google AI Studio.",
         404: "Model Gemini tidak tersedia. Hubungi developer untuk update konfigurasi.",
         429: "Terlalu banyak request. Coba lagi dalam beberapa menit.",
         503: "Server Gemini sedang sibuk (high demand). Coba lagi dalam beberapa saat.",
      }

      const userMessage = messages[status]
         || `Gagal menghubungi Gemini API (${status}). ${geminiMessage || "Coba lagi nanti."}`

      throw createError({ statusCode: status, statusMessage: userMessage })
   }

   const text = response?.candidates?.[0]?.content?.parts?.[0]?.text
   if (!text) {
      throw createError({
         statusCode: 502,
         statusMessage: "Gemini tidak mengembalikan hasil. Foto mungkin tidak mengandung struk yang bisa dibaca.",
      })
   }

   let result: OcrReceiptResult
   try {
      result = JSON.parse(text)
   }
   catch {
      throw createError({
         statusCode: 502,
         statusMessage: "Hasil dari Gemini tidak bisa diproses. Coba foto struk yang lebih jelas.",
      })
   }

   if (!Array.isArray(result.items)) {
      throw createError({
         statusCode: 502,
         statusMessage: "Tidak ada item yang terdeteksi dari struk. Pastikan foto terlihat jelas dan mengandung daftar item.",
      })
   }

   result.additional_costs ??= []
   result.discounts ??= []

   return result
})
