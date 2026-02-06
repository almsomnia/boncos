import { describe, it, expect } from "vitest"
import useCalculator from "../../../app/composables/useCalculator"

describe("useCalculator", () => {
   it("initializes with default values", () => {
      const { items, discount, additionalCosts, subtotal, total } =
         useCalculator()
      expect(items.value).toEqual([])
      expect(discount.value).toBeUndefined()
      expect(additionalCosts.value).toEqual([])
      expect(subtotal.value).toBe(0)
      expect(total.value).toBe(0)
   })

   it("adds, modifies and removes items", () => {
      const { items, addItem, removeItem } = useCalculator()
      addItem()
      expect(items.value).toHaveLength(1)
      expect(items.value[0]).toEqual({
         name: undefined,
         price: undefined,
         qty: undefined,
      })

      // Modify item
      items.value[0]!.name = "Test Item"
      items.value[0]!.price = 100
      items.value[0]!.qty = 2

      expect(items.value[0]).toEqual({ name: "Test Item", price: 100, qty: 2 })

      removeItem(0)
      expect(items.value).toHaveLength(0)
   })

   it("adds and removes additional costs", () => {
      const { additionalCosts, addAdditionalCost, removeAdditionalCost } =
         useCalculator()
      addAdditionalCost()
      expect(additionalCosts.value).toHaveLength(1)

      additionalCosts.value[0]!.amount = 5000

      removeAdditionalCost(0)
      expect(additionalCosts.value).toHaveLength(0)
   })

   it("calculates subtotal correctly", () => {
      const { items, subtotal } = useCalculator()
      items.value = [
         { name: "A", price: 1000, qty: 2 }, // 2000
         { name: "B", price: 500, qty: 1 }, // 500
      ]
      expect(subtotal.value).toBe(2500)
   })

   it("calculates total correctly with additional costs and discount", () => {
      const { items, additionalCosts, discount, total } = useCalculator()

      // Subtotal: 1000 * 1 = 1000
      items.value = [{ name: "A", price: 1000, qty: 1 }]

      // Additional Costs: 100 + 50 = 150
      additionalCosts.value = [
         { name: "Tax", amount: 100 },
         { name: "Service", amount: 50 },
      ]

      // Discount: 200
      discount.value = 200

      // Total = 1000 + 150 - 200 = 950
      expect(total.value).toBe(950)
   })

   it("calculates calculationDetails with proportional distribution", () => {
      const { items, additionalCosts, discount, calculationDetails } =
         useCalculator()

      // Item A: 1000 * 1 = 1000
      // Item B: 1000 * 1 = 1000
      // Subtotal: 2000
      items.value = [
         { name: "A", price: 1000, qty: 1 },
         { name: "B", price: 1000, qty: 1 },
      ]

      // Total Additional: 200 (10% of subtotal)
      additionalCosts.value = [{ name: "Tax", amount: 200 }]

      // Discount: 100
      discount.value = 100

      // Each item contributes 50% (1000/2000)
      // Allocation per item:
      // - Additional Cost: 200 * 0.5 = 100
      // - Discount: 100 * 0.5 = 50
      // Final Total per item: 1000 + 100 - 50 = 1050

      const details = calculationDetails.value
      expect(details).toHaveLength(2)

      const itemA = details[0]
      expect(itemA!.item.subtotal).toBe(1000)
      expect(itemA!.allocation.proportion).toBe(0.5)
      expect(itemA!.allocation.additionalCost).toBe(100)
      expect(itemA!.allocation.discount).toBe(50)
      expect(itemA!.result.finalTotal).toBe(1050)
      expect(itemA!.result.finalUnitPrice).toBe(1050)
   })

   it("handles empty values gracefully in calculationDetails", () => {
      const { items, calculationDetails } = useCalculator()

      items.value = [{ name: "A", price: undefined, qty: undefined }]

      const details = calculationDetails.value
      expect(details[0]!.item.subtotal).toBe(0)
      expect(details[0]!.result.finalTotal).toBe(0)
   })

   it("shares calculation result as base64 string", async () => {
      const { items, shareCalculationResult } = useCalculator()
      items.value = [{ name: "A", price: 100, qty: 1 }]

      const result = await shareCalculationResult()
      expect(typeof result).toBe("string")
      expect(result.length).toBeGreaterThan(0)
   })

   it("manages payment information", () => {
      const { paymentInfo, addPaymentInfo, removePaymentInfo } = useCalculator()
      expect(paymentInfo.value).toEqual([])

      addPaymentInfo()
      expect(paymentInfo.value).toHaveLength(1)
      expect(paymentInfo.value[0]).toEqual({ name: "", account: "" })

      paymentInfo.value[0]!.name = "Bank BCA"
      paymentInfo.value[0]!.account = "123456789"

      addPaymentInfo()
      expect(paymentInfo.value).toHaveLength(2)

      removePaymentInfo(0)
      expect(paymentInfo.value).toHaveLength(1)
      expect(paymentInfo.value[0]!.name).toBe("")
   })
})
