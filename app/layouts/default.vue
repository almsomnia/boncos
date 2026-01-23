<script setup lang="ts">
const route = useRoute()

const pageTitle = computed(() => {
   return route.meta.title as string ?? "Boncos"
})
</script>

<template>
   <UHeader
      title="Boncos"
   >
      <template #right>
         <UColorModeButton />
      </template>
   </UHeader>
   <UContainer>
      <UPage class="min-h-(--min-page-height) py-2">
         <UPageHeader
            :title="pageTitle"
         />
         <slot />
      </UPage>
   </UContainer>
</template>
