<script setup lang="ts">
const route = useRoute()
const appConfig = useAppConfig()

const pageTitle = computed(() => {
   return (route.meta.title as string) ?? appConfig.appName
})

const hideTitle = computed(() => {
   return (route.meta.hideTitle as boolean) ?? false
})
</script>

<template>
   <UPageHeader
      v-if="!hideTitle"
      :title="pageTitle"
   >
      <template v-if="$slots.description" #description>
         <slot name="description" />
      </template>
      <template v-if="$slots.headline" #headline>
         <slot name="headline" />
      </template>
      <template v-if="$slots.links" #links>
         <slot name="links" />
      </template>
   </UPageHeader>
   <slot />
</template>
