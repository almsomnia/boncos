import type { Discount } from "../types"

/**
 * Encodes a string to Base64 format.
 *
 * @param {string} text - The plain text string to encode.
 * @param {boolean} [urlSafe] - If true, the resulting string will be URL-safe.
 * @returns {string} The Base64 encoded string.
 */
export function $base64Encode(text: string, urlSafe?: boolean): string {
   const bytes = new TextEncoder().encode(text)
   let binary = ""
   for (const byte of bytes) {
      binary += String.fromCharCode(byte)
   }
   const encoded = btoa(binary)
   if (urlSafe) {
      return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
   }
   return encoded
}

/**
 * Decodes a Base64 encoded string back to plain text.
 *
 * @param {string} text - The Base64 encoded string to decode.
 * @param {boolean} [urlSafe] - If true, the input string is treated as URL-safe Base64.
 * @returns {string} The decoded plain text string.
 */
export function $base64Decode(text: string, urlSafe?: boolean): string {
   let input = text
   if (urlSafe) {
      input = input.replace(/-/g, "+").replace(/_/g, "/")

      while (input.length % 4 !== 0) {
         input += "="
      }
   }

   const binary = atob(input)
   const bytes = new Uint8Array(binary.length)
   for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
   }
   return new TextDecoder().decode(bytes)
}

/**
 * Resolves the effective currency value of a discount entry.
 *
 * Percentage discounts are calculated against the item subtotal, so they stay
 * consistent no matter how many other discounts or additional costs exist.
 *
 * @param {Partial<Discount>} discount - The discount entry to resolve.
 * @param {number} subtotal - The item subtotal the percentage is applied to.
 * @returns {number} The discount expressed as a currency value.
 */
export function $resolveDiscount(
   discount: Partial<Discount>,
   subtotal: number
): number {
   const amount = discount.amount ?? 0

   if (discount.type === "percentage") {
      return (subtotal * amount) / 100
   }

   return amount
}
