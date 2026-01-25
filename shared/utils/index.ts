import { Buffer } from "buffer"

/**
 * Encodes a string to Base64 format.
 *
 * @param {string} text - The plain text string to encode.
 * @param {boolean} [urlSafe] - If true, the resulting string will be URL-safe.
 * @returns {string} The Base64 encoded string.
 */
export function $base64Encode(text: string, urlSafe?: boolean): string {
   const buffer = Buffer.from(text, "utf8")
   const encoded = buffer.toString("base64")
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

   return Buffer.from(input, "base64").toString("utf8")
}
