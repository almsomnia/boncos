<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { upperFirst } from "scule"
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
      header: "Nama Item",
      size: 100,
   },
   {
      accessorKey: "qty",
      header: "Jumlah",
      size: 64,
   },
   {
      accessorKey: "proportion",
      header: "Proporsi",
      meta: {
         class: {
            td: "text-right",
         },
      },
      size: 64,
   },
   {
      accessorKey: "item_discount",
      header: "Diskon / Item",
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
      header: "Biaya Tambahan / Item",
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
      header: "Harga (setelah diskon)",
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
      header: "Harga / Item (setelah diskon)",
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

const columnVisibility = ref<Record<keyof Data | (string & {}), boolean>>({
   name: true,
   qty: true,
   proportion: false,
   item_discount: false,
   additional_cost: false,
   total_price_after_discount: false,
   total_item_per_qty: true,
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
                     label: upperFirst(column.columnDef.header?.toString() ?? column.id),
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
               label="Visibilitas Kolom"
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
