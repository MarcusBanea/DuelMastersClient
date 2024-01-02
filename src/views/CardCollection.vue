<script setup>
import { computed, ref } from "@vue/runtime-core";
import ImageContainer from "../components/ImageContainer.vue";
import Header from "../components/Header.vue";
import CardService from "../services/CardService";

//list of cards
//const response = await fetch("/api/cards");


const responseCards = await CardService.getAllCards();
const cards = ref(await responseCards.data);

//selected card
const selectedCard = ref();
const selectedCardIndex = ref(0);
const cardClicked = ref(false);

const currentCards = ref(cards.value);
const currentPageNumber = ref(0);

const cardRarities = [
  "Common",
  "Uncommon",
  "Rare",
  "Very Rare",
  "Super Rare",
  "Legendary",
];

async function setSelectedCard(cardIndex) {
  selectedCardIndex.value = cardIndex + currentPageNumber.value * 19;
  //let cardImageId = currentCards.value[selectedCardIndex.value].imageId;
  // const response = await fetch("/api/file/download/bytes/" + cardImageId);
  const responseCard = await CardService.getCardImageByCardName(currentCards.value[selectedCardIndex.value].name);
  selectedCard.value = await responseCard.data;
  console.log(selectedCard.value);
  cardClicked.value = true;
}

const getSelectedCardImage = computed(() => {
  // return selectedCard.value.content;
  return selectedCard.value;
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
      rarityString = "Very Rare";
      break;
    }
    case "Super Rare": {
      rarityString = "Super Rare";
      break;
    }
    case "Legendary": {
      rarityString = "Legendary";
      break;
    }
  }

  currentCards.value = [];
  cards.value.forEach((card) => {
    if(card.rarity === rarityString) {
      currentCards.value.push(card);
    }
  })

  currentPageNumber.value = 0;
}

const currentPageCards = computed(() => {
  return currentCards.value.slice(currentPageNumber.value * 19, (currentPageNumber.value + 1) * 19);
})

</script>


<template>

  <Header></Header>

  <div class="bg-myDarkGreen h-[90%] grid grid-cols-2 col-gap-2">
    <div class="bg-myBlack text-white font-bold grid grid-rows-[10%_80%_10%]">
      <ul id="Rarity-navbar" class="grid grid-cols-6 mt-5 mb-4 border-b-4">
        <li class="text-myDarkGreen cursor-pointer mb-7 transition duration-1000 ease-in-out hover:scale-110 hover:bg-gray-100 
          hover:text-myBlack text-2xl
          " v-for="rarity in cardRarities" :key="rarity" @click="getCardsWithRarity(rarity)">
          {{ rarity }}
        </li>
      </ul>

      <div class="h-full">
        <ul id="Cards-names" class="grid place-items-center" :key="currentCards">
          <li class=" cursor-pointer mb-2 pl-8 pr-8 transition duration-1000 ease-in-out hover:scale-110 hover:bg-gray-100 
            hover:text-myBlack text-xl min-w-min
            " v-for="(card, index) in currentPageCards" :key="card" @click="setSelectedCard(index)">
            {{ card.name }}
          </li>
        </ul>
      </div>

      <div class="flex justify-around">
        <div v-if="currentPageNumber + 1 < (currentCards.length / 19)" class="border-4 mb-2 pl-8 pr-8 b-myBeige text-myDarkGreen 
          cursor-pointer transition duration-1000 ease-in-out hover:bg-gray-100 hover:text-myBlack text-2xl grid"
            @click="currentPageNumber++">
            <div class="m-auto">
              NEXT PAGE
            </div> 
        </div>
        <div v-if="currentPageNumber > 0" class="border-4 b-myBeige text-myDarkGreen pl-8 pr-8 cursor-pointer transition
            duration-1000 ease-in-out hover:bg-gray-100 hover:text-myBlack text-2xl grid"
            @click="currentPageNumber--">
            <div class="m-auto">
              PREVIOUS PAGE
            </div>  
        </div>
      </div>

    </div>

    <div v-if="cardClicked" class="grid place-items-center h-[90%]">
      <div class="grid place-items-center shadow-md rounded px-8 pt-6 pb-8 m-4">
        <ImageContainer container-width="50%" :image-url="getSelectedCardImage" />
      </div>
    </div>
  </div>
</template>
