// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
   compatibilityDate: "2025-07-15",
   devtools: { enabled: true },
   modules: ["@nuxt/ui", "@nuxt/fonts", "@nuxt/icon"],
   css: ["@/assets/css/main.css"],
   fonts: {
      defaults: {
         weights: [400, 500, 600, 700, 800, 900],
      },
   },
   components: [
      {
         path: "~/components",
         pathPrefix: false
      }
   ],
   imports: {
      dirs: ["~/composables/**", "~/utils/**"],
   },
})
