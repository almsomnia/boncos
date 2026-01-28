import { describe, it, expect } from "vitest"
import $formatCurrency from "../../app/utils/$formatCurrency"

describe("$formatCurrency", () => {
   it("formats number to IDR currency", () => {
      const result = $formatCurrency(15000)
      expect(result).toMatch(/Rp\s15\.000,00/)
   })

   it("formats 0 correctly", () => {
      const result = $formatCurrency(0)
      expect(result).toMatch(/Rp\s0,00/)
   })

   it("handles NaN by returning 0 formatted", () => {
      const result = $formatCurrency(NaN)
      expect(result).toMatch(/Rp\s0,00/)
   })
})
