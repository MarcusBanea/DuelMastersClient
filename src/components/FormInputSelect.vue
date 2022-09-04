<script setup>
import { ref } from "@vue/reactivity";

defineEmits(["update:modelValue"]);

const props = defineProps({
  label: String,
  options: Array,
  width: Number,

  disabled: Boolean,

  noValueSelected: String,
  defaultValue: String,
});

const selectedOption = ref(
  props.defaultValue === undefined ? props.noValueSelected : props.defaultValue
);
</script>
    
    
    <template>
  <div class="mb-5">
    <label
      class="block text-gray-700 text-sm font-bold float-left"
      for="options"
    >
      {{ label }}
    </label>
    <select
      class="
        text-gray-700
        shadow
        border
        rounded
        w-full
        py-2
        px-3
        text-gray-700
        leading-tight
        focus:outline-none focus:shadow-outline
      "
      name="options"
      v-model="selectedOption"
      :disabled="disabled"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option :selected="noValueSelected" disabled>
        {{ noValueSelected }}
      </option>
      <option v-for="option in options" :value="option" :key="option">
        {{ option }}
      </option>
    </select>
  </div>
</template>
    
    
<style scoped>
</style>