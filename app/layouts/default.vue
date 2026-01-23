<script setup lang="ts">
const route = useRoute()
const appConfig = useAppConfig()

const pageTitle = computed(() => {
   return (route.meta.title as string) ?? appConfig.appName
})

const hideTitle = computed(() => {
   return route.meta.hideTitle as boolean ?? false
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
      </template>
   </UHeader>
   <UContainer>
      <UPage class="min-h-(--min-page-height) py-2">
         <UPageHeader v-if="!hideTitle" :title="pageTitle" />
         <slot />
      </UPage>
   </UContainer>
   <UFooter>
      <template #left>
         <span class="text-muted text-sm">
            &copy; <NuxtTime :datetime="new Date()" year="numeric"  /> Riva Almero
         </span>
      </template>
   </UFooter>
</template>
