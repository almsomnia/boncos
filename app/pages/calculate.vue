<script setup lang="ts">
definePageMeta({
   title: "Kalkulator Tagihan",
})

type Item = {
   name: string
   price: number
   qty: number
}

type AdditionalCost = {
   name: string
   amount: number
}

const items = ref<Partial<Item>[]>([
   {
      name: undefined,
      price: undefined,
      qty: undefined,
   },
])

const discount = shallowRef<number>()

const additionalCosts = ref<Partial<AdditionalCost>[]>([
   {
      name: undefined,
      amount: undefined,
   },
])

const subtotal = computed(() => {
   const result = items.value.reduce(
      (acc, curr) => acc + (curr.price ?? 0) * (curr.qty ?? 0),
      0
   )
   return $roundDecimal(result)
})

const total = computed(() => {
   const totalAdditionals = additionalCosts.value.reduce(
      (acc, curr) => acc + (curr.amount ?? 0),
      0
   )
   return subtotal.value + totalAdditionals - Math.abs(discount.value ?? 0)
})

const itemDetails = computed(() => {
   return items.value.map((item) => {
      const itemSubtotal = $roundDecimal((item.price ?? 0) * (item.qty ?? 0))

      const proportion = $roundDecimal(itemSubtotal / subtotal.value)

      const itemDiscount = $roundDecimal(
         proportion * Math.abs(discount.value ?? 0)
      )

      const itemAdditionalCost = $roundDecimal(
         additionalCosts.value.reduce(
            (acc, curr) => acc + (curr.amount ?? 0),
            0
         ) * proportion
      )

      const itemTotalPriceAfterDiscount = $roundDecimal(
         itemSubtotal + itemAdditionalCost - itemDiscount
      )

      const totalItemPerQty = $roundDecimal(
         itemTotalPriceAfterDiscount / (item.qty ?? 0)
      )

      return {
         name: item.name ?? "-",
         qty: item.qty ?? 0,
         total_item_per_qty: totalItemPerQty,
         proportion: proportion,
         item_discount: itemDiscount,
         additional_cost: itemAdditionalCost,
         total_price_after_discount: itemTotalPriceAfterDiscount,
      }
   })
})

function onAddItem() {
   items.value.push({
      name: undefined,
      price: undefined,
      qty: undefined,
   })
}

function onRemoveItem(index: number) {
   items.value.splice(index, 1)
}

function onAddCost() {
   additionalCosts.value.push({
      name: undefined,
      amount: undefined,
   })
}

function onRemoveCost(index: number) {
   additionalCosts.value.splice(index, 1)
}
</script>

<template>
   <div class="grid grid-cols-1 gap-4 lg:grid-cols-5">
      <div class="col-span-full lg:col-span-3">
         <UCard>
            <template #header>
               <h2 class="text-lg font-semibold">
                  Item
               </h2>
            </template>
            <ul class="space-y-4">
               <li
                  v-for="(item, index) in items"
                  :key="index"
                  class="flex items-center gap-4"
               >
                  <UFieldGroup class="w-full">
                     <UInput
                        v-model="item.name"
                        placeholder="Nama item"
                        class="w-full"
                        @keydown.enter="onAddItem"
                     />
                     <UInputNumber
                        v-model="item.price"
                        placeholder="Harga item"
                        class="w-full"
                        :increment="false"
                        :decrement="false"
                        :format-options="{
                           style: 'currency',
                           currency: 'IDR',
                           currencyDisplay: 'narrowSymbol',
                        }"
                        @keydown.enter="onAddItem"
                     />
                     <UInputNumber
                        v-model="item.qty"
                        placeholder="Jumlah"
                        :increment="false"
                        :decrement="false"
                        class="w-full"
                        @keydown.enter="onAddItem"
                     />
                     <UButton
                        icon="lucide:trash"
                        color="error"
                        variant="subtle"
                        size="sm"
                        square
                        @click="onRemoveItem(index)"
                        :disabled="items.length < 2"
                     />
                  </UFieldGroup>
               </li>
               <li>
                  <UButton
                     block
                     label="Tambah Item"
                     icon="lucide:plus"
                     @click="onAddItem"
                  />
               </li>
            </ul>
         </UCard>
      </div>
      <div class="col-span-full lg:col-span-2">
         <UCard variant="subtle">
            <div class="space-y-4">
               <UFormField
                  label="Biaya Tambahan"
                  description="Ongkir, pajak, biaya layanan dll."
               >
                  <div class="space-y-2">
                     <UFieldGroup
                        v-for="(cost, index) in additionalCosts"
                        :key="index"
                        class="w-full"
                     >
                        <UInput
                           v-model="cost.name"
                           placeholder="Nama biaya"
                           class="w-full"
                           @keydown.enter="onAddCost"
                        />
                        <UInputNumber
                           v-model="cost.amount"
                           class="w-full"
                           placeholder="Harga"
                           :increment="false"
                           :decrement="false"
                           :format-options="{
                              style: 'currency',
                              currency: 'IDR',
                              currencyDisplay: 'narrowSymbol',
                           }"
                           @keydown.enter="onAddCost"
                        />
                        <UButton
                           icon="lucide:trash"
                           color="error"
                           variant="subtle"
                           size="sm"
                           @click="onRemoveCost(index)"
                           :disabled="additionalCosts.length < 2"
                        />
                     </UFieldGroup>
                     <UButton
                        block
                        label="Tambah Biaya Tambahan"
                        icon="lucide:plus"
                        class="mt-2"
                        @click="onAddCost"
                     />
                  </div>
               </UFormField>
               <UFormField
                  label="Diskon"
                  description="Total diskon"
               >
                  <UInputNumber
                     v-model="discount"
                     :increment="false"
                     :decrement="false"
                     placeholder="Total diskon"
                     :format-options="{
                        style: 'currency',
                        currency: 'IDR',
                        currencyDisplay: 'narrowSymbol',
                     }"
                     class="w-full"
                  />
               </UFormField>
            </div>
            <template #footer>
               <div class="space-y-4">
                  <div class="text-highlighted flex font-semibold">
                     <span class="w-3/5"> Total </span>
                     <span class="w-2/5 text-right">
                        {{ $formatCurrency(total) }}
                     </span>
                  </div>
               </div>
               <UAlert
                  title="Penting"
                  color="info"
                  variant="subtle"
                  icon="lucide:info"
                  description="Pastikan semua harga sudah sesuai"
                  class="mt-2"
               />
            </template>
         </UCard>
      </div>
   </div>
   <UCard class="mt-4">
      <template #header>
         <h2 class="text-lg font-semibold">Hasil Perhitungan</h2>
      </template>
      <TableCalculationResult :data="itemDetails" />
   </UCard>
</template>
