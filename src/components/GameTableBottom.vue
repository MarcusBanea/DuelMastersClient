<script setup>
import { ref } from '@vue/reactivity';
import { computed, watch } from '@vue/runtime-core';
import CardHandBlock from './CardHandBlock.vue';
import ImageContainerV2 from './ImageContainerV2.vue';

const props = defineProps({
    selectable: Boolean,
    canSendToManaProp: Boolean
});

const emits = defineEmits(['endOfTurn']);

const userId = "633f18459af2fa78268b91d4";
const responseDeck = await fetch("/api/users/getRandomDeckWithGameCards/" + userId);
const deck = ref(await responseDeck.json());

const cardsInBattleZone = ref([]);
const cardsInMana = ref([]);
const cardsInGraveyard = ref([]);
const cardsInDeck = ref([]);
const numberOfShields = ref(5);

const currentTurnManaAvailable = ref(cardsInMana.value.length);

const isHandSelected = ref(false);

const canSendToMana = ref(props.canSendToManaProp);

watch(() => props.canSendToManaProp, (newValue, oldValue) => {
    canSendToMana.value = newValue;
    currentTurnManaAvailable.value = cardsInMana.value.length;
});

function showHand() {
    isHandSelected.value = !isHandSelected.value;
}

function sendCardFromHandToMana(index) {
    showHand();
    currentTurnManaAvailable.value++;
    cardsInMana.value.push(deck.value[index]);
    deck.value.splice(index, 1);

    canSendToMana.value = false;

    //emits("endOfTurn");
}

function sendCardFromHandToBattleZone(index) {
    showHand();
    currentTurnManaAvailable.value -= deck.value[index].mana;
    cardsInBattleZone.value.push(deck.value[index]);
    myNumberOfCardsInBattleZone.value++;
    deck.value.splice(index, 1);
}

function endTurn() {
    emits("endOfTurn");
}

</script>




<template>
    
    <div v-if="!isHandSelected" id="table_container" class="border-2 border-myBeige bg-myBlack w-[95%] h-[100%] m-auto grid grid-rows-[40%_35%_25%]">
      
        <div id="battleZone_container" class="w-[100%] h-[100%] flex flex-row justify-evenly">

            <div v-for="card in cardsInBattleZone" :key="card" class="w-[100px] h-[100px]">
                <ImageContainerV2 :image="card.image" container-width="110%"/>
            </div>

        </div>

        <div id="middleZone_container" class="grid grid-cols-[15%_70%_15%]">

            <div id="graveyard_container" class="w-[40%] h-[90%] border-2 border-myBeige m-auto grid cursor-pointer">

                <p class="text-myBeige m-auto">
                    GRAVEYARD
                </p>

            </div>

            <div id="shields_container" class="w-[70%] h-[90%] border-2 border-myBeige m-auto flex flex-row justify-between">
              
                <div v-for="index in numberOfShields" :key="index">

                    <img src="../assets/Shield.jpg" class="h-28"/>

                </div>

            </div>

            <div id="deck_container" class="w-[40%] h-[90%] border-2 border-myBeige m-auto grid cursor-pointer">
                
                <p class="text-myBeige m-auto">
                    DECK
                    <br>
                    GET CARD
                </p>

            </div>

        </div>

        <div id="manaZone_container" class="w-[55%] h-[100%] flex flex-row flex-nowrap m-auto">

            <div v-for="card in cardsInMana" :key="card" class="w-[100px] h-[100px]">
                <ImageContainerV2 :image="card.image" container-width="70%" rotate="-0.25turn"/>
            </div>

        </div>

        <button v-if="selectable == true" class="absolute bg-myBeige text-myBlack font-bold rounded w-min px-4 bottom-8 right-24" @click="showHand()">
            HAND
        </button>

        <button v-if="selectable == true" class="absolute bg-myBeige text-myBlack font-bold rounded px-4 bottom-8 left-24" @click="endTurn()">
          END TURN
        </button>

    </div>

    <div v-else id="hand_container" class="border-2 border-myBeige bg-myBlack w-[1500px] h-[100%] m-auto">

        <div class="w-full h-full flex flex-row flex-nowrap overflow-x-auto">

            <CardHandBlock v-for="(card, index) in deck" :key="card" :image="card.image" :index="index" 
                :mana-available="currentTurnManaAvailable" :mana="card.mana" :can-send-to-mana="canSendToMana"
                @send-to-mana="sendCardFromHandToMana($event, index)"
                @send-to-battle-zone="sendCardFromHandToBattleZone($event, index)"
            />

        </div>

        <button class="absolute bg-myBeige text-myBlack font-bold rounded w-min px-4 bottom-8 right-24" @click="showHand()">
          HAND
        </button>

    </div>

</template>



<style scoped>

</style>