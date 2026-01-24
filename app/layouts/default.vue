<script setup lang="ts">
const appConfig = useAppConfig()
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
      </template>
   </UHeader>
   <UContainer>
      <UPage class="min-h-(--min-page-height) py-2">
         <slot />
      </UPage>
   </UContainer>
   <UFooter :ui="{ root: 'h-(--footer-height)' }">
      <template #left>
         <span class="text-muted text-sm">
            &copy; <NuxtTime :datetime="new Date()" year="numeric"  /> Riva Almero
         </span>
      </template>
   </UFooter>
</template>
