import { describe, it, expect } from "vitest"
import { $base64Encode, $base64Decode } from "../../shared/utils/index"

describe("$base64Encode", () => {
   it("encodes string to base64", () => {
      const result = $base64Encode("hello world")
      expect(result).toBe("aGVsbG8gd29ybGQ=")
   })

   it("encodes url safe", () => {
      // "subjects?_d=1" -> base64 "c3ViamVjdHM/X2Q9MQ=="
      // URL safe replace + with -, / with _, remove =
      const input = "subjects?_d=1"
      const result = $base64Encode(input, true)
      expect(result).toBe("c3ViamVjdHM_X2Q9MQ")
   })
})

describe("$base64Decode", () => {
   it("decodes base64 string", () => {
      const result = $base64Decode("aGVsbG8gd29ybGQ=")
      expect(result).toBe("hello world")
   })

   it("decodes url safe base64", () => {
      const result = $base64Decode("c3ViamVjdHM_X2Q9MQ", true)
      expect(result).toBe("subjects?_d=1")
   })
})

describe("round trip", () => {
   it("preserves non-ASCII payloads", () => {
      const payload = JSON.stringify({
         items: [{ name: "Nasi Goreng 🍚", price: 25000 }],
         note: "Rp 25.000 — kopi ☕ / Ayam Penyét",
      })
      expect($base64Decode($base64Encode(payload, true), true)).toBe(payload)
   })

   it("preserves an empty string", () => {
      expect($base64Decode($base64Encode("", true), true)).toBe("")
   })
})
