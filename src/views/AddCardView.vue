<script setup>
import FormInputString from "../components/FormInputString.vue";
import FormInputSelect from "../components/FormInputSelect.vue";
import FormInputCheckbox from "../components/FormInputCheckbox.vue";
import { computed, ref } from "@vue/runtime-core";

const cardNameField = ref("");
const cardRealmField = ref("");
const cardClassField = ref("");
const cardManaField = ref("");
const cardPowerField = ref("");
const cardNumberOfShieldsBreakerField = ref("");
const cardEvolutionStatusField = ref(false);

const cardRealms = ["Light", "Darkness", "Nature", "Fire", "Aqua"];

const cardLightClasses = ["Angel Command", "Guardian", "Light Bringer"];
const cardDarknessClasses = ["Demon Command", "Dark Lord", "Brain Jacker"];
const cardNatureClasses = ["soon"];
const cardFireClasses = ["soon"];
const cardAquaClasses = ["soon"];

const isRealmSelected = computed(() => {
  return cardRealmField.value ? true : false;
});

const areFieldsValid = computed(() => {
  return cardNameField.value !== "" && 
    cardRealmField.value !== "" &&
    cardClassField.value !== "" &&
    cardManaField.value !== "" &&
    cardPowerField.value !== "" &&
    cardNumberOfShieldsBreakerField.value !== "";
});

const getClassesForSelectedRealm = computed(() => {
  switch (cardRealmField.value) {
    case "Light": {
      return cardLightClasses;
    }
    case "Darkness": {
      return cardDarknessClasses;
    }
    case "Nature": {
      return cardNatureClasses;
    }
    case "Fire": {
      return cardFireClasses;
    }
    case "Aqua": {
      return cardAquaClasses;
    }
  }
});

function addNewCardToDB() {
  fetch("/api/cards/add", {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({
      name: cardNameField.value,
      cardRealm: cardRealmField.value,
      cardClass: cardClassField.value,
      mana: cardManaField.value,
      power: cardPowerField.value,
      breakerNumber: cardNumberOfShieldsBreakerField.value,
      isEvolution: cardEvolutionStatusField.value,
    }),
  });
}
</script>
    
<template>
  <div class="bg-myBlack h-full">
    <div class="grid place-items-center h-screen">
      <div class="bg-myDarkGreen rounded-2xl">
        <div>
            <h1 class="font-bold text-myBlack text-xl mt-2 mb-2">Create card</h1>
        </div>
        <div>
          <form
            @submit.prevent="addNewCardToDB"
            class="bg-myLightGray shadow-md rounded px-8 pt-6 pb-8 m-4"
          >
            <div class="mb-4">
              <FormInputString
                label="Card name"
                placeholder="Card name"
                v-model="cardNameField"
              />

              <FormInputSelect
                label="Realm"
                :options="cardRealms"
                no-value-selected="Choose a realm"
                v-model="cardRealmField"
              />

              <FormInputSelect
                label="Class"
                :options="getClassesForSelectedRealm"
                :key="cardRealmField"
                :disabled="!isRealmSelected"
                no-value-selected="Choose a class"
                v-model="cardClassField"
              />

              <FormInputString
                label="Mana"
                placeholder="Mana"
                v-model="cardManaField"
              />

              <FormInputString
                label="Power"
                placeholder="Power"
                v-model="cardPowerField"
              />

              <FormInputSelect
                label="How many shields can break?"
                :options="['None', 1, 2, 3, 4, 5]"
                no-value-selected="Choose a number"
                v-model="cardNumberOfShieldsBreakerField"
              />

              <FormInputCheckbox
                label="Evolution?"
                v-model="cardEvolutionStatusField"
              />

              <button
                class="rounded-md bg-myDarkGreen disabled:opacity-50 text-myBlack font-bold px-3 "
                type="submit" :disabled="!areFieldsValid"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
    
<style scoped>
</style>