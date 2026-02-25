<script setup lang="ts">
import { breakpointsTailwind } from "@vueuse/core"
import type { NavigationMenuItem, SelectItem } from "#ui/types"

const appConfig = useAppConfig()
const config = useRuntimeConfig()

const { locales, setLocale, locale } = useI18n()
const localeOptions = computed(() => {
   return locales.value.map((l) => {
      return {
         label: l.code.toUpperCase(),
         value: l.code,
         icon: `circle-flags:${l.code}`,
      }
   }) satisfies SelectItem[]
})
const localeModel = computed({
   get: () => {
      return locale.value
   },
   set: (value) => {
      setLocale(value)
   },
})
const localeSelectIcon = computed(
   () => localeOptions.value.find((l) => l.value === locale.value)?.icon
)

const menuItems = computed<NavigationMenuItem[][]>(() => [
   [
      {
         label: $t("landing.header.menuItem.features"),
         to: "#features",
      },
      {
         label: $t("landing.header.menuItem.howToUse"),
         to: "#how",
      },
   ],
])

const breakpoints = useBreakpoints(breakpointsTailwind)
const mounted = useMounted()

const isDesktop = computed(() => {
   return mounted.value && breakpoints.greaterOrEqual("lg").value
})
</script>

<template>
   <UHeader :title="appConfig.appName">
      <template #title>
         <div class="flex items-center gap-2">
            <img
               src="/img/logo.svg"
               alt="App Logo"
               class="h-8 w-8"
            />
            <span class="text-xl font-bold">
               {{ appConfig.appName }}
            </span>
         </div>
      </template>
      <UNavigationMenu
         orientation="horizontal"
         :items="menuItems"
      />
      <template #body>
         <UNavigationMenu
            orientation="vertical"
            :items="menuItems"
         >
            <template #list-trailing>
               <USeparator class="mt-2" />
               <UButton
                  :label="$t('landing.header.cta.primary')"
                  to="/calculate"
                  trailing-icon="lucide:arrow-right"
                  size="lg"
                  block
                  :ui="{
                     trailingIcon: 'ms-0',
                  }"
               />
            </template>
         </UNavigationMenu>
      </template>
      <template #right>
         <USelect
            v-model="localeModel"
            :items="localeOptions"
            :icon="localeSelectIcon"
            variant="ghost"
            label-key="label"
            value-key="value"
         />
         <UColorModeButton />
         <USeparator
            orientation="vertical"
            class="h-6 mx-1"
         />
         <UButton
            v-if="isDesktop"
            :label="$t('landing.header.cta.primary')"
            trailing-icon="lucide:chevron-right"
            to="/calculate"
         />
      </template>
   </UHeader>
   <UContainer>
      <UPage class="min-h-(--min-page-height) py-2">
         <slot />
      </UPage>
   </UContainer>
   <UFooter :ui="{ root: 'border-t border-default', container: 'lg:pt-12' }">
      <template #left>
         <div class="max-w-md">
            <NuxtLink
               class="inline-flex items-center gap-1"
               to="/"
            >
               <img
                  src="/img/logo.svg"
                  alt="App Logo"
                  class="h-6 w-6"
               />
               <span class="text-base font-semibold">
                  {{ appConfig.appName }}
               </span>
            </NuxtLink>
            <div class="mt-4">
               <p class="text-muted text-sm text-pretty">
                  {{ $t("landing.footer.description") }}
               </p>
            </div>
         </div>
      </template>
      <template #right>
         <div class="grid basis-full grid-cols-2 text-sm">
            <div class="">
               <h4 class="text-default mb-4 font-bold">
                  {{ $t("landing.footer.links.product.title") }}
               </h4>
               <ul class="list-none space-y-2">
                  <li>
                     <NuxtLink
                        to="/#features"
                        class="text-muted hover:text-default transition"
                     >
                        {{ $t("landing.footer.links.product.item.feature") }}
                     </NuxtLink>
                  </li>
                  <li>
                     <NuxtLink
                        to="/#how"
                        class="text-muted hover:text-default transition"
                     >
                        {{ $t("landing.footer.links.product.item.howToUse") }}
                     </NuxtLink>
                  </li>
               </ul>
            </div>
            <div class="">
               <h4 class="text-default mb-4 font-bold">
                  {{ $t("landing.footer.links.resource.title") }}
               </h4>
               <ul class="list-none space-y-2">
                  <li>
                     <NuxtLink
                        class="text-muted hover:text-default transition"
                        :href="config.public.repoUrl"
                        target="_blank"
                     >
                        {{ $t("landing.footer.links.resource.item.github") }}
                     </NuxtLink>
                  </li>
                  <li>
                     <NuxtLink
                        class="text-muted hover:text-default transition"
                        href="mailto:rivaalms@proton.me"
                        target="_blank"
                     >
                        {{ $t("landing.footer.links.resource.item.contact") }}
                     </NuxtLink>
                  </li>
               </ul>
            </div>
         </div>
      </template>
      <template #bottom>
         <UContainer>
            <USeparator class="mb-8" />
            <span class="text-muted text-xs">
               &copy;
               <NuxtTime
                  :datetime="new Date()"
                  year="numeric"
               />
               {{ appConfig.appName }}. All rights reserved.
            </span>
         </UContainer>
      </template>
   </UFooter>
</template>
