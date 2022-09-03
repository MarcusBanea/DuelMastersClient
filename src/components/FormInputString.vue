<script setup>

defineEmits(["update:modelValue"]);

const props = defineProps({
  label: String,
  placeholder: String,

  defaultValue: String,
});
</script>


<template>
  <div class="mb-5">
    <label class="block text-gray-700 text-sm font-bold mb-1 float-left" for="name">
      {{ props.label }}
    </label>
    <input
      class="
        shadow
        appearance-none
        border
        rounded
        w-full
        py-2
        px-3
        text-gray-700
        leading-tight
        focus:outline-none focus:shadow-outline
      "
      id="name"
      type="text"
      :placeholder="props.placeholder"
      autocomplete="off"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>


<style scoped>
</style>