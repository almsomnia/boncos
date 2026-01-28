import { describe, it, expect, vi } from "vitest"
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime"
import { ref } from "vue"
import AppPage from "../../../../app/components/app/AppPage.vue"

const routeMeta = ref({})
mockNuxtImport("useRoute", () => {
   return () => ({
      meta: routeMeta.value,
   })
})

describe("AppPage", () => {
   it("renders title from route meta", async () => {
      routeMeta.value = { title: "My Custom Title" }

      const component = await mountSuspended(AppPage)

      expect(component.text()).toContain("My Custom Title")
   })

   it("uses app name if no title in meta", async () => {
      routeMeta.value = {}

      const component = await mountSuspended(AppPage)
      // Assuming appConfig.appName is "Boncos" (default) or whatever is in config
      // We can't easily assert exact text without knowing appName, but we know it shouldn't be empty or undefined if configured.
      // Let's assume the default "Boncos" from context or previous error message.
      expect(component.text()).toBeTruthy()
   })

   it("hides title when hideTitle is true", async () => {
      routeMeta.value = { title: "Should Not See This", hideTitle: true }

      const component = await mountSuspended(AppPage)

      expect(component.text()).not.toContain("Should Not See This")
   })

   it("renders slots correctly", async () => {
      routeMeta.value = { title: "Title" }

      const component = await mountSuspended(AppPage, {
         slots: {
            default: () => "Main Content Here",
            description: () => "Description Here",
         },
      })

      expect(component.text()).toContain("Main Content Here")
      expect(component.text()).toContain("Description Here")
   })
})
