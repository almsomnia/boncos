import type { Item, AdditionalCost, CalculationDetail } from "#shared/types"
import { $base64Encode, $base64Decode } from "#shared/utils"

/**
 * Composable that manages the state and logic for the bill-splitting calculator.
 * It handles items, additional costs, discounts, and calculates proportional breakdowns.
 *
 * @returns {Object} The calculator state and methods
 */
export default function () {
   /** List of items to calculate */
   const items = ref<Partial<Item>[]>([])

   /** Total discount amount to be applied */
   const discount = shallowRef<number>()

   /** List of additional costs (e.g., tax, service) */
   const additionalCosts = ref<Partial<AdditionalCost>[]>([])

   /** List of payment information (e.g., bank name, account number) */
   const paymentInfo = ref<{ name: string; account: string }[]>([])

   /**
    * Computed property that calculates the sum of all additional costs.
    */
   const totalAdditionalCosts = computed(() => {
      return additionalCosts.value.reduce(
         (acc, curr) => acc + (curr.amount ?? 0),
         0
      )
   })

   /**
    * Computed property that calculates the subtotal of all items (price * qty).
    */
   const subtotal = computed(() => {
      const result = items.value.reduce(
         (acc, curr) => acc + (curr.price ?? 0) * (curr.qty ?? 0),
         0
      )
      return result
   })

   /**
    * Computed property that calculates the final total (subtotal + additional costs - discount).
    */
   const total = computed(() => {
      const result =
         subtotal.value
         + totalAdditionalCosts.value
         - Math.abs(discount.value ?? 0)
      return result
   })

   /**
    * Computed property that generates a detailed breakdown of costs and discounts for each item,
    * distributed proportionally based on each item's subtotal.
    */
   const calculationDetails = computed<CalculationDetail[]>(() => {
      return items.value.map((item): CalculationDetail => {
         const itemSubtotal = (item.price ?? 0) * (item.qty ?? 0)

         const proportion = subtotal.value === 0 ? 0 : itemSubtotal / subtotal.value

         const itemDiscount = proportion * Math.abs(discount.value ?? 0)

         const itemAdditionalCost = totalAdditionalCosts.value * proportion

         const finalTotal = itemSubtotal + itemAdditionalCost - itemDiscount

         const finalUnitPrice = finalTotal / (item.qty ?? 0)

         return {
            item: {
               name: item.name ?? "-",
               qty: item.qty ?? 0,
               unitPrice: item.price ?? 0,
               subtotal: itemSubtotal,
            },
            allocation: {
               proportion: proportion,
               discount: itemDiscount,
               additionalCost: itemAdditionalCost,
            },
            result: {
               finalTotal: finalTotal,
               finalUnitPrice: finalUnitPrice,
            },
         }
      })
   })

   /**
    * Adds a new empty item to the calculation list.
    */
   function addItem() {
      items.value.push({
         name: undefined,
         price: undefined,
         qty: undefined,
      })
   }

   /**
    * Removes an item from the list at the specified index.
    * @param {number} index - The index of the item to remove
    */
   function removeItem(index: number) {
      items.value.splice(index, 1)
   }

   /**
    * Adds a new empty additional cost entry.
    */
   function addAdditionalCost() {
      additionalCosts.value.push({
         name: undefined,
         amount: undefined,
      })
   }

   /**
    * Removes an additional cost entry at the specified index.
    * @param {number} index - The index of the additional cost to remove
    */
   function removeAdditionalCost(index: number) {
      additionalCosts.value.splice(index, 1)
   }

   /**
    * Adds a new empty payment info entry.
    */
   function addPaymentInfo() {
      paymentInfo.value.push({
         name: "",
         account: "",
      })
   }

   /**
    * Removes a payment info entry at the specified index.
    * @param {number} index - The index of the payment info to remove
    */
   function removePaymentInfo(index: number) {
      paymentInfo.value.splice(index, 1)
   }

   async function shareCalculationResult() {
      const payload = JSON.stringify({
         items: items.value,
         discount: discount.value,
         additional_costs: additionalCosts.value,
         subtotal: subtotal.value,
         total: total.value,
         calculation_result: calculationDetails.value,
      })

      const result = $base64Encode(payload, true)
      return result
   }

   return {
      items,
      discount,
      additionalCosts,
      addItem,
      removeItem,
      addAdditionalCost,
      removeAdditionalCost,
      subtotal,
      total,
      calculationDetails,
      paymentInfo,
      addPaymentInfo,
      removePaymentInfo,
      shareCalculationResult,
   }
}
