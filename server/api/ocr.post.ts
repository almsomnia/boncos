export default defineEventHandler(async (event) => {
   const config = useRuntimeConfig()
   if (!config.openrouterApiKey) {
      throw createError({ statusCode: 500, statusMessage: "API key not configured" })
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
   if ((base64Data?.length ?? 0) * 0.75 > maxSize) {
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
         "https://openrouter.ai/api/v1/chat/completions",
         {
            method: "POST",
            headers: {
               "Authorization": `Bearer ${config.openrouterApiKey}`,
               "Content-Type": "application/json",
            },
            body: {
               model: config.public.ocrModel,
               messages: [{
                  role: "user",
                  content: [
                     { type: "text", text: prompt },
                     { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Data}` } },
                  ],
               }],
               response_format: { type: "json_object" },
               temperature: 0,
            },
         },
      )
   }
   catch (e: any) {
      const status = e?.response?.status || e?.statusCode || 502
      const apiMessage = e?.data?.error?.message || e?.response?._data?.error?.message || ""

      const messages: Record<number, string> = {
         400: "Foto tidak bisa diproses. Coba foto yang lebih jelas atau format lain (JPG/PNG).",
         401: "API key OpenRouter tidak valid. Periksa konfigurasi OPENROUTER_API_KEY.",
         402: "Credit OpenRouter habis.",
         403: "API key tidak punya akses.",
         429: "Terlalu banyak request. Coba lagi dalam beberapa menit.",
         503: "Model sedang sibuk. Coba lagi dalam beberapa saat.",
      }

      const userMessage = messages[status]
         || `Gagal menghubungi OpenRouter (${status}). ${apiMessage || "Coba lagi nanti."}`

      throw createError({ statusCode: status, statusMessage: userMessage })
   }

   const text = response?.choices?.[0]?.message?.content
   if (!text) {
      throw createError({
         statusCode: 502,
         statusMessage: "Tidak ada hasil dari model. Foto mungkin tidak mengandung struk yang bisa dibaca.",
      })
   }

   let result: OcrReceiptResult
   try {
      result = JSON.parse(text)
   }
   catch {
      throw createError({
         statusCode: 502,
         statusMessage: "Hasil dari model tidak bisa diproses. Coba foto struk yang lebih jelas.",
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
