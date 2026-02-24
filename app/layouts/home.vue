<script setup lang="ts">
import type { NavigationMenuItem } from "#ui/types"
const appConfig = useAppConfig()

const menuItems: NavigationMenuItem[][] = [
   [
      {
         label: "Fitur",
         to: "#features"
      },
      {
         label: "Cara Pakai",
         to: "#how"
      }
   ]
]
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
      <UNavigationMenu
         orientation="horizontal"
         :items="menuItems"
      />
      <template #right>
         <UColorModeButton />
         <USeparator orientation="vertical" class="h-6" />
         <UButton
            label="Mulai Sekarang"
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
                  Hitung biaya "sebenarnya" secara instan. Distribusi biaya
                  bersama dan diskon proporsional dalam hitungan detik.
               </p>
            </div>
         </div>
      </template>
      <template #right>
         <div class="grid basis-full grid-cols-2 text-sm">
            <div class="">
               <h4 class="text-default mb-4 font-bold">Produk</h4>
               <ul class="list-none space-y-2">
                  <li>
                     <NuxtLink
                        to="/#features"
                        class="text-muted hover:text-default transition"
                     >
                        Fitur
                     </NuxtLink>
                  </li>
                  <li>
                     <NuxtLink
                        to="/#how"
                        class="text-muted hover:text-default transition"
                     >
                        Cara Pakai
                     </NuxtLink>
                  </li>
               </ul>
            </div>
            <div class="">
               <h4 class="text-default mb-4 font-bold">Sumber Daya</h4>
               <ul class="list-none space-y-2">
                  <li>
                     <NuxtLink class="text-muted hover:text-default transition">
                        GitHub
                     </NuxtLink>
                  </li>
                  <li>
                     <NuxtLink class="text-muted hover:text-default transition">
                        Kontak
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
               Boncos. All rights reserved.
            </span>
         </UContainer>
      </template>
   </UFooter>
</template>
