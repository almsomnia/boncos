<script setup lang="ts">
import { breakpointsTailwind } from "@vueuse/core"

const appConfig = useAppConfig()
const config = useRuntimeConfig()

const breakpoints = useBreakpoints(breakpointsTailwind)
const mounted = useMounted()

const isDesktop = computed(() => {
   return mounted.value && breakpoints.greaterOrEqual('lg').value
})
</script>

<template>
   <UHeader :title="appConfig.appName" :toggle="{ class: 'hidden' }">
      <template #title>
         <div class="flex items-center gap-2">
            <img src="/img/logo.svg" alt="App Logo" class="h-8 w-8" />
            <span class="text-xl font-bold">
               {{ appConfig.appName }}
            </span>
         </div>
      </template>
      <template #right>
         <UColorModeButton />
         <USeparator orientation="vertical" class="h-6" />
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
            :label="isDesktop ? 'Beliin Gua Kopi' : undefined"
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
            &copy; <NuxtTime :datetime="new Date()" year="numeric"  /> Riva Almero
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
