<script setup lang="ts">
definePageMeta({
   title: "Kalkulator Tagihan",
})

const {
   items,
   discount,
   additionalCosts,
   addItem,
   removeItem,
   addAdditionalCost,
   removeAdditionalCost,
   subtotal,
   total,
   calculationDetails,
} = useCalculator()

addItem()
addAdditionalCost()
</script>

<template>
   <div class="grid grid-cols-1 gap-4 lg:grid-cols-5">
      <div class="col-span-full lg:col-span-3">
         <UCard>
            <template #header>
               <h2 class="text-lg font-semibold">Item</h2>
               <p class="text-muted text-sm text-pretty">
                  Masukin item yang dipesan
               </p>
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
                        @keydown.enter="addItem"
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
                        @keydown.enter="addItem"
                     />
                     <UInputNumber
                        v-model="item.qty"
                        placeholder="Jumlah"
                        :increment="false"
                        :decrement="false"
                        class="w-full"
                        @keydown.enter="addItem"
                     />
                     <UButton
                        icon="lucide:trash"
                        color="error"
                        variant="subtle"
                        size="sm"
                        square
                        @click="removeItem(index)"
                        :disabled="items.length < 2"
                     />
                  </UFieldGroup>
               </li>
               <li>
                  <UButton
                     block
                     label="Tambah Item"
                     icon="lucide:plus"
                     @click="addItem"
                  />
               </li>
            </ul>
            <template #footer>
               <div class="space-y-4">
                  <div class="text-toned flex text-sm">
                     <span class="w-3/5"> Subtotal </span>
                     <span class="w-2/5 text-right">
                        {{ $formatCurrency(subtotal) }}
                     </span>
                  </div>
               </div>
            </template>
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
                           @keydown.enter="addAdditionalCost"
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
                           @keydown.enter="addAdditionalCost"
                        />
                        <UButton
                           icon="lucide:trash"
                           color="error"
                           variant="subtle"
                           size="sm"
                           @click="removeAdditionalCost(index)"
                           :disabled="additionalCosts.length < 2"
                        />
                     </UFieldGroup>
                     <UButton
                        block
                        label="Tambah Biaya Tambahan"
                        icon="lucide:plus"
                        class="mt-2"
                        @click="addAdditionalCost"
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
      <TableCalculationResult :data="calculationDetails" />
   </UCard>
</template>
