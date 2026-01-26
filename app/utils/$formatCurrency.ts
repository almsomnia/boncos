export default function (amount: number) {
   return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      currencyDisplay: "narrowSymbol",
   }).format(Number.isNaN(amount) ? 0 : amount)
}
