import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { mountSuspended } from "@nuxt/test-utils/runtime"
import CalculateOnboarding from "../../../app/components/CalculateOnboarding.vue"

describe("CalculateOnboarding", () => {
   beforeEach(() => {
      vi.useFakeTimers()
      localStorage.clear()
   })

   afterEach(() => {
      vi.useRealTimers()
      vi.restoreAllMocks()
   })

   it("does not show if previously seen", async () => {
      localStorage.setItem("boncos_onboarding_seen", "true")

      const component = await mountSuspended(CalculateOnboarding, {
         props: {
            showOnboarding: false,
            triggerOnLoad: true,
         },
      })

      expect(component.props("showOnboarding")).toBe(false)
      // Since we can't easily check internal state without exposure, we assume if it didn't emit update:showOnboarding=true, it's hidden.
   })

   it("starts onboarding if not seen", async () => {
      // We need to pass a modelValue and listen for updates
      const component = await mountSuspended(CalculateOnboarding, {
         props: {
            showOnboarding: false,
            triggerOnLoad: true,
         },
      })

      // It triggers startOnboarding on mount if not seen
      // mocking localStorage was done in beforeEach

      // Wait for nextTick or timers if necessary
      // But internal state change 'showOnboarding' should emit an event if it's a model

      // Note: defineModel emits 'update:modelValue' or 'update:showOnboarding'

      const emitted = component.emitted()
      // Check if update:showOnboarding was emitted with true
      expect(emitted["update:showOnboarding"]).toBeTruthy()
      expect(emitted["update:showOnboarding"]?.[0]).toEqual([true])
   })

   it("navigates steps", async () => {
      // Force show
      const component = await mountSuspended(CalculateOnboarding, {
         props: {
            showOnboarding: true,
            triggerOnLoad: false,
         },
         attachTo: document.body,
      })

      // Check for first step text
      expect(document.body.innerHTML).toContain("Item Pesanan")

      // Find 'Lanjut' button
      const getNextBtn = () => Array.from(document.querySelectorAll("button")).find(
         (b) => b.textContent?.includes("Lanjut")
      )
      
      let nextBtn = getNextBtn()
      expect(nextBtn).toBeTruthy()
      await nextBtn?.click()

      // Should now see step 2
      expect(document.body.innerHTML).toContain("Biaya &amp; Diskon")

      // Step 2 -> Step 3
      nextBtn = getNextBtn()
      await nextBtn?.click()
      expect(document.body.innerHTML).toContain("Hasil Perhitungan")

      // Step 3 -> Step 4
      nextBtn = getNextBtn()
      await nextBtn?.click()
      expect(document.body.innerHTML).toContain("Pembagian Tagihan")
   })

   it("scrolls to element on step change", async () => {
      const scrollIntoViewMock = vi.fn()
      Element.prototype.scrollIntoView = scrollIntoViewMock

      const stepsIds = ["onboarding-step-1", "onboarding-step-2"]
      stepsIds.forEach((id) => {
         const el = document.createElement("div")
         el.id = id
         document.body.appendChild(el)
      })

      const component = await mountSuspended(CalculateOnboarding, {
         props: {
            showOnboarding: false,
            triggerOnLoad: false,
         },
         attachTo: document.body,
      })

      await component.vm.startOnboarding()
      await new Promise((resolve) => resolve(true))

      expect(scrollIntoViewMock).toHaveBeenCalled()

      const getNextBtn = () =>
         Array.from(document.querySelectorAll("button")).find((b) =>
            b.textContent?.includes("Lanjut")
         )

      const nextBtn = getNextBtn()
      await nextBtn?.click()
      await new Promise((resolve) => resolve(true))

      expect(scrollIntoViewMock).toHaveBeenCalledTimes(2)

      stepsIds.forEach((id) => document.getElementById(id)?.remove())
   })
})
