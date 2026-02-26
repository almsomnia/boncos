<script setup lang="ts">
import { breakpointsTailwind } from "@vueuse/core"
import type { SelectItem } from "#ui/types"

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

const breakpoints = useBreakpoints(breakpointsTailwind)
const mounted = useMounted()

const isDesktop = computed(() => {
   return mounted.value && breakpoints.greaterOrEqual("lg").value
})
</script>

<template>
   <UHeader
      :title="appConfig.appName"
      :toggle="{ class: 'hidden' }"
   >
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
            class="h-6"
         />
         <UButton
            icon="fa6-brands:github"
            color="neutral"
            variant="ghost"
            :href="config.public.repoUrl"
            target="_blank"
         />
         <UButton
            icon="lucide:coffee"
            color="secondary"
            :variant="isDesktop ? 'solid' : 'ghost'"
            :label="isDesktop ? $t('layout.header.donate') : undefined"
            :href="config.public.donateUrl"
            target="_blank"
         />
      </template>
   </UHeader>
   <UContainer>
      <UPage class="min-h-(--min-page-height) py-2">
         <slot />
      </UPage>
   </UContainer>
   <UFooter :ui="{ root: 'border-t border-default mt-12' }">
      <template #left>
         <span class="text-muted text-xs">
            &copy;
            <NuxtTime
               :datetime="new Date()"
               year="numeric"
            />
            Boncos. All rights reserved.
         </span>
      </template>
      <template #right>
         <UButton
            icon="fa6-brands:github"
            color="neutral"
            variant="ghost"
            :href="config.public.repoUrl"
            target="_blank"
         />
      </template>
   </UFooter>
</template>
