<script setup lang="ts">
import type { SelectMenuItem, BadgeProps, AlertProps } from "@nuxt/ui"
import type { CalculationDetail } from "#shared/types"

const props = withDefaults(
   defineProps<{
      items: CalculationDetail[]
      editable?: boolean
   }>(),
   {
      editable: true,
   }
)

const { people, addPerson, removePerson } = usePeopleAssignment()

function countPersonTotalBill(person: (typeof people.value)[number]) {
   return person.items.reduce((acc, item) => acc + item.finalUnitPrice, 0)
}

function getItemOptions(
   person: (typeof people.value)[number]
): SelectMenuItem[] {
   return props.items.map((detail) => {
      return {
         type: "item",
         label: detail.item.name ?? "-",
         disabled:
            !detail.item.name
            || person.items.some((i) => i.name == detail.item.name)
            || countItemAllocation(detail) >= detail.item.qty,
      }
   })
}

function addItem(person: (typeof people.value)[number]) {
   if (!person || isPersonAllocatedAllItems(person)) return
   person.items.push({
      name: "",
      finalUnitPrice: 0,
      qty: 0,
   })
}

function removeItem(person: (typeof people.value)[number], itemIndex: number) {
   if (!person) return
   person.items.splice(itemIndex, 1)
}

function isPersonAllocatedAllItems(person: (typeof people.value)[number]) {
   return props.items.every((item) => {
      return person.items.some((i) => i.name == item.item.name)
   })
}

function countItemAllocation(item: CalculationDetail) {
   const allocatedItems = people.value.reduce((acc, person) => {
      const _item = person.items.find((i) => {
         return i.name == item.item.name
      })
      return acc + (_item?.qty ?? 0)
   }, 0)

   return allocatedItems
}

function itemAllocationBadgeColor(
   item: CalculationDetail
): BadgeProps["color"] {
   const allocatedItems = countItemAllocation(item)
   if (allocatedItems > item.item.qty || allocatedItems < 0) return "error"
   if (allocatedItems < item.item.qty) return "warning"
   return "success"
}

const canAddNewPerson = computed(() => {
   return props.items.some((item) => {
      return itemAllocationBadgeColor(item) == "warning"
   })
})

watchEffect(() => {
   people.value.forEach((person) => {
      person.items.forEach((item) => {
         const selectedItem = props.items.find((i) => {
            return i.item.name == item.name
         })
         if (!selectedItem) return
         item.finalUnitPrice = selectedItem.result.finalUnitPrice * item.qty
      })
   })
})

const itemAllocationAlertProps = computed(() => {
   let title: string
   let color: AlertProps["color"]
   let icon: string

   const allocationStatus = props.items.map((item) => {
      return itemAllocationBadgeColor(item)
   })

   if (allocationStatus.includes("error")) {
      title = $t(
         "calculate.distribution.allocationValidation.alert.error.title"
      )
      color = "error"
      icon = "lucide:x-circle"
   } else if (allocationStatus.includes("warning")) {
      title = $t(
         "calculate.distribution.allocationValidation.alert.warning.title"
      )
      color = "warning"
      icon = "lucide:alert-triangle"
   } else {
      title = $t(
         "calculate.distribution.allocationValidation.alert.success.title"
      )
      color = "success"
      icon = "lucide:check-circle"
   }

   return {
      title,
      color,
      icon,
   }
})
</script>

<template>
   <div class="flex flex-col gap-4">
      <UCard
         v-for="(person, personIndex) in people"
         variant="soft"
      >
         <template #header>
            <div class="flex items-center justify-between">
               <h3>
                  {{
                     $t("calculate.distribution.form.title", {
                        count: `#${personIndex + 1}`,
                     })
                  }}
               </h3>
               <UButton
                  v-if="editable"
                  icon="lucide:trash"
                  color="error"
                  variant="ghost"
                  size="sm"
                  square
                  @click="removePerson(personIndex)"
               />
            </div>
         </template>
         <div class="flex flex-col gap-4">
            <UFormField>
               <UInput
                  v-model="person.name"
                  :placeholder="
                     $t(
                        'calculate.distribution.form.input.personName.placeholder'
                     )
                  "
                  :readonly="!editable"
                  class="w-full md:w-1/2"
               />
            </UFormField>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
               <UCard
                  v-for="(item, itemIndex) in person.items"
                  class="text-sm"
                  :ui="{ body: 'flex flex-col gap-2' }"
               >
                  <UFieldGroup class="w-full">
                     <USelectMenu
                        v-model="item.name"
                        :items="getItemOptions(person)"
                        value-key="label"
                        :placeholder="
                           $t(
                              'calculate.distribution.form.input.item.placeholder'
                           )
                        "
                        :disabled="!editable"
                        class="w-full"
                     />
                     <UInputNumber
                        v-model="item.qty"
                        :placeholder="
                           $t(
                              'calculate.distribution.form.input.qty.placeholder'
                           )
                        "
                        :increment="false"
                        :decrement="false"
                        :readonly="!editable"
                        class="w-full"
                     />
                  </UFieldGroup>
                  <div class="mt-2 flex items-center justify-between gap-4">
                     <UFormField
                        :label="$t('calculate.distribution.form.summary.total')"
                        :ui="{ label: 'text-xs' }"
                     >
                        {{ $formatCurrency(item.finalUnitPrice) }}
                     </UFormField>
                     <UButton
                        v-if="editable"
                        icon="lucide:trash"
                        color="error"
                        variant="ghost"
                        size="sm"
                        square
                        @click="removeItem(person, itemIndex)"
                     />
                  </div>
               </UCard>
               <UButton
                  v-if="editable"
                  :label="$t('calculate.distribution.form.actions.item.add')"
                  icon="lucide:plus"
                  variant="soft"
                  class="min-h-34 justify-center"
                  :disabled="
                     isPersonAllocatedAllItems(person)
                     || person.items.length >= props.items.length
                     || !canAddNewPerson
                  "
                  @click="addItem(person)"
               />
            </div>
         </div>
         <template #footer>
            <div class="flex w-full font-medium">
               <span>
                  {{ $t("calculate.distribution.summary.totalBill") }}:
               </span>
               <span class="flex-1 text-end">
                  {{ $formatCurrency(countPersonTotalBill(person)) }}
               </span>
            </div>
         </template>
      </UCard>
      <UEmpty
         v-if="people.length < 1"
         :title="$t('calculate.distribution.empty.title')"
         :description="
            editable ?
               $t('calculate.distribution.empty.description')
            :  $t('calculate.distribution.empty.readOnlyDescription')
         "
         icon="lucide:user"
         variant="naked"
      />
      <UButton
         v-if="editable"
         :label="$t('calculate.distribution.empty.actions.addPerson')"
         icon="lucide:plus"
         variant="soft"
         block
         :disabled="!canAddNewPerson"
         @click="addPerson"
      />
      <UCard
         v-if="people.length > 0"
         variant="outline"
         :ui="{
            root: 'ring-0 border border-dashed border-muted',
            body: 'sm:p-4',
         }"
      >
         <h3 class="mb-4 font-medium">
            {{ $t("calculate.distribution.allocationValidation.title") }}
         </h3>
         <UAlert
            :title="itemAllocationAlertProps.title"
            :color="itemAllocationAlertProps.color"
            :icon="itemAllocationAlertProps.icon"
            variant="subtle"
            class="my-4"
         />
         <div class="flex flex-wrap gap-2 *:shrink-0">
            <UBadge
               v-for="item in props.items"
               variant="subtle"
               :color="itemAllocationBadgeColor(item)"
               size="lg"
            >
               {{ item.item.name }}: {{ countItemAllocation(item) }}
               {{
                  $t(
                     "calculate.distribution.allocationValidation.badges.countSeparator"
                  )
               }}
               {{ item.item.qty }}
            </UBadge>
         </div>
      </UCard>
   </div>
</template>
