<script setup lang="ts">
const appConfig = useAppConfig()

definePageMeta({
   layout: "home",
})

useSeoMeta({
   title: "Beranda",
   description:
      "Boncos membantu kamu bagi tagihan dengan lebih adil. Hitung biaya sebenarnya per item dengan membagi ongkir, pajak, biaya layanan, dan diskon secara proporsional.",
   ogTitle: "Boncos - Bagi Tagihan dengan Lebih Adil",
   ogDescription:
      "Hitung biaya sebenarnya per item dengan membagi ongkir, pajak, biaya layanan, dan diskon secara proporsional.",
   ogImage: "/img/logo.svg",
   twitterCard: "summary_large_image",
})
</script>

<template>
   <div class="relative isolate">
      <!-- Hero Section -->
      <section
         id="hero"
         class="relative flex h-[calc(100vh-var(--ui-header-height))] items-center py-42 md:px-6 lg:px-8"
      >
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
         <div class="mx-auto max-w-2xl pb-16 text-center lg:max-w-4xl">
            <h1
               class="text-highlighted text-5xl font-bold tracking-tight text-balance sm:text-7xl lg:text-8xl"
            >
               Bagi Tagihan dengan
               <span class="text-primary-500">Lebih Adil</span>.
            </h1>
            <p
               class="text-toned mx-auto mt-12 text-lg font-medium text-pretty sm:text-xl/8 lg:max-w-3xl"
            >
               Kalkulator pintar yang membagi ongkir, pajak, dan diskon ke
               setiap item secara proporsional. Akurat sampai Rupiah terakhir
               tanpa ribet.
            </p>
            <div class="mt-16 flex items-center justify-center gap-x-4">
               <UButton
                  to="#how"
                  size="xl"
                  label="Cara Pakai"
                  icon="lucide:circle-help"
                  color="neutral"
                  variant="soft"
               />
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
      </section>

      <!-- Features Section -->
      <section
         id="features"
         class="mx-auto max-w-7xl pb-32 sm:pb-48 md:px-6 lg:px-8"
      >
         <div class="mx-auto max-w-3xl lg:text-center">
            <h2
               class="text-primary-500 text-base/7 font-bold tracking-wider uppercase"
            >
               Kenapa {{ appConfig.appName }}?
            </h2>
            <p
               class="text-highlighted mt-2 text-4xl font-semibold tracking-tight text-pretty sm:text-5xl"
            >
               Semua yang Kamu Butuhkan untuk Pembagian Tagihan yang Adil
            </p>
         </div>
         <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl class="grid grid-cols-1 gap-8 lg:grid-cols-3">
               <UCard>
                  <div class="flex flex-col">
                     <dt
                        class="flex items-center gap-x-3 text-lg font-semibold"
                     >
                        <UIcon
                           name="lucide:percent"
                           class="text-primary-500 size-5 flex-none"
                        />
                        Hitungan Presisi
                     </dt>
                     <dd
                        class="mt-4 flex flex-auto flex-col text-neutral-600 dark:text-neutral-400"
                     >
                        <p class="flex-auto text-pretty">
                           Pajak, ongkir, dan biaya layanan dibagi sesuai porsi
                           harga tiap barang. Ga ada lagi yang dirugikan.
                        </p>
                     </dd>
                  </div>
               </UCard>
               <UCard>
                  <div class="flex flex-col">
                     <dt
                        class="flex items-center gap-x-3 text-lg font-semibold"
                     >
                        <UIcon
                           name="lucide:calculator"
                           class="text-primary-500 size-5 flex-none"
                        />
                        Transparansi Total
                     </dt>
                     <dd
                        class="mt-4 flex flex-auto flex-col text-neutral-600 dark:text-neutral-400"
                     >
                        <p class="flex-auto text-pretty">
                           Cek detail harga asli per item setelah dikalkulasi
                           dengan diskon dan biaya tambahan secara
                           <i>real-time</i>.
                        </p>
                     </dd>
                  </div>
               </UCard>
               <UCard>
                  <div class="flex flex-col">
                     <dt
                        class="flex items-center gap-x-3 text-lg font-semibold"
                     >
                        <UIcon
                           name="lucide:zap"
                           class="text-primary-500 size-5 flex-none"
                        />
                        Bagi Per Orang Anti Ribet
                     </dt>
                     <dd
                        class="mt-4 flex flex-auto flex-col text-neutral-600 dark:text-neutral-400"
                     >
                        <p class="flex-auto text-pretty">
                           Kelompokkan pesanan berdasarkan orang yang memesan.
                           Hasil akhir langsung terbagi per orang.
                        </p>
                     </dd>
                  </div>
               </UCard>
            </dl>
         </div>
      </section>

      <!-- How to use section -->
      <section
         id="how"
         class="mx-auto max-w-7xl py-8 sm:py-16 lg:px-8"
      >
         <div class="mx-auto">
            <h2
               class="text-primary-500 text-base/7 font-bold tracking-wider uppercase"
            >
               Cara Pakai
            </h2>
            <p
               class="text-highlighted mt-2 max-w-md text-4xl font-semibold tracking-tight text-pretty sm:text-5xl"
            >
               Hitung Cepat Dalam Tiga Langkah
            </p>
         </div>
         <div class="mt-8 grid gap-8 md:grid-cols-3">
            <div class="group relative">
               <div class="relative mb-2">
                  <span
                     class="text-primary block text-8xl font-bold opacity-0 transition-opacity select-none group-hover:opacity-25"
                  >
                     01
                  </span>
                  <div
                     class="bg-primary absolute start-0 bottom-0 h-1 w-16 translate-y-3/2 rounded-full"
                  />
               </div>
               <p class="text-pretty">
                  Masukkan nama item, harga, dan jumlah sesuai struk.
               </p>
            </div>
            <div class="group relative">
               <div class="relative mb-2">
                  <span
                     class="text-primary block text-8xl font-bold opacity-0 transition-opacity select-none group-hover:opacity-25"
                  >
                     02
                  </span>
                  <div
                     class="bg-primary absolute start-0 bottom-0 h-1 w-16 translate-y-3/2 rounded-full"
                  />
               </div>
               <p class="text-pretty">
                  Tambahkan biaya tambahan seperti ongkir atau diskon.
               </p>
            </div>
            <div class="group relative">
               <div class="relative mb-2">
                  <span
                     class="text-primary block text-8xl font-bold opacity-0 transition-opacity select-none group-hover:opacity-25"
                  >
                     03
                  </span>
                  <div
                     class="bg-primary absolute start-0 bottom-0 h-1 w-16 translate-y-3/2 rounded-full"
                  />
               </div>
               <p class="text-pretty">Dapatkan harga akhir yang 100% akurat.</p>
            </div>
         </div>
      </section>
   </div>
</template>
