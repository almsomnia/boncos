// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
   compatibilityDate: "2025-07-15",
   devtools: { enabled: true },
   modules: [
      "@nuxt/ui",
      "@nuxt/fonts",
      "@nuxt/icon",
      "@nuxt/test-utils/module",
      "@nuxtjs/seo",
      "@vueuse/nuxt",
      "@nuxtjs/i18n",
   ],
   site: {
      url: "https://boncos.rivaalmero.me",
      name: "Boncos",
      description: "A sophisticated bill-splitting and expense calculator.",
      defaultLocale: "id",
   },
   robots: {
      disallow: ["/calculate"],
   },
   sitemap: {
      exclude: ["/calculate"],
   },
   css: ["@/assets/css/main.css"],
   fonts: {
      defaults: {
         weights: [400, 500, 600, 700, 800, 900],
      },
   },
   components: [
      {
         path: "~/components",
         pathPrefix: false,
      },
   ],
   imports: {
      dirs: ["~/composables/**", "~/utils/**"],
   },
   runtimeConfig: {
      cryptKey: import.meta.env.CRYPT_KEY,
      public: {
         donateUrl: import.meta.env.DONATE_URL,
         repoUrl: import.meta.env.REPO_URL,
      },
   },
   i18n: {
      strategy: "no_prefix",
      defaultLocale: "id",
      locales: [
         {
            code: "id",
            name: "Indonesia",
            file: "id.json",
         },
         {
            code: "en",
            name: "English",
            file: "en.json",
         },
      ],
      detectBrowserLanguage: {
         useCookie: true,
         cookieKey: "i18n_lang",
         redirectOn: "root",
         alwaysRedirect: false,
         fallbackLocale: "id",
      },
   },
})
