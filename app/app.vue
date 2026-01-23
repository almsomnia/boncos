<script setup lang="ts">
useSeoMeta({
   titleTemplate: (chunk) => chunk ? `${chunk} - Boncos` : "Boncos",
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
