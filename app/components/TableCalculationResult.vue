<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { upperFirst } from "scule"
import { UButton } from "#components"
import type { CalculationDetail, DeepestPaths } from "#shared/types"

const props = defineProps<{
   data: CalculationDetail[]
}>()

const tableColumns: TableColumn<CalculationDetail>[] = [
   {
      accessorKey: "item.name",
      header: "Nama Item",
      size: 100,
   },
   {
      accessorKey: "item.qty",
      header: "Jumlah",
      size: 64,
   },
   {
      accessorKey: "item.unitPrice",
      header: "Harga per Item (sebelum diskon)",
      cell: ({ row }) => {
         return $formatCurrency(row.original.item.unitPrice)
      },
      size: 128,
   },
   {
      accessorKey: "item.subtotal",
      header: "Item Subtotal (sebelum diskon)",
      cell: ({ row }) => {
         return $formatCurrency(row.original.item.subtotal)
      },
      size: 128,
   },
   {
      accessorKey: "allocation.proportion",
      header: "Proporsi",
      meta: {
         class: {
            td: "text-right",
         },
      },
      cell: ({ row }) => {
         return $roundDecimal(row.original.allocation.proportion, 3)
      },
      size: 64,
   },
   {
      accessorKey: "allocation.discount",
      header: "Diskon Item",
      meta: {
         class: {
            td: "text-right",
         },
      },
      cell: ({ row }) => {
         return $formatCurrency(row.original.allocation.discount)
      },
      size: 128,
   },
   {
      accessorKey: "allocation.additionalCost",
      header: "Biaya Tambahan Item",
      meta: {
         class: {
            td: "text-right",
         },
      },
      cell: ({ row }) => {
         return $formatCurrency(row.original.allocation.additionalCost)
      },
      size: 128,
   },
   {
      accessorKey: "result.finalTotal",
      header: "Harga (setelah diskon)",
      meta: {
         class: {
            td: "text-right",
         },
      },
      cell: ({ row }) => {
         return $formatCurrency(row.original.result.finalTotal)
      },
      size: 128,
   },
   {
      accessorKey: "result.finalUnitPrice",
      header: "Harga per Item (setelah diskon)",
      cell: ({ row }) => {
         return $formatCurrency(row.original.result.finalUnitPrice)
      },
      meta: {
         class: {
            td: "text-right font-semibold text-highlighted",
         },
      },
      size: 128,
   },
]

const columnVisibility = ref<
   Record<DeepestPaths<CalculationDetail, "_"> | (string & {}), boolean>
>({
   "item_name": true,
   "item_qty": true,
   "item_unitPrice": true,
   "item_subtotal": false,
   "allocation_proportion": false,
   "allocation_discount": false,
   "allocation_additionalCost": false,
   "result_finalTotal": false,
   "result_finalUnitPrice": true,
})

const table = useTemplateRef("table")
</script>

<template>
   <div class="flex w-full flex-1 flex-col">
      <div class="border-accented flex justify-end border-b py-3.5">
         <UDropdownMenu
            :items="
               table?.tableApi
                  ?.getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => ({
                     label: upperFirst(
                        column.columnDef.header?.toString() ?? column.id
                     ),
                     type: 'checkbox' as const,
                     checked: column.getIsVisible(),
                     onUpdateChecked(checked: boolean) {
                        table?.tableApi
                           ?.getColumn(column.id)
                           ?.toggleVisibility(!!checked)
                     },
                     onSelect(e: Event) {
                        e.preventDefault()
                     },
                  }))
            "
            :content="{ align: 'end' }"
         >
            <UButton
               label="Kolom"
               color="neutral"
               variant="outline"
               trailing-icon="lucide:chevron-down"
            />
         </UDropdownMenu>
      </div>
      <UTable
         ref="table"
         v-model:column-visibility="columnVisibility"
         :data="props.data"
         :columns="tableColumns"
         class="w-full"
      ></UTable>
   </div>
</template>
