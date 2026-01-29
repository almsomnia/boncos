<script setup lang="ts">
const props = withDefaults(
   defineProps<{
      triggerOnLoad?: boolean
   }>(),
   {
      triggerOnLoad: true,
   }
)

const showOnboarding = defineModel<boolean>("showOnboarding", {
   required: true,
   default: false,
})

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
   {
      id: "onboarding-step-4",
      title: "Pembagian Tagihan",
      message:
         "Bagikan tagihan ke temanmu di sini. Semuanya akan dihitung secara adil sesuai dengan pesanannya.",
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
   window.scrollTo({ top: 0, behavior: "smooth" })
}

const skipOnboarding = () => {
   finishOnboarding()
}

const scrollToTarget = () => {
   if (!steps[currentStep.value]) return
   const el = document.getElementById(steps[currentStep.value]!.id)
   el?.scrollIntoView({ behavior: "smooth", block: "center" })
}

const startOnboarding = () => {
   currentStep.value = 0
   showOnboarding.value = true
   nextTick(() => {
      scrollToTarget()
      updateRect()
   })
   window.addEventListener("resize", updateRect)
   window.addEventListener("scroll", updateRect, true)
}

onMounted(() => {
   if (props.triggerOnLoad) {
      const hasSeen = localStorage.getItem("boncos_onboarding_seen")
      if (!hasSeen) {
         startOnboarding()
      }
   }
})

onUnmounted(() => {
   window.removeEventListener("resize", updateRect)
   window.removeEventListener("scroll", updateRect, true)
})

watch(currentStep, () => {
   nextTick(() => {
      scrollToTarget()
      updateRect()
   })
})

defineExpose({
   startOnboarding: () => startOnboarding(),
   finishOnboarding: () => finishOnboarding(),
})
</script>

<template>
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
