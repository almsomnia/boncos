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
      return $roundDecimal(result)
   })

   /**
    * Computed property that calculates the final total (subtotal + additional costs - discount).
    */
   const total = computed(() => {
      const result =
         subtotal.value
         + totalAdditionalCosts.value
         - Math.abs(discount.value ?? 0)
      return $roundDecimal(result)
   })

   /**
    * Computed property that generates a detailed breakdown of costs and discounts for each item,
    * distributed proportionally based on each item's subtotal.
    */
   const calculationDetails = computed<CalculationDetail[]>(() => {
      return items.value.map((item) => {
         const itemSubtotal = $roundDecimal((item.price ?? 0) * (item.qty ?? 0))

         const proportion = $roundDecimal(itemSubtotal / subtotal.value)

         const itemDiscount = $roundDecimal(
            proportion * Math.abs(discount.value ?? 0)
         )

         const itemAdditionalCost = $roundDecimal(
            totalAdditionalCosts.value * proportion
         )

         const itemTotalPriceAfterDiscount = $roundDecimal(
            itemSubtotal + itemAdditionalCost - itemDiscount
         )

         const totalItemPerQty = $roundDecimal(
            itemTotalPriceAfterDiscount / (item.qty ?? 0)
         )

         return {
            name: item.name ?? "-",
            qty: item.qty ?? 0,
            price: item.price ?? 0,
            total_item_per_qty: totalItemPerQty,
            proportion: proportion,
            item_discount: itemDiscount,
            additional_cost: itemAdditionalCost,
            total_price_after_discount: itemTotalPriceAfterDiscount,
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
      return { data: result }
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
      shareCalculationResult,
   }
}
