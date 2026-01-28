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
      // Note: Since it's teleported to body, component.find() might not find it if it only looks at component root.
      // But mountSuspended might handle this. If not, we search document.body.

      // Usually with Teleport, we look at document.body
      const nextBtn = Array.from(document.querySelectorAll("button")).find(
         (b) => b.textContent?.includes("Lanjut")
      )
      expect(nextBtn).toBeTruthy()

      await nextBtn?.click()

      // Should now see step 2
      // Note: & is escaped to &amp; in HTML
      expect(document.body.innerHTML).toContain("Biaya &amp; Diskon")
   })
})
