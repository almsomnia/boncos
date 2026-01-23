<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { UButton } from "#components"

type Data = {
   name: string | undefined
   qty: number
   total_item_per_qty: number
   proportion: number
   item_discount: number
   additional_cost: number
   total_price_after_discount: number
}

const props = defineProps<{
   data: Data[]
}>()

const tableColumns: TableColumn<Data>[] = [
   {
      accessorKey: "name",
      header: ({ column }) => getHeader(column, "Nama Item", "left"),
      size: 100,
   },
   {
      accessorKey: "qty",
      header: ({ column }) => getHeader(column, "Jumlah", "left"),
      meta: {
         class: {
            td: "text-right",
         },
      },
      size: 64
   },
   {
      accessorKey: "proportion",
      header: ({ column }) => getHeader(column, "Proporsi", "left"),
      meta: {
         class: {
            td: "text-right",
         },
      },
      size: 64,
   },
   {
      accessorKey: "item_discount",
      header: ({ column }) => getHeader(column, "Diskon / Item", "left"),
      meta: {
         class: {
            td: "text-right",
         },
      },
      cell: ({ row }) => {
         return $formatCurrency(row.original.item_discount)
      },
      size: 128,
   },
   {
      accessorKey: "additional_cost",
      header: ({ column }) => getHeader(column, "Biaya Tambahan / Item", "left"),
      meta: {
         class: {
            td: "text-right",
         },
      },
      cell: ({ row }) => {
         return $formatCurrency(row.original.additional_cost)
      },
      size: 128,
   },
   {
      accessorKey: "total_price_after_discount",
      header: ({ column }) => getHeader(column, "Harga (setelah diskon)", "left"),
      meta: {
         class: {
            td: "text-right",
         },
      },
      cell: ({ row }) => {
         return $formatCurrency(row.original.total_price_after_discount)
      },
      size: 128,
   },
   {
      accessorKey: "total_item_per_qty",
      header: ({ column }) => getHeader(column, "Harga / Item (setelah diskon)", "right"),
      cell: ({ row }) => {
         return $formatCurrency(row.original.total_item_per_qty)
      },
      meta: {
         class: {
            td: "text-right font-semibold text-highlighted",
         },
      },
      size: 128,
   },
]

function getHeader(column: any, label: string, pinPosition: "left" | "right") {
   const isPinned = column.getIsPinned()

   return h(UButton, {
      color: "neutral",
      variant: "ghost",
      label,
      icon: isPinned ? "lucide:pin-off" : "lucide:pin",
      class: "-mx-2.5",
      onClick: () => {
         column.pin(isPinned === pinPosition ? false : pinPosition)
      }
   })
}

const columnPinning = ref<
   Record<"left" | "right", (keyof Data | (string & {}))[]>
>({
   left: [""],
   right: ["total_item_per_qty"],
})
</script>

<template>
   <UTable
      v-model:column-pinning="columnPinning"
      :data="props.data"
      :columns="tableColumns"
      class="w-full"
   ></UTable>
</template>
