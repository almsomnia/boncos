<script setup lang="ts">
const showModel = defineModel<boolean>("show", {
   required: true,
   default: false,
})

const paymentInfo = defineModel<any[]>("paymentInfo", {
   required: true,
   default: () => [],
})

const props = defineProps<{
   editMode?: boolean
   people: PeopleAssignment[]
   calculationDetails: CalculationDetail[]
   shareValue: string
}>()

const emit = defineEmits<{
   "paymentInfo:add": []
   "paymentInfo:remove": [index: number]
   "paymentInfo:reset": []
}>()

const toast = useToast()

const shareUrl = computed(() => {
   return `${window.location.origin}${window.location.pathname}?share=${props.shareValue}`
})

function copyToClipboard(text: string) {
   navigator.clipboard.writeText(text)
   toast.add({
      title: $t("calculate.share.modal.toast.copyLink.success"),
      icon: "lucide:check",
      color: "success",
   })
}

const shareOptionModel = reactive({
   result: true,
   assignment: false,
})

const shareOptions = computed(() => {
   return [
      {
         key: "share-calculation",
         modelKey: "result" as keyof typeof shareOptionModel,
         icon: "lucide:calculator",
         label: $t("calculate.share.modal.text.options.result"),
         disabled: false,
      },
      {
         key: "share-assignment",
         modelKey: "assignment" as keyof typeof shareOptionModel,
         icon: "lucide:users",
         label: $t("calculate.share.modal.text.options.assignment"),
         disabled: props.people.length === 0,
      },
   ]
})

function addPaymentInfo() {
   emit("paymentInfo:add")
}

function removePaymentInfo(index: number) {
   emit("paymentInfo:remove", index)
}

function resetPaymentInfo() {
   emit("paymentInfo:reset")
}

const resetPaymentPopoverModel = ref(false)
function closeResetPaymentPopover() {
   resetPaymentPopoverModel.value = false
}

function generateShareText() {
   let shareText = ""

   if (shareOptionModel.result) {
      shareText += props.calculationDetails
         .map((item) => {
            return [
               `*${item.item.name}* (${$t("calculate.share.modal.shareText.item.qty", { count: item.item.qty })})`,
               `${$t("calculate.share.modal.shareText.item.unitPriceBefore")} *${$formatCurrency(item.item.unitPrice)}*`,
               `${$t("calculate.share.modal.shareText.item.unitPriceAfter")} *${$formatCurrency(item.result.finalUnitPrice)}*`,
            ].join("\n")
         })
         .join("\n\n")
   }

   if (shareOptionModel.assignment && props.people.length > 0) {
      if (shareText) shareText += "\n\n---\n\n"
      shareText += `*${$t("calculate.share.modal.shareText.assignment.title")}*\n\n`
      shareText += props.people
         .map((p, i) => {
            const total = p.items.reduce(
               (acc, item) => acc + item.finalUnitPrice,
               0
            )
            const personLabel =
               p.name ||
               $t("calculate.share.modal.shareText.assignment.person", {
                  count: i + 1,
               })
            return `*${personLabel}*: ${$formatCurrency(total)}`
         })
         .join("\n")
   }

   const validPayments = paymentInfo.value.filter(
      (p: any) => p.name || p.account
   )
   if (validPayments.length > 0) {
      if (shareText) shareText += "\n\n---\n\n"
      shareText += `*${$t("calculate.share.modal.shareText.payment.title")}*\n\n`
      shareText += validPayments
         .map((p: any) => {
            return `${p.name}: ${p.account}`
         })
         .join("\n")
   }

   shareText += `\n\n===\n\n`
   shareText += `${$t("calculate.share.modal.shareText.footer")} ${window.location.origin}`

   return shareText
}

async function onCopyAsText() {
   const shareText = generateShareText()
   try {
      await navigator.clipboard.writeText(shareText)
      toast.add({
         title: $t("calculate.share.modal.toast.copyText.success"),
         icon: "lucide:check",
         color: "success",
      })
   } catch (e) {
      console.error("Copy failed:", e)
      toast.add({
         title: $t("calculate.share.modal.toast.copyText.error"),
         description: (e as Error).message,
         icon: "lucide:alert-circle",
         color: "error",
      })
   }
}

async function onShareExternal() {
   const shareText = generateShareText()

   try {
      await navigator.share({
         title: "Hasil Perhitungan Tagihan",
         text: `\n\n${shareText}\n\n`,
      })
      toast.add({
         title: $t("calculate.share.modal.toast.share.success"),
         icon: "lucide:check",
         color: "success",
      })
   } catch (e) {
      if ((e as Error).name === "AbortError") return

      console.error("Share failed:", e)
      toast.add({
         title: $t("calculate.share.modal.toast.share.error"),
         description: (e as Error).message,
         icon: "lucide:alert-circle",
         color: "error",
      })
   }
}
</script>

<template>
   <UModal
      v-model:open="showModel"
      :title="$t('calculate.share.modal.title')"
   >
      <template #body>
         <p class="text-muted text-sm text-pretty">
            {{ $t("calculate.share.modal.url.description") }}
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

            <USeparator :label="$t('calculate.share.modal.separator')" />

            <p class="text-muted text-sm">
               {{ $t("calculate.share.modal.text.description") }}
            </p>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
               <label
                  v-for="option in shareOptions"
                  :key="option.key"
                  :for="option.key"
                  class="block cursor-pointer has-disabled:cursor-not-allowed"
               >
                  <input
                     type="checkbox"
                     v-model="shareOptionModel[option.modelKey]"
                     :id="option.key"
                     class="peer hidden"
                     :disabled="option.disabled"
                  />
                  <div
                     class="peer-disabled:bg-muted/50 peer-disabled:text-muted h-full rounded-lg border border-dashed p-4 transition"
                     :class="[
                        shareOptionModel[option.modelKey] ?
                           'border-primary bg-primary/5'
                        :  'border-muted',
                     ]"
                  >
                     <div class="flex flex-col items-center">
                        <div
                           class="flex size-8 items-center justify-center rounded-full transition"
                           :class="[
                              shareOptionModel[option.modelKey] ?
                                 'bg-primary text-inverted'
                              :  'bg-muted text-muted',
                           ]"
                        >
                           <UIcon :name="option.icon" />
                        </div>
                        <div class="mt-4 text-center">
                           <h4 class="text-sm font-semibold">
                              {{ option.label }}
                           </h4>
                        </div>
                     </div>
                  </div>
               </label>
            </div>
            <UCard :ui="{ body: 'sm:p-4' }">
               <div class="flex items-center justify-between">
                  <h3 class="font-medium">
                     {{ $t("calculate.share.modal.payment.title") }}
                  </h3>
                  <UPopover
                     v-if="paymentInfo.length > 0"
                     v-model:open="resetPaymentPopoverModel"
                  >
                     <UButton
                        color="error"
                        variant="ghost"
                        size="xs"
                        icon="lucide:rotate-ccw"
                        :label="
                           $t(
                              'calculate.share.modal.payment.form.actions.reset'
                           )
                        "
                     />

                     <template #content>
                        <div class="p-4">
                           <p class="mb-4 text-sm font-medium">
                              {{
                                 $t(
                                    "calculate.share.modal.payment.form.actions.resetConfirm.title"
                                 )
                              }}
                           </p>
                           <div class="flex justify-end gap-2">
                              <UButton
                                 color="neutral"
                                 variant="ghost"
                                 size="xs"
                                 :label="
                                    $t(
                                       'calculate.share.modal.payment.form.actions.resetConfirm.cancel'
                                    )
                                 "
                                 @click="closeResetPaymentPopover"
                              />
                              <UButton
                                 color="error"
                                 size="xs"
                                 :label="
                                    $t(
                                       'calculate.share.modal.payment.form.actions.resetConfirm.confirm'
                                    )
                                 "
                                 @click="resetPaymentInfo"
                              />
                           </div>
                        </div>
                     </template>
                  </UPopover>
               </div>
               <div class="mt-4 space-y-4">
                  <UEmpty
                     v-if="paymentInfo.length === 0"
                     icon="lucide:credit-card"
                     :title="$t('calculate.share.modal.payment.empty.title')"
                     variant="naked"
                     :actions="[
                        {
                           label: $t(
                              'calculate.share.modal.payment.empty.actions.add'
                           ),
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
                              :placeholder="
                                 $t(
                                    'calculate.share.modal.payment.form.input.name.placeholder'
                                 )
                              "
                              :readonly="!editMode"
                              class="flex-1"
                           />
                           <UInput
                              v-model="payment.account"
                              :placeholder="
                                 $t(
                                    'calculate.share.modal.payment.form.input.account.placeholder'
                                 )
                              "
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
                        :label="
                           $t('calculate.share.modal.payment.form.actions.add')
                        "
                        icon="lucide:plus"
                        variant="soft"
                        block
                        @click="addPaymentInfo"
                     />
                  </template>
               </div>
            </UCard>
            <div class="flex items-center justify-end gap-2">
               <UButton
                  :label="$t('calculate.share.modal.actions.share')"
                  variant="outline"
                  color="primary"
                  icon="lucide:share"
                  @click="onShareExternal"
                  :disabled="
                     Object.values(shareOptionModel).every((value) => !value)
                  "
               />
               <UButton
                  :label="$t('calculate.share.modal.actions.copyText')"
                  icon="lucide:copy"
                  @click="onCopyAsText"
                  :disabled="
                     Object.values(shareOptionModel).every((value) => !value)
                  "
               />
            </div>
         </div>
      </template>
   </UModal>
</template>
