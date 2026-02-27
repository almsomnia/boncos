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
watch(
   locale,
   (value) => {
      route.meta.title = $t("calculate.page.title")
   },
   { immediate: true }
)

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

function onOpenShareModal() {
   if (people.value.length > 0) {
      shareOptions.assignment = true
   }
   shareModal.value = true
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
    <ModalShareCalculation
      v-model:show="shareModal"
      :share-value="shareValue"
      v-model:payment-info="paymentInfo"
      @payment-info:add="addPaymentInfo"
      @payment-info:remove="removePaymentInfo"
      :edit-mode="editMode"
      :calculation-details="calculationDetails"
      :people="people"
    />

   <!-- Onboarding -->
   <CalculateOnboarding
      ref="calculateOnboardingRef"
      v-model:show-onboarding="showOnboarding"
      :trigger-on-load="editMode"
   />
</template>
