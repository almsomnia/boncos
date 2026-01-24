<script setup lang="ts">
definePageMeta({
   title: "Kalkulator Tagihan",
})

useSeoMeta({
   title: "Kalkulator Tagihan"
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

// --- Onboarding Logic ---
const showOnboarding = shallowRef(false)
const currentStep = shallowRef(0)
const onboardingPosition = shallowRef<"bottom" | "top">("bottom")
const steps = [
   {
      id: "onboarding-step-1",
      title: "Item Pesanan",
      message:
         "Masukkan semua item yang dipesan beserta jumlah dan harga per itemnya.",
   },
   {
      id: "onboarding-step-2",
      title: "Biaya & Diskon",
      message:
         "Biaya tambahan (ongkir, pajak) dan diskon akan dibagi secara proporsional ke semua item.",
   },
   {
      id: "onboarding-step-3",
      title: "Hasil Perhitungan",
      message:
         "Hasil perhitungan akan muncul di sini. Totalnya selalu sama dengan struk asli.",
   },
]

const targetRect = ref({ top: 0, left: 0, width: 0, height: 0 })

const updateRect = () => {
   if (!showOnboarding.value || !steps[currentStep.value]) return
   const el = document.getElementById(steps[currentStep.value]!.id)
   if (el) {
      const rect = el.getBoundingClientRect()
      targetRect.value = {
         top: rect.top,
         left: rect.left,
         width: rect.width,
         height: rect.height,
      }

      const spaceBelow = window.innerHeight - rect.bottom
      onboardingPosition.value = spaceBelow < 250 ? "top" : "bottom"
   }
}

const nextStep = () => {
   if (currentStep.value < steps.length - 1) {
      currentStep.value++
   } else {
      finishOnboarding()
   }
}

const prevStep = () => {
   if (currentStep.value > 0) {
      currentStep.value--
   }
}

const finishOnboarding = () => {
   showOnboarding.value = false
   localStorage.setItem("boncos_onboarding_seen", "true")
   window.removeEventListener("resize", updateRect)
   window.removeEventListener("scroll", updateRect, true)
}

const skipOnboarding = () => {
   finishOnboarding()
}

const startOnboarding = () => {
   currentStep.value = 0
   showOnboarding.value = true
   nextTick(() => {
      updateRect()
   })
   window.addEventListener("resize", updateRect)
   window.addEventListener("scroll", updateRect, true)
}

onMounted(() => {
   const hasSeen = localStorage.getItem("boncos_onboarding_seen")
   if (!hasSeen) {
      startOnboarding()
   }
})

onUnmounted(() => {
   window.removeEventListener("resize", updateRect)
   window.removeEventListener("scroll", updateRect, true)
})

watch(currentStep, () => {
   nextTick(() => updateRect())
})
</script>

<template>
   <AppPage>
      <template #links>
         <UButton
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
      <UCard
         id="onboarding-step-3"
         class="mt-4"
      >
         <template #header>
            <h2 class="text-lg font-semibold">Hasil Perhitungan</h2>
         </template>
         <TableCalculationResult :data="calculationDetails" />
      </UCard>
   </AppPage>

   <!-- Onboarding Overlay -->
   <Teleport to="body">
      <div
         v-if="showOnboarding"
         class="fixed inset-0 isolate z-9999 overflow-hidden"
      >
         <!-- Backdrop with hole -->
         <svg
            class="pointer-events-none absolute inset-0 h-full w-full transition-all duration-300 ease-in-out"
            width="100%"
            height="100%"
         >
            <defs>
               <mask id="hole">
                  <rect
                     width="100%"
                     height="100%"
                     fill="white"
                  />
                  <rect
                     :x="targetRect.left - 4"
                     :y="targetRect.top - 4"
                     :width="targetRect.width + 8"
                     :height="targetRect.height + 8"
                     rx="12"
                     fill="black"
                  />
               </mask>
            </defs>
            <rect
               width="100%"
               height="100%"
               fill="rgba(0,0,0,0.6)"
               mask="url(#hole)"
            />
            <!-- Highlight border -->
            <rect
               :x="targetRect.left - 4"
               :y="targetRect.top - 4"
               :width="targetRect.width + 8"
               :height="targetRect.height + 8"
               rx="12"
               fill="none"
               stroke="var(--ui-primary)"
               stroke-width="2"
               class="transition-all duration-300 ease-in-out"
            />
         </svg>

         <!-- Floating Card -->
         <div
            class="absolute z-10 w-80 max-w-[90vw] transition-all duration-300 ease-in-out"
            :style="{
               top:
                  onboardingPosition === 'bottom' ?
                     `${targetRect.top + targetRect.height + 16}px`
                  :  `${targetRect.top - 16}px`,
               left: `${targetRect.left + targetRect.width / 2}px`,
               transform:
                  onboardingPosition === 'bottom' ? 'translateX(-50%)' : (
                     'translateX(-50%) translateY(-100%)'
                  ),
            }"
         >
            <UCard class="shadow-2xl">
               <template #header>
                  <div class="flex items-center justify-between">
                     <h3 class="font-semibold">
                        {{ steps[currentStep]?.title }}
                     </h3>
                     <span class="text-muted text-xs">
                        {{ currentStep + 1 }} / {{ steps.length }}
                     </span>
                  </div>
               </template>

               <p class="text-muted text-sm text-pretty">
                  {{ steps[currentStep]?.message }}
               </p>

               <template #footer>
                  <div class="flex items-center justify-between gap-2">
                     <UButton
                        color="neutral"
                        variant="ghost"
                        size="sm"
                        @click="skipOnboarding"
                     >
                        Lewati
                     </UButton>
                     <div class="flex gap-2">
                        <UButton
                           v-if="currentStep > 0"
                           color="neutral"
                           variant="outline"
                           size="sm"
                           icon="lucide:arrow-left"
                           @click="prevStep"
                        >
                           Kembali
                        </UButton>
                        <UButton
                           size="sm"
                           :trailing-icon="
                              currentStep < steps.length - 1 ?
                                 'lucide:arrow-right'
                              :  'lucide:check'
                           "
                           @click="nextStep"
                        >
                           {{
                              currentStep < steps.length - 1 ?
                                 "Lanjut"
                              :  "Selesai"
                           }}
                        </UButton>
                     </div>
                  </div>
               </template>
            </UCard>
         </div>
      </div>
   </Teleport>
</template>
