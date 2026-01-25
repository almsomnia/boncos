export type Item = {
   name: string
   price: number
   qty: number
}

export type AdditionalCost = {
   name: string
   amount: number
}

export type CalculationDetail = {
   name: string | undefined
   qty: number
   price: number
   total_item_per_qty: number
   proportion: number
   item_discount: number
   additional_cost: number
   total_price_after_discount: number
}
