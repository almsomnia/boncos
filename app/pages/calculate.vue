<script setup lang="ts">
import type { PeopleAssignment } from "#shared/types"

definePageMeta({
   title: "Kalkulator Tagihan",
})

useSeoMeta({
   title: "Kalkulator Tagihan",
})

type SharePayload = {
   items: Partial<Item>[]
   discount: number | undefined
   additional_costs: Partial<AdditionalCost>[]
   subtotal: number
   total: number
   calculation_result: CalculationDetail[]
   people_assignment?: PeopleAssignment[]
}

const editMode = shallowRef(true)

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

const { people, resetPeople } = usePeopleAssignment()

addItem()
addAdditionalCost()

const route = useRoute()
if (route.query.share && typeof route.query.share === "string") {
   editMode.value = false
   const data = $base64Decode(route.query.share, true)
   const result = JSON.parse(data) as SharePayload
   items.value = result.items
   discount.value = result.discount
   additionalCosts.value = result.additional_costs
   if (result.people_assignment) {
      people.value = result.people_assignment
   }
} else {
   resetPeople()
}

const shareModal = shallowRef(false)
const shareOptions = reactive({
   result: true,
   assignment: false,
})

const shareValue = computed(() => {
   const payload: SharePayload = {
      items: items.value,
      discount: discount.value,
      additional_costs: additionalCosts.value,
      subtotal: subtotal.value,
      total: total.value,
      calculation_result: calculationDetails.value,
   }

   if (shareOptions.assignment) {
      payload.people_assignment = people.value
   }

   return $base64Encode(JSON.stringify(payload), true)
})

const shareUrl = computed(() => {
   return `${window.location.origin}${window.location.pathname}?share=${shareValue.value}`
})

function onOpenShareModal() {
   if (people.value.length > 0) {
      shareOptions.assignment = true
   }
   shareModal.value = true
}

const toast = useToast()
function copyToClipboard(text: string) {
   navigator.clipboard.writeText(text)
   toast.add({
      title: "Link berhasil disalin",
      icon: "lucide:check",
      color: "success",
   })
}

async function onShareExternal() {
   let shareText = ""

   if (shareOptions.result) {
      shareText += calculationDetails.value
         .map((item) => {
            return [
               `*${item.item.name}* (${item.item.qty} pcs)`,
               `Harga per item (sebelum diskon): *${$formatCurrency(item.item.unitPrice)}*`,
               `Harga per item (setelah diskon): *${$formatCurrency(item.result.finalUnitPrice)}*`,
            ].join("\n")
         })
         .join("\n\n")
   }

   if (shareOptions.assignment && people.value.length > 0) {
      if (shareText) shareText += "\n\n---\n\n"
      shareText += "*Pembagian Tagihan*\n\n"
      shareText += people.value
         .map((p, i) => {
            const total = p.items.reduce(
               (acc, item) => acc + item.finalUnitPrice,
               0
            )
            return `*${p.name || "Orang #" + (i + 1)}*: ${$formatCurrency(total)}`
         })
         .join("\n")
   }

   try {
      await navigator.share({
         title: "Hasil Perhitungan Tagihan - Boncos",
         text: `\n\n${shareText}\n\n`,
      })
      toast.add({
         title: "Berhasil membagikan",
         icon: "lucide:check",
         color: "success",
      })
   } catch (e) {
      console.error("Share failed:", e)
      toast.add({
         title: "Gagal membagikan",
         description: (e as Error).message,
         icon: "lucide:alert-circle",
         color: "error",
      })
   }
}

const calculateOnboardingRef = useTemplateRef("calculateOnboardingRef")
function startOnboarding() {
   if (!calculateOnboardingRef.value) return
   calculateOnboardingRef.value.startOnboarding()
}
const showOnboarding = shallowRef(false)
</script>

<template>
   <AppPage>
      <template #links>
         <UBadge
            v-if="!editMode"
            label="Read-only Mode"
            icon="lucide:lock"
            color="neutral"
            variant="subtle"
         />
         <UButton
            v-if="editMode"
            label="Lihat Tutorial"
            icon="lucide:circle-help"
            variant="link"
            color="neutral"
            @click="startOnboarding"
         />
      </template>
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-5">
         <div
            id="onboarding-step-1"
            class="col-span-full lg:col-span-3"
         >
            <UCard>
               <template #header>
                  <h2 class="text-lg font-semibold">Item</h2>
                  <p class="text-muted text-sm text-pretty">
                     {{
                        editMode ?
                           "Masukin item yang dipesan"
                        :  "Daftar item yang dipesan"
                     }}
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
                           :readonly="!editMode"
                           @keydown.enter="addItem"
                        />
                        <UInputNumber
                           v-model="item.price"
                           placeholder="Harga item"
                           class="w-full"
                           :increment="false"
                           :decrement="false"
                           :readonly="!editMode"
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
                           :readonly="!editMode"
                           class="w-full"
                           @keydown.enter="addItem"
                        />
                        <UButton
                           v-if="editMode"
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
                  <li v-if="editMode">
                     <UButton
                        block
                        label="Tambah Item"
                        variant="soft"
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
         <div
            id="onboarding-step-2"
            class="col-span-full lg:col-span-2"
         >
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
                              :readonly="!editMode"
                              class="w-full"
                              @keydown.enter="addAdditionalCost"
                           />
                           <UInputNumber
                              v-model="cost.amount"
                              class="w-full"
                              placeholder="Harga"
                              :increment="false"
                              :decrement="false"
                              :readonly="!editMode"
                              :format-options="{
                                 style: 'currency',
                                 currency: 'IDR',
                                 currencyDisplay: 'narrowSymbol',
                              }"
                              @keydown.enter="addAdditionalCost"
                           />
                           <UButton
                              v-if="editMode"
                              icon="lucide:trash"
                              color="error"
                              variant="subtle"
                              size="sm"
                              @click="removeAdditionalCost(index)"
                              :disabled="additionalCosts.length < 2"
                           />
                        </UFieldGroup>
                        <UButton
                           v-if="editMode"
                           block
                           label="Tambah Biaya Tambahan"
                           icon="lucide:plus"
                           variant="soft"
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
                        :readonly="!editMode"
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
      <UCard
         id="onboarding-step-3"
         class="mt-4"
      >
         <template #header>
            <h2 class="text-lg font-semibold">Hasil Perhitungan</h2>
         </template>
         <TableCalculationResult :data="calculationDetails" />
      </UCard>
      <UCard
         id="onboarding-step-4"
         class="mt-4"
      >
         <template #header>
            <div class="flex items-center justify-between">
               <h2 class="text-lg font-semibold">Pembagian Tagihan</h2>
            </div>
         </template>
         <CalculationPeopleAssignment :items="calculationDetails ?? []" />
      </UCard>
   </AppPage>

   <!-- Floating share button -->
   <div class="fixed inset-x-0 bottom-4 z-20 flex items-center justify-center">
      <UButton
         label="Bagikan"
         icon="lucide:share"
         size="lg"
         color="neutral"
         :ui="{
            base: 'border-4 border-accented/25 rounded-full shadow hover:shadow-lg',
         }"
         @click="onOpenShareModal"
      />
   </div>

   <!-- Share modal -->
   <UModal
      v-model:open="shareModal"
      title="Bagikan Hasil Perhitungan"
   >
      <template #body>
         <p class="text-muted text-sm text-pretty">
            Salin link berikut untuk membagikan hasil perhitungan ini
         </p>
         <div class="mt-4 space-y-4">
            <UFieldGroup class="w-full">
               <UInput
                  :model-value="shareUrl"
                  readonly
                  class="w-full"
               />
               <UButton
                  icon="lucide:copy"
                  color="primary"
                  variant="subtle"
                  square
                  @click="copyToClipboard(shareUrl)"
               />
            </UFieldGroup>

            <div class="grid grid-cols-2 gap-4">
               <label
                  for="share-calculation"
                  class="block"
               >
                  <input
                     type="checkbox"
                     v-model="shareOptions.result"
                     id="share-calculation"
                     class="peer hidden"
                  />
                  <div
                     class="peer-disabled:bg-muted/50 peer-disabled:text-muted rounded-lg border border-dashed p-4 transition"
                     :class="{
                        'border-muted': !shareOptions.result,
                        'border-primary bg-primary/5': shareOptions.result,
                     }"
                  >
                     <div class="flex flex-col items-center">
                        <div
                           class="bg-muted text-muted flex size-8 items-center justify-center rounded-full"
                        >
                           <UIcon name="lucide:calculator" />
                        </div>
                        <div class="mt-4 text-center">
                           <h4 class="text-sm font-semibold">
                              Hasil Perhitungan
                           </h4>
                           <p
                              class="text-muted mt-1 line-clamp-2 text-xs text-pretty"
                           >
                              Rincian harga sebelum dan setelah dilakukan
                              perhitungan
                           </p>
                        </div>
                     </div>
                  </div>
               </label>
               <label
                  for="share-assignment"
                  class="block has-disabled:cursor-not-allowed"
               >
                  <input
                     type="checkbox"
                     v-model="shareOptions.assignment"
                     id="share-assignment"
                     class="peer hidden"
                     :disabled="people.length === 0"
                  />
                  <div
                     class="peer-disabled:bg-muted/50 peer-disabled:text-muted rounded-lg border border-dashed p-4 transition"
                     :class="{
                        'border-muted': !shareOptions.assignment,
                        'border-primary bg-primary/5': shareOptions.assignment,
                     }"
                  >
                     <div class="flex flex-col items-center">
                        <div
                           class="bg-muted text-muted flex size-8 items-center justify-center rounded-full"
                        >
                           <UIcon name="lucide:users" />
                        </div>
                        <div class="mt-4 text-center">
                           <h4 class="text-sm font-semibold">
                              Pembagian Tagihan
                           </h4>
                           <p
                              class="text-muted mt-1 line-clamp-2 text-xs text-pretty"
                           >
                              Rincian pembagian tagihan per orang
                           </p>
                        </div>
                     </div>
                  </div>
               </label>
            </div>
         </div>
      </template>
      <template #footer>
         <div class="flex-1" />
         <UButton
            label="Tutup"
            color="neutral"
            icon="lucide:x"
            variant="soft"
            @click="shareModal = false"
         />
         <UButton
            label="Bagikan"
            color="primary"
            icon="lucide:share"
            @click="onShareExternal"
            :disabled="Object.values(shareOptions).every((value) => !value)"
         />
      </template>
   </UModal>

   <!-- Onboarding -->
   <CalculateOnboarding
      ref="calculateOnboardingRef"
      v-model:show-onboarding="showOnboarding"
      :trigger-on-load="editMode"
   />
</template>
