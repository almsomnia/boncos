export default function (num: number) {
   if (Number.isNaN(num)) return 0
   return Math.round((num + Number.EPSILON) * 100) / 100
}
