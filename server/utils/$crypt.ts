import { createCipheriv, createDecipheriv, randomBytes } from "crypto"

/**
 * Provides cryptographic utilities for encrypting and decrypting data.
 *
 * @returns An object containing `encrypt` and `decrypt` functions.
 */
export default function () {
   const runtimeConfig = useRuntimeConfig()
   const key = runtimeConfig.cryptKey

   /**
    * Encrypts a string using AES-256-GCM.
    *
    * @param {string} text - The plain text string to encrypt.
    * @returns {string} The base64 encoded string containing the encrypted data, IV, and auth tag.
    */
   function encrypt(text: string): string {
      const iv = randomBytes(16)
      const cipher = createCipheriv("aes-256-gcm", key, iv)
      const encrypted = Buffer.concat([
         cipher.update(text, "utf8"),
         cipher.final(),
      ])

      const authTag = cipher.getAuthTag()

      const result = {
         iv: iv.toString("hex"),
         data: encrypted.toString("hex"),
         authTag: authTag.toString("hex"),
      }

      const payload = JSON.stringify(result)
      return Buffer.from(payload).toString("base64")
   }

   /**
    * Decrypts a base64 encoded string previously encrypted with the `encrypt` function.
    *
    * @param {string} encodedString - The base64 encoded string containing the encrypted payload.
    * @returns {string} The original plain text string.
    */
   function decrypt(encodedString: string): string {
      const json = Buffer.from(encodedString, "base64").toString("utf8")
      const payload = JSON.parse(json)

      const iv = Buffer.from(payload.iv, "hex")
      const encrypted = Buffer.from(payload.data, "hex")
      const authTag = Buffer.from(payload.authTag, "hex")

      const decipher = createDecipheriv("aes-256-gcm", key, iv)
      decipher.setAuthTag(authTag)

      const decrypted = Buffer.concat([
         decipher.update(encrypted),
         decipher.final(),
      ])

      return decrypted.toString("utf8")
   }

   return {
      encrypt,
      decrypt,
   }
}
