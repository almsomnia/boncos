export default function () {
   const loading = ref(false)
   const error = ref<string | null>(null)
   const result = ref<OcrReceiptResult | null>(null)

   function readFileAsDataUrl(file: File): Promise<string> {
      return new Promise((resolve, reject) => {
         const reader = new FileReader()
         reader.onload = () => resolve(reader.result as string)
         reader.onerror = () => reject(reader.error)
         reader.readAsDataURL(file)
      })
   }

   async function scan(file: File) {
      error.value = null
      result.value = null

      if (file.size > 4 * 1024 * 1024) {
         error.value = "Image too large, max 4MB"
         return
      }

      if (!file.type.startsWith("image/")) {
         error.value = "File must be an image"
         return
      }

      loading.value = true
      try {
         const dataUrl = await readFileAsDataUrl(file)
         result.value = await $fetch<OcrReceiptResult>("/api/ocr", {
            method: "POST",
            body: { image: dataUrl },
         })
      }
      catch (e: any) {
         error.value = e?.data?.statusMessage || e?.message || "Failed to scan receipt"
      }
      finally {
         loading.value = false
      }
   }

   function reset() {
      result.value = null
      error.value = null
   }

   return { loading, error, result, scan, reset }
}
