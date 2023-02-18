<script setup>
import { ref } from '@vue/reactivity';
import { watch } from '@vue/runtime-core';
import CardHandBlock from './CardHandBlock.vue';
import ImageContainerV2 from './ImageContainerV2.vue';

const props = defineProps({
    selectable: Boolean,
    canSendToManaProp: Boolean,
    player: Array,

    opponentIsAttacking: Boolean
});

const emits = defineEmits(['endOfTurn', 'drawCardEvent', 'selectCard']);

const userId = "633f18459af2fa78268b91d4";
const cardsInHand = ref(props.player["hand"]);

const cardsInBattleZone = ref(props.player["battleZone"]);
const cardsInMana = ref(props.player["manaZone"]);
const cardsInGraveyard = ref(props.player["graveyard"]);
const cardsInDeck = ref(props.player["deck"]);
const cardsInShields = ref(props.player["shields"])
const numberOfShields = ref(5);

const currentTurnManaAvailable = ref(cardsInMana.value.length);

const isHandSelected = ref(false);

const canSendToMana = ref(props.canSendToManaProp);

watch(() => props.canSendToManaProp, (newValue, oldValue) => {
    canSendToMana.value = newValue;
    currentTurnManaAvailable.value = cardsInMana.value.length;
});

watch(() => props.opponentIsAttacking, (newValue, oldValue) => {
    cardsInShields.value.forEach((card) => {
        if(card.selected === undefined) {
            card.selected = true;
        }
        else {
            card.selected = !card.selected;
        }
    })   
});

function showHand() {
    isHandSelected.value = !isHandSelected.value;
}

function sendCardFromHandToMana(index) {
    showHand();
    currentTurnManaAvailable.value++;
    cardsInMana.value.push(cardsInHand.value[index]);
    cardsInHand.value.splice(index, 1);

    canSendToMana.value = false;

    //emits("endOfTurn");
}

function sendCardFromHandToBattleZone(index) {
    showHand();
    currentTurnManaAvailable.value -= cardsInHand.value[index].mana;
    let cardToAdd = cardsInHand.value[index];
    //attribute used when selecting card for attack
    cardToAdd.selected = false;
    cardsInBattleZone.value.push(cardToAdd);
    myNumberOfCardsInBattleZone.value++;
    cardsInHand.value.splice(index, 1);
}

function drawCard() {
    cardsInHand.value.push(cardsInDeck.value[0]);
    cardsInDeck.value.splice(0, 1);
    emits("drawCardEvent");
}

function endTurn() {
    emits("endOfTurn");
}

function selectCard(index) {
    cardsInBattleZone.value[index].selected = !cardsInBattleZone.value[index].selected;
    emits("selectCard", index);
}

</script>




<template>
    
    <div v-if="!isHandSelected" id="table_container" class="border-2 border-myBeige bg-myBlack w-[95%] h-[100%] m-auto grid grid-rows-[25%_35%_40%]">
      
        <div id="manaZone_container" class="w-[55%] h-[100%] flex flex-row flex-nowrap m-auto">

            <div v-for="card in cardsInMana" :key="card" class="w-[100px] h-[100px]">
                <ImageContainerV2 :image="card.image" container-width="70%" rotate="-0.25turn"/>
            </div>

        </div>

        <div id="middleZone_container" class="grid grid-cols-[15%_70%_15%]">

            <div id="graveyard_container" class="w-[40%] h-[90%] border-2 border-myBeige m-auto grid cursor-pointer">

                <p class="text-myBeige m-auto">
                    GRAVEYARD
                </p>

            </div>

            <div id="shields_container" class="w-[70%] h-[90%] border-2 border-myBeige m-auto flex flex-row justify-between">
              
                <div v-for="card in cardsInShields" :key="card">

                    <div v-if="card.selected == true" class="border-4">
                        <img src="../assets/Shield.jpg" class="h-28"/>
                    </div>
                    <div v-else >
                        <img src="../assets/Shield.jpg" class="h-28"/>
                    </div>

                </div>

            </div>

            <div id="deck_container" class="w-[40%] h-[90%] border-2 border-myBeige m-auto grid cursor-pointer">
                
                <p class="text-myBeige m-auto" @click="drawCard">
                    DECK
                    <br>
                    GET CARD
                </p>

            </div>

        </div>

        <div id="battleZone_container" class="w-[100%] h-[100%] flex flex-row justify-evenly mb-2 mt-2">

            <div v-for="(card, index) in cardsInBattleZone" :key="card" class="w-[6%] h-[100px]">
                <div v-if="card.selected == true" class="border-4">
                    <ImageContainerV2 :image="card.image" container-width="100%" @click="selectCard(index)"/>
                </div>
                <div v-else>
                    <ImageContainerV2 :image="card.image" container-width="100%" @click="selectCard(index)"/>
                </div>
                
            </div>

        </div>

        <button v-if="selectable == true" class="absolute bg-myBeige text-myBlack font-bold rounded w-min px-4 top-28 right-24" @click="showHand()">
            HAND
        </button>

        <button v-if="selectable == true" class="absolute bg-myBeige text-myBlack font-bold rounded px-4 top-28 left-24" @click="endTurn()">
          END TURN
        </button>

    </div>

    <div v-else id="hand_container" class="border-2 border-myBeige bg-myBlack w-[1500px] h-[100%] m-auto">

        <div class="w-full h-full flex flex-row flex-nowrap overflow-x-auto">

            <CardHandBlock v-for="(card, index) in cardsInHand" :key="card" :image="card.image" :index="index" 
                :mana-available="currentTurnManaAvailable" :mana="card.mana" :can-send-to-mana="canSendToMana"
                @send-to-mana="sendCardFromHandToMana($event, index)"
                @send-to-battle-zone="sendCardFromHandToBattleZone($event, index)"
            />

        </div>

        <button class="absolute bg-myBeige text-myBlack font-bold rounded w-min px-4 top-28 right-24" @click="showHand()">
          HAND
        </button>

    </div>

</template>



<style scoped>

</style>