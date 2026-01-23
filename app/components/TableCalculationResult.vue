<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"

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
      header: "Item Name",
   },
   {
      accessorKey: "total_item_per_qty",
      header: "Item Price/Qty per Unit",
      cell: ({ row }) => {
         return $formatCurrency(row.original.total_item_per_qty)
      },
      meta: {
         class: {
            td: "text-right font-semibold text-highlighted",
         },
      },
   },
   {
      accessorKey: "qty",
      header: "Qty",
      meta: {
         class: {
            td: "text-right",
         },
      },
   },
   {
      accessorKey: "proportion",
      header: "Proportion",
      meta: {
         class: {
            td: "text-right",
         },
      },
   },
   {
      accessorKey: "item_discount",
      header: "Discount",
      meta: {
         class: {
            td: "text-right",
         },
      },
      cell: ({ row }) => {
         return $formatCurrency(row.original.item_discount)
      },
   },
   {
      accessorKey: "additional_cost",
      header: "Additional Cost",
      meta: {
         class: {
            td: "text-right",
         },
      },
      cell: ({ row }) => {
         return $formatCurrency(row.original.additional_cost)
      },
   },
   {
      accessorKey: "total_price_after_discount",
      header: "Total Discounted Price",
      meta: {
         class: {
            td: "text-right",
         },
      },
      cell: ({ row }) => {
         return $formatCurrency(row.original.total_price_after_discount)
      },
   },
]
</script>

<template>
   <UTable
      :data="props.data"
      :columns="tableColumns"
      class="w-full"
   ></UTable>
</template>
