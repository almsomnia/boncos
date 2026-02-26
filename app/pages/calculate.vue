<script setup lang="ts">
import type { PeopleAssignment } from "#shared/types"

useSeoMeta({
   title: "Kalkulator Tagihan",
   robots: "noindex, nofollow",
})

type SharePayload = {
   items: Partial<Item>[]
   discount: number | undefined
   additional_costs: Partial<AdditionalCost>[]
   payment_info?: { name: string; account: string }[]
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
   paymentInfo,
   addPaymentInfo,
   removePaymentInfo,
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
   if (result.payment_info) {
      paymentInfo.value = result.payment_info
   }
   if (result.people_assignment) {
      people.value = result.people_assignment
   }
} else {
   resetPeople()
}

const { locale } = useI18n()
watch(locale, (value) => {
   route.meta.title = $t("calculate.page.title")
}, { immediate: true })

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

   // Always include payment info if it has at least one valid entry
   const validPayments = paymentInfo.value.filter((p) => p.name || p.account)
   if (validPayments.length > 0) {
      payload.payment_info = validPayments
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

   const validPayments = paymentInfo.value.filter((p) => p.name || p.account)
   if (validPayments.length > 0) {
      if (shareText) shareText += "\n\n---\n\n"
      shareText += "*Informasi Pembayaran*\n\n"
      shareText += validPayments
         .map((p) => {
            return `${p.name}: ${p.account}`
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
            :label="$t('calculate.page.actions.secondary')"
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
                  <h2 class="text-lg font-semibold">
                     {{ $t("calculate.items.title") }}
                  </h2>
                  <p class="text-muted text-sm text-pretty">
                     {{
                        editMode ?
                           $t("calculate.items.subtitle")
                        :  $t("calculate.items.readOnlySubtitle")
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
                           :placeholder="
                              $t(
                                 'calculate.items.form.input.itemName.placeholder'
                              )
                           "
                           class="w-full"
                           :readonly="!editMode"
                           @keydown.enter="addItem"
                        />
                        <UInputNumber
                           v-model="item.price"
                           :placeholder="
                              $t(
                                 'calculate.items.form.input.itemPrice.placeholder'
                              )
                           "
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
                           :placeholder="
                              $t(
                                 'calculate.items.form.input.itemQuantity.placeholder'
                              )
                           "
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
                        :label="$t('calculate.items.form.actions.add')"
                        variant="soft"
                        icon="lucide:plus"
                        @click="addItem"
                     />
                  </li>
               </ul>
               <template #footer>
                  <div class="space-y-4">
                     <div class="text-toned flex text-sm">
                        <span class="w-3/5">
                           {{ $t("calculate.items.summary.subtotal") }}
                        </span>
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
                     :label="$t('calculate.additionals.title')"
                     :description="$t('calculate.additionals.subtitle')"
                  >
                     <div class="space-y-2">
                        <UFieldGroup
                           v-for="(cost, index) in additionalCosts"
                           :key="index"
                           class="w-full"
                        >
                           <UInput
                              v-model="cost.name"
                              :placeholder="
                                 $t(
                                    'calculate.additionals.form.input.additionalName.placeholder'
                                 )
                              "
                              :readonly="!editMode"
                              class="w-full"
                              @keydown.enter="addAdditionalCost"
                           />
                           <UInputNumber
                              v-model="cost.amount"
                              class="w-full"
                              :placeholder="
                                 $t(
                                    'calculate.additionals.form.input.additionalPrice.placeholder'
                                 )
                              "
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
                           :label="$t('calculate.additionals.form.actions.add')"
                           icon="lucide:plus"
                           variant="soft"
                           class="mt-2"
                           @click="addAdditionalCost"
                        />
                     </div>
                  </UFormField>
                  <UFormField
                     :label="$t('calculate.discount.title')"
                     :description="$t('calculate.discount.subtitle')"
                  >
                     <UInputNumber
                        v-model="discount"
                        :increment="false"
                        :decrement="false"
                        :readonly="!editMode"
                        :placeholder="
                           $t(
                              'calculate.discount.form.input.amount.placeholder'
                           )
                        "
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
                        <span class="w-3/5">
                           {{ $t("calculate.summary.total") }}
                        </span>
                        <span class="w-2/5 text-right">
                           {{ $formatCurrency(total) }}
                        </span>
                     </div>
                  </div>
                  <UAlert
                     :title="$t('calculate.summary.alert.title')"
                     color="info"
                     variant="subtle"
                     icon="lucide:info"
                     :description="$t('calculate.summary.alert.description')"
                     class="mt-2"
                  />
                  <UAlert
                     v-if="!editMode && paymentInfo.length > 0"
                     :title="$t('calculate.summary.payment.title')"
                     color="primary"
                     variant="subtle"
                     icon="lucide:credit-card"
                     class="mt-4"
                  >
                     <template #description>
                        <ul class="mt-2 space-y-1">
                           <li
                              v-for="(payment, index) in paymentInfo"
                              :key="index"
                              class="border-primary/10 flex flex-col border-b pb-1 last:border-0 last:pb-0"
                           >
                              <span class="text-sm font-medium">
                                 {{ payment.name }}
                              </span>
                              <span class="font-mono text-sm">
                                 {{ payment.account }}
                              </span>
                           </li>
                        </ul>
                     </template>
                  </UAlert>
               </template>
            </UCard>
         </div>
      </div>
      <UCard
         id="onboarding-step-3"
         class="mt-4"
      >
         <template #header>
            <h2 class="text-lg font-semibold">
               {{ $t("calculate.results.title") }}
            </h2>
         </template>
         <TableCalculationResult :data="calculationDetails" />
      </UCard>
      <UCard
         id="onboarding-step-4"
         class="mt-4"
      >
         <template #header>
            <div class="flex items-center justify-between">
               <h2 class="text-lg font-semibold">
                  {{ $t("calculate.distribution.title") }}
               </h2>
            </div>
         </template>
         <CalculationPeopleAssignment
            :items="calculationDetails ?? []"
            :editable="editMode"
         />
      </UCard>
   </AppPage>

   <!-- Floating share button -->
   <div
      class="pointer-events-none fixed inset-x-0 bottom-4 z-20 flex items-center justify-center"
   >
      <UButton
         :label="$t('calculate.share.label')"
         icon="lucide:share"
         size="lg"
         color="neutral"
         :ui="{
            base: 'border-4 border-accented/25 rounded-full shadow hover:shadow-lg cursor-pointer pointer-events-auto',
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

            <USeparator label="atau" />

            <p class="text-muted text-sm">
               Pilih informasi yang ingin dibagikan
            </p>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
               <label
                  for="share-calculation"
                  class="block cursor-pointer"
               >
                  <input
                     type="checkbox"
                     v-model="shareOptions.result"
                     id="share-calculation"
                     class="peer hidden"
                  />
                  <div
                     class="peer-disabled:bg-muted/50 peer-disabled:text-muted h-full rounded-lg border border-dashed p-4 transition"
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
                        </div>
                     </div>
                  </div>
               </label>
               <label
                  for="share-assignment"
                  class="block cursor-pointer has-disabled:cursor-not-allowed"
               >
                  <input
                     type="checkbox"
                     v-model="shareOptions.assignment"
                     id="share-assignment"
                     class="peer hidden"
                     :disabled="people.length === 0"
                  />
                  <div
                     class="peer-disabled:bg-muted/50 peer-disabled:text-muted h-full rounded-lg border border-dashed p-4 transition"
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
                        </div>
                     </div>
                  </div>
               </label>
            </div>
            <UCard :ui="{ body: 'sm:p-4' }">
               <h3 class="font-medium">Informasi Pembayaran</h3>
               <div class="mt-4 space-y-4">
                  <UEmpty
                     v-if="paymentInfo.length === 0"
                     icon="lucide:credit-card"
                     title="Tidak ada info pembayaran"
                     variant="naked"
                     :actions="[
                        {
                           label: 'Tambah Info Pembayaran',
                           icon: 'lucide:plus',
                           color: 'primary',
                           variant: 'soft',
                           onClick: () => {
                              addPaymentInfo()
                           },
                        },
                     ]"
                     :ui="{
                        title: 'text-sm',
                     }"
                  />
                  <template v-else>
                     <div
                        v-for="(payment, index) in paymentInfo"
                        :key="index"
                        class="flex gap-2"
                     >
                        <UFieldGroup class="w-full">
                           <UInput
                              v-model="payment.name"
                              placeholder="Nama Bank/App"
                              :readonly="!editMode"
                              class="flex-1"
                           />
                           <UInput
                              v-model="payment.account"
                              placeholder="No. Rekening"
                              :readonly="!editMode"
                              class="flex-2"
                           />
                           <UButton
                              v-if="editMode"
                              icon="lucide:trash"
                              color="error"
                              variant="subtle"
                              size="sm"
                              square
                              @click="removePaymentInfo(index)"
                           />
                        </UFieldGroup>
                     </div>
                     <UButton
                        v-if="editMode"
                        label="Tambah Info Pembayaran"
                        icon="lucide:plus"
                        variant="soft"
                        block
                        @click="addPaymentInfo"
                     />
                  </template>
               </div>
            </UCard>
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
