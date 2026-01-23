<script setup lang="ts">
const appConfig = useAppConfig()
useSeoMeta({
   titleTemplate: (chunk) => chunk ? `${chunk} - ${appConfig.appName}` : appConfig.appName,
})
</script>

<template>
   <div>
      <NuxtRouteAnnouncer />
      <UApp>
         <NuxtLayout>
            <NuxtPage />
         </NuxtLayout>
      </UApp>
   </div>
</template>
