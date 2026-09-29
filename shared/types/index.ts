export type Item = {
   name: string
   price: number
   qty: number
}

export type AdditionalCost = {
   name: string
   amount: number
}

/**
 * How a discount value is interpreted:
 * - `amount`: a flat currency value
 * - `percentage`: a percentage of the item subtotal
 */
export type DiscountType = "amount" | "percentage"

export type Discount = {
   name: string
   amount: number
   /** Defaults to `amount` when omitted (e.g. calculations shared before percentages existed) */
   type?: DiscountType
}

export type CalculationDetail = {
   item: {
      name: string | undefined
      qty: number
      unitPrice: number // price per item, before any adjustment
      subtotal: number // item.unitPrice * item.qty
   }
   allocation: {
      proportion: number // item.subtotal / orderSubtotal
      discount: number // portion of global discount allocated to this item
      additionalCost: number // portion of global additional costs allocated to this item
   }
   result: {
      finalTotal: number // item.subtotal + allocation.additionalCost - allocation.discount
      finalUnitPrice: number // finalTotal / item.qty
   }
}

export type PeopleAssignment = {
   name: string
   items: {
      name: string
      qty: number
      finalUnitPrice: number
   }[]
   finalTotal: number
}

export type OcrReceiptResult = {
   items: Item[]
   additional_costs: AdditionalCost[]
   discounts: Discount[]
}

export type NestedPaths<T, Prefix extends string = ""> = {
   [K in keyof T & string]: T[K] extends object ?
      `${Prefix}${K}` | NestedPaths<T[K], `${Prefix}${K}.`>
   :  `${Prefix}${K}`
}[keyof T & string]

export type DeepestPaths<
   T,
   Separator extends string = ".",
   Prefix extends string = "",
> = {
   [K in keyof T & string]: T[K] extends object ?
      DeepestPaths<T[K], Separator, `${Prefix}${K}${Separator}`>
   :  `${Prefix}${K}`
}[keyof T & string]
