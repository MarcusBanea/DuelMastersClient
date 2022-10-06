<script setup>
import { computed, ref } from "@vue/runtime-core";
import ImageContainer from "../components/ImageContainer.vue";

//list of cards
const response = await fetch("/api/cards");
const cards = ref(await response.json());

//selected card
const selectedCard = ref();
const selectedCardIndex = ref(0);
const cardClicked = ref(false);

const cardRarities = [
  "Common",
  "Uncommon",
  "Rare",
  "Very Rare",
  "Super Rare",
  "Legendary",
];

async function setSelectedCard(cardIndex) {

  selectedCardIndex.value = cardIndex;
  let cardImageId = cards.value[selectedCardIndex.value].imageId;

  const response = await fetch("/api/file/download/bytes/" + cardImageId);
  selectedCard.value = await response.json();

  cardClicked.value = true;
}

const getSelectedCardImage = computed(() => {
  return selectedCard.value.content;
});

async function getCardsWithRarity(rarity) {
  let rarityString;
  switch (rarity) {
    case "Common": {
      rarityString = "Common";
      break;
    }
    case "Uncommon": {
      rarityString = "Uncommon";
      break;
    }
    case "Rare": {
      rarityString = "Rare";
      break;
    }
    case "Very Rare": {
      rarityString = "VeryRare";
      break;
    }
    case "Super Rare": {
      rarityString = "SuperRare";
      break;
    }
    case "Legendary": {
      rarityString = "Legendary";
      break;
    }
  }
  const response = await fetch("/api/cards/all" + rarityString);
  cards.value = await response.json();
}
</script>


<template>
  <div class="bg-myDarkGreen h-full grid grid-cols-2 col-gap-2">
    <div class="
        bg-myBlack
        text-white
        font-bold
        grid
        grid-rows-[min-content_min-content]
        h-screen
      ">
      <ul id="Rarity-navbar" class="grid grid-cols-6 h-auto mt-5 mb-4 border-b-4">
        <li class="
            text-myDarkGreen
            cursor-pointer
            mb-7
            transition
            duration-1000
            ease-in-out
            hover:scale-110 hover:bg-gray-100 hover:text-myBlack
            text-2xl
          " v-for="rarity in cardRarities" :key="rarity" @click="getCardsWithRarity(rarity)">
          {{ rarity }}
        </li>
      </ul>

      <ul id="Cards-names" class="grid place-items-center" :key="cards">
        <li class="
            cursor-pointer
            mb-2
            transition
            duration-1000
            ease-in-out
            hover:scale-110 hover:bg-gray-100 hover:text-myBlack
            text-xl
            min-w-min
          " v-for="(card, index) in cards" :key="card" @click="setSelectedCard(index)">
          {{ card.name }}
        </li>
      </ul>
    </div>

    <div v-if="cardClicked" class="grid place-items-center h-screen">
      <div class="grid place-items-center shadow-md rounded px-8 pt-6 pb-8 m-4">
        <ImageContainer container-width="50%" :image-url="getSelectedCardImage" />
      </div>
    </div>
  </div>
</template>




<style scoped>

</style>