export default function (amount: number) {
   return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
   }).format(Number.isNaN(amount) ? 0 : amount)
}
