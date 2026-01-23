<script setup lang="ts">
const route = useRoute()

const pageTitle = computed(() => {
   return (route.meta.title as string) ?? "Boncos"
})

const hideTitle = computed(() => {
   return route.meta.hideTitle as boolean ?? false
})
</script>

<template>
   <UHeader title="Boncos">
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
</template>
