<script setup>

defineEmits(["update:modelValue"]);

const props = defineProps({
  label: String,

  defaultValue: String,
});
</script>


<template>
  <div class="mb-5">
    <label class="text-gray-700 font-bold float-left w-0" for="checkbox">
      {{ label }}
    </label>
    <input
      class="ml-0"
      name="checkbox"
      type="checkbox"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
  </div>
</template>

<style scoped>
</style>