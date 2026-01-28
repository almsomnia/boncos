import { describe, it, expect } from "vitest"
import $roundDecimal from "../../app/utils/$roundDecimal"

describe("$roundDecimal", () => {
   it("rounds to 2 decimal places by default", () => {
      const result = $roundDecimal(10.123)
      expect(result).toBe(10.12)
   })

   it("rounds to specified precision", () => {
      const result = $roundDecimal(10.1234, 1)
      expect(result).toBe(10.1)
   })

   it("handles floating point precision", () => {
      const result = $roundDecimal(0.1 + 0.2)
      // 0.1 + 0.2 = 0.30000000000000004
      expect(result).toBe(0.3)
   })

   it("returns 0 for NaN", () => {
      const result = $roundDecimal(NaN)
      expect(result).toBe(0)
   })
})
