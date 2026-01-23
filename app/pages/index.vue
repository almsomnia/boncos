<script setup lang="ts">
const appConfig = useAppConfig()
definePageMeta({
   title: `Welcome to ${appConfig.appName}`,
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
               Split bills with
               <span class="text-primary-500">precision</span>.
            </h1>
            <p
               class="mt-8 text-lg font-medium text-pretty text-neutral-500 sm:text-xl/8 dark:text-neutral-400"
            >
               {{ appConfig.appName }} calculates the "true" cost per item by proportionally
               distributing taxes, service charges, and discounts. Fair splits
               for everyone, down to the last cent.
            </p>
            <div class="mt-10 flex items-center justify-center gap-x-6">
               <UButton
                  to="/calculate"
                  size="xl"
                  label="Start Calculating"
                  trailing-icon="lucide:arrow-right"
               />
               <UButton
                  to="https://github.com/almsomnia/boncos"
                  variant="ghost"
                  color="neutral"
                  size="xl"
                  label="View on GitHub"
                  icon="lucide:github"
                  target="_blank"
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
         <div class="mx-auto max-w-2xl lg:text-center">
            <h2
               class="text-primary-500 text-base/7 font-semibold tracking-wide uppercase"
            >
               Why {{ appConfig.appName }}?
            </h2>
            <p
               class="mt-2 text-4xl font-semibold tracking-tight text-pretty sm:text-5xl"
            >
               Everything you need for a fair split
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
                     Proportional Distribution
                  </dt>
                  <dd
                     class="mt-4 flex flex-auto flex-col text-base/7 text-neutral-600 dark:text-neutral-400"
                  >
                     <p class="flex-auto">
                        Taxes and service charges are shared based on each
                        person's subtotal, ensuring nobody pays more than their
                        fair share.
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
                        Detailed Breakdown
                     </dt>
                     <dd
                        class="mt-4 flex flex-auto flex-col text-base/7 text-neutral-600 dark:text-neutral-400"
                     >
                        <p class="flex-auto">
                           See exactly how much each item costs after adding all
                           extra fees and subtracting discounts.
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
                        Fast & Simple
                     </dt>
                     <dd
                        class="mt-4 flex flex-auto flex-col text-base/7 text-neutral-600 dark:text-neutral-400"
                     >
                        <p class="flex-auto">
                           Minimalist interface designed for quick data entry. Get
                           your results in seconds, not minutes.
                        </p>
                     </dd>
                  </div>
               </UCard>
            </dl>
         </div>
      </div>
   </div>
</template>
