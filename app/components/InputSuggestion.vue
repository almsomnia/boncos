<script setup lang="ts" generic="T extends string | number">
/**
 * Text input backed by a list of suggestions.
 *
 * Clicking the field opens the suggestions, but the field stays fully editable:
 * anything typed is committed as-is, so a custom value never needs an extra
 * confirmation step.
 */
const props = defineProps<{
   suggestions: T[]
   placeholder?: string
   readonly?: boolean
   /** Labels the custom value option with a hint instead of showing it as-is */
   hintCustomValue?: boolean
}>()

const model = defineModel<T | undefined>()

const searchTerm = ref("")

/** Numeric suggestions commit as numbers, so the model keeps its own type */
const isNumeric = computed(() => typeof props.suggestions[0] === "number")

/**
 * Converts what the user typed into a model value, or `undefined` when it
 * cannot be used (e.g. letters in a numeric field).
 */
function parseValue(value: string): T | undefined {
   if (!isNumeric.value) return value as T

   const parsed = Number(value)
   return Number.isFinite(parsed) ? (parsed as T) : undefined
}

function commit(value: string) {
   const parsed = parseValue(value.trim())
   if (parsed === undefined || parsed === model.value) return

   model.value = parsed
}

/**
 * Selecting the custom value option only reports it, so it is committed here.
 */
function onCreate(value: string) {
   commit(value)
   searchTerm.value = ""
}

/**
 * Commits free text left in the field. Selecting a suggestion clears the search
 * term beforehand, so this only ever fires for values typed by hand.
 */
function onBlur() {
   if (!searchTerm.value.trim()) return

   commit(searchTerm.value)
}
</script>

<template>
   <!-- Read-only mode has nothing to suggest, so keep the plain input styling -->
   <UInput
      v-if="props.readonly"
      :model-value="model"
      :placeholder="props.placeholder"
      readonly
   />
   <UInputMenu
      v-else
      v-model="model"
      v-model:search-term="searchTerm"
      :items="props.suggestions"
      :placeholder="props.placeholder"
      :inputmode="isNumeric ? 'numeric' : undefined"
      create-item="always"
      open-on-focus
      @create="onCreate"
      @blur="onBlur"
   >
      <template #create-item-label="{ item }">
         <template v-if="props.hintCustomValue">
            {{ $t("common.input.useCustomValue", { value: item }) }}
         </template>
         <template v-else>{{ item }}</template>
      </template>
   </UInputMenu>
</template>
