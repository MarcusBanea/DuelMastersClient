<script setup>
import { computed, ref, watch } from "@vue/runtime-core";
import FormInputString from "../components/Admin/FormInputString.vue";
import FormInputFile from "../components/Admin/FormInputFile.vue";
import FormInputSelect from "../components/Admin/FormInputSelect.vue";

const packNameField = ref("");
const packTotalNumberOfCardsField = ref();
const packNumberOfCommonCards = ref("0");
const packNumberOfUncommonCards = ref("0");
const packNumberOfRareCards = ref("0");
const packNumberOfVeryRareCards = ref("0");
const packNumberOfSuperRareCards = ref("0");
const packNumberOfLegendaryCards = ref("0");
const packImageField = ref();

const remainingNumberOfCards = ref();

watch(
  [
    packNumberOfCommonCards,
    packNumberOfUncommonCards,
    packNumberOfRareCards,
    packNumberOfVeryRareCards,
    packNumberOfSuperRareCards,
    packNumberOfLegendaryCards,
  ],
  () => {
    let actualRemainingNumberOfCards = Number(
      packTotalNumberOfCardsField.value
    );
    if (packNumberOfCommonCards.value !== undefined) {
      actualRemainingNumberOfCards -= Number(packNumberOfCommonCards.value);
    }
    if (packNumberOfUncommonCards.value !== undefined) {
      actualRemainingNumberOfCards -= Number(packNumberOfUncommonCards.value);
    }
    if (packNumberOfRareCards.value !== undefined) {
      actualRemainingNumberOfCards -= Number(packNumberOfRareCards.value);
    }
    if (packNumberOfVeryRareCards.value !== undefined) {
      actualRemainingNumberOfCards -= Number(packNumberOfVeryRareCards.value);
    }
    if (packNumberOfSuperRareCards.value !== undefined) {
      actualRemainingNumberOfCards -= Number(packNumberOfSuperRareCards.value);
    }
    if (packNumberOfLegendaryCards.value !== undefined) {
      actualRemainingNumberOfCards -= Number(packNumberOfLegendaryCards.value);
    }
    remainingNumberOfCards.value = actualRemainingNumberOfCards;
  }
);

function getNumberOfCardsRemaining(currentValue) {
  if (currentValue !== undefined) {
    return remainingNumberOfCards !== undefined
      ? Array.from(
        {
          length:
            Number(remainingNumberOfCards.value) + Number(currentValue) + 1,
        },
        (_, i) => i
      )
      : [0];
  } else {
    return remainingNumberOfCards !== undefined
      ? Array.from(
        { length: Number(remainingNumberOfCards.value) + 1 },
        (_, i) => i
      )
      : [0];
  }
}

watch(packTotalNumberOfCardsField, (newTotal) => {
  remainingNumberOfCards.value = newTotal;
  resetAllPackTypeFields();
});

function resetAllPackTypeFields() {
  packNumberOfCommonCards.value = undefined;
  packNumberOfUncommonCards.value = undefined;
  packNumberOfRareCards.value = undefined;
  packNumberOfVeryRareCards.value = undefined;
  packNumberOfSuperRareCards.value = undefined;
  packNumberOfLegendaryCards.value = undefined;
}

const areFieldsValid = computed(() => {
  return (
    remainingNumberOfCards.value !== undefined &&
    remainingNumberOfCards.value === 0 &&
    packImageField.value !== undefined &&
    packNameField.value !== undefined &&
    packNameField.value !== ""
  );
});

async function addNewPackToDB() {
  var formData = new FormData();

  formData.append("file", packImageField.value);
  formData.append(
    "pack",
    new Blob(
      [
        JSON.stringify({
          name: packNameField.value,
          totalNumberOfCards: packTotalNumberOfCardsField.value,
          numberOfCommonCards: packNumberOfCommonCards.value,
          numberOfUncommonCards: packNumberOfUncommonCards.value,
          numberOfRareCards: packNumberOfRareCards.value,
          numberOfVeryRareCards: packNumberOfVeryRareCards.value,
          numberOfSuperRareCards: packNumberOfSuperRareCards.value,
          numberOfLegendaryCards: packNumberOfLegendaryCards.value,
        }),
      ],
      {
        type: "application/json",
      }
    )
  );

  var boundary = Math.random().toString().substr(2);

  fetch("/api/packs/add", {
    method: "POST",
    body: formData,
  })
    .then(function (response) {
      if (response.status !== 200) {
        alert("There was an error!");
      } else {
        alert("Request successful");
      }
    })
    .catch(function (err) {
      alert("There was an error!");
    });
}
</script>




<template>
  <div class="bg-myBlack h-full">
    <div class="grid place-items-center h-screen">
      <div class="bg-myDarkGreen rounded-2xl">
        <div>
          <h1 class="font-bold text-myBlack text-xl mt-2 mb-2">Create Pack</h1>
        </div>
        <div>
          <form @submit.prevent="addNewPackToDB" class="bg-myLightGray shadow-md rounded px-8 pt-6 pb-8 m-4">
            <div class="mb-4">
              <FormInputString label="Pack name" placeholder="Pack name" v-model="packNameField" />

              <FormInputSelect label="Cards in Pack" :options="[6, 7]" no-value-selected="Number of Cards"
                v-model="packTotalNumberOfCardsField" />

              <FormInputSelect label="Common cards" :options="getNumberOfCardsRemaining(packNumberOfCommonCards)"
                :key="packTotalNumberOfCardsField" no-value-selected="Number of Common Cards" default-value="0"
                :disabled="!packTotalNumberOfCardsField" v-model="packNumberOfCommonCards" />

              <FormInputSelect label="Uncommon cards" :options="getNumberOfCardsRemaining(packNumberOfUncommonCards)"
                :key="packTotalNumberOfCardsField" no-value-selected="Number of Uncommon Cards" default-value="0"
                :disabled="!packTotalNumberOfCardsField" v-model="packNumberOfUncommonCards" />

              <FormInputSelect label="Rare cards" :options="getNumberOfCardsRemaining(packNumberOfRareCards)"
                :key="packTotalNumberOfCardsField" no-value-selected="Number of Rare Cards" default-value="0"
                :disabled="!packTotalNumberOfCardsField" v-model="packNumberOfRareCards" />

              <FormInputSelect label="Very Rare cards" :options="getNumberOfCardsRemaining(packNumberOfVeryRareCards)"
                :key="packTotalNumberOfCardsField" no-value-selected="Number of Very Rare Cards" default-value="0"
                :disabled="!packTotalNumberOfCardsField" v-model="packNumberOfVeryRareCards" />

              <FormInputSelect label="Super Rare cards" :options="getNumberOfCardsRemaining(packNumberOfSuperRareCards)"
                :key="packTotalNumberOfCardsField" no-value-selected="Number of Super Rare Cards" default-value="0"
                :disabled="!packTotalNumberOfCardsField" v-model="packNumberOfSuperRareCards" />

              <FormInputSelect label="Legendary cards" :options="getNumberOfCardsRemaining(packNumberOfLegendaryCards)"
                :key="packTotalNumberOfCardsField" no-value-selected="Number of Legendary Cards" default-value="0"
                :disabled="!packTotalNumberOfCardsField" v-model="packNumberOfLegendaryCards" />

              <FormInputFile label="Image" v-model="packImageField" />

              <button class="
                  rounded-md
                  bg-myDarkGreen
                  disabled:opacity-50
                  text-myBlack
                  font-bold
                  px-3
                " type="submit" :disabled="!areFieldsValid">
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