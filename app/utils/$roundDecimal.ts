export default function (num: number, precision: number = 2) {
   if (Number.isNaN(num)) return 0
   return Math.round((num + Number.EPSILON) * Math.pow(10, precision)) / Math.pow(10, precision)
}
