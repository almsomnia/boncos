<script setup lang="ts">
const appConfig = useAppConfig()
definePageMeta({
   hideTitle: true,
})
</script>

<template>
   <div class="relative isolate">
      <!-- Hero Section -->
      <div class="relative px-6 py-24 sm:py-32 lg:px-8">
         <!-- Background Mesh Gradient -->
         <div
            class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
         >
            <div
               class="from-primary-200 to-primary-500 relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
               style="
                  clip-path: polygon(
                     74.1% 44.1%,
                     100% 61.6%,
                     97.5% 26.9%,
                     85.5% 0.1%,
                     80.7% 2%,
                     72.5% 32.5%,
                     60.2% 62.4%,
                     52.4% 68.1%,
                     47.5% 58.3%,
                     45.2% 34.5%,
                     27.5% 76.7%,
                     0.1% 64.9%,
                     17.9% 100%,
                     27.6% 76.8%,
                     76.1% 97.7%,
                     74.1% 44.1%
                  );
               "
            ></div>
         </div>

         <!-- Hero Content -->
         <div class="mx-auto max-w-2xl text-center">
            <h1
               class="text-5xl font-bold tracking-tight text-balance sm:text-7xl"
            >
               Bagi Tagihan dengan
               <span class="text-primary-500">Lebih Adil</span>.
            </h1>
            <p
               class="mt-8 text-lg font-medium text-pretty text-neutral-500 sm:text-xl/8 dark:text-neutral-400"
            >
               {{ appConfig.appName }} menghitung biaya "sebenarnya" per item
               dengan membagi ongkir, pajak, biaya layanan, dan diskon secara
               proporsional. Semua kebagian adil, sampai ke Rupiah terakhir.
            </p>
            <div class="mt-10 flex items-center justify-center gap-x-6">
               <UButton
                  to="/calculate"
                  size="xl"
                  label="Hitung Sekarang"
                  trailing-icon="lucide:arrow-right"
               />
            </div>
         </div>

         <!-- Bottom Mesh Gradient -->
         <div
            class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
         >
            <div
               class="from-primary-200 to-primary-500 relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
               style="
                  clip-path: polygon(
                     74.1% 44.1%,
                     100% 61.6%,
                     97.5% 26.9%,
                     85.5% 0.1%,
                     80.7% 2%,
                     72.5% 32.5%,
                     60.2% 62.4%,
                     52.4% 68.1%,
                     47.5% 58.3%,
                     45.2% 34.5%,
                     27.5% 76.7%,
                     0.1% 64.9%,
                     17.9% 100%,
                     27.6% 76.8%,
                     76.1% 97.7%,
                     74.1% 44.1%
                  );
               "
            ></div>
         </div>
      </div>

      <!-- Features Section -->
      <div class="mx-auto max-w-7xl px-6 pb-24 sm:pb-32 lg:px-8">
         <div class="mx-auto max-w-3xl lg:text-center">
            <h2
               class="text-primary-500 text-base/7 font-bold tracking-wider uppercase"
            >
               Kenapa {{ appConfig.appName }}?
            </h2>
            <p
               class="mt-2 text-4xl font-semibold tracking-tight text-pretty sm:text-5xl"
            >
               Semua yang Kamu Butuhkan untuk Pembagian Tagihan yang Adil
            </p>
         </div>
         <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl
               class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3"
            >
               <UCard>
                  <div class="flex flex-col">
                     <dt
                        class="flex items-center gap-x-3 text-base/7 font-semibold"
                     >
                        <UIcon
                           name="lucide:percent"
                           class="text-primary-500 size-5 flex-none"
                        />
                        Distribusi Proporsional
                     </dt>
                     <dd
                        class="mt-4 flex flex-auto flex-col text-base/7 text-neutral-600 dark:text-neutral-400"
                     >
                        <p class="flex-auto text-pretty">
                           Pajak, ongkir, dan biaya layanan dibagi berdasarkan
                           total harga item masing-masing, tidak ada yang
                           membayar lebih dari seharusnya.
                        </p>
                     </dd>
                  </div>
               </UCard>
               <UCard>
                  <div class="flex flex-col">
                     <dt
                        class="flex items-center gap-x-3 text-base/7 font-semibold"
                     >
                        <UIcon
                           name="lucide:calculator"
                           class="text-primary-500 size-5 flex-none"
                        />
                        Rincian yang Transparan
                     </dt>
                     <dd
                        class="mt-4 flex flex-auto flex-col text-base/7 text-neutral-600 dark:text-neutral-400"
                     >
                        <p class="flex-auto text-pretty">
                           Lihat dengan jelas berapa harga akhir setiap item
                           setelah ditambah biaya tambahan dan dikurangi diskon.
                        </p>
                     </dd>
                  </div>
               </UCard>
               <UCard>
                  <div class="flex flex-col">
                     <dt
                        class="flex items-center gap-x-3 text-base/7 font-semibold"
                     >
                        <UIcon
                           name="lucide:zap"
                           class="text-primary-500 size-5 flex-none"
                        />
                        Cepat & Simpel
                     </dt>
                     <dd
                        class="mt-4 flex flex-auto flex-col text-base/7 text-neutral-600 dark:text-neutral-400"
                     >
                        <p class="flex-auto text-pretty">
                           Tampilan minimalis yang dirancang untuk input cepat.
                           Hasil langsung keluar dalam hitungan detik, bukan
                           menit.
                        </p>
                     </dd>
                  </div>
               </UCard>
            </dl>
         </div>
      </div>
   </div>
</template>
