<script setup>
import { reactive, ref } from '@vue/reactivity';
import { computed, onMounted, watch } from '@vue/runtime-core';
import CardHandBlock from './CardHandBlock.vue';
import ImageContainerV2 from './ImageContainerV2.vue';

const props = defineProps({
    selectable: Boolean,
    canSendToManaProp: Boolean,
    player: Array,

    opponentIsAttacking: Boolean,
    turn: String
});

const emits = defineEmits(['endOfTurn', 'drawCardEvent', 'selectCard', 'opponentSelectCard', 'sendCardToMana', 'sendCardToBattleZone']);

const cardsInHand = ref(props.player["hand"]);

const cardsInBattleZone = ref(props.player["battleZone"]);
const cardsInMana = ref(props.player["manaZone"]);
const cardsInGraveyard = ref(props.player["graveyard"]);
const cardsInDeck = ref(props.player["deck"]);
const cardsInShields = ref(props.player["shields"])

const currentTurnManaAvailable = ref(cardsInMana.value.length);

const isHandSelected = ref(false);

const canSendToMana = ref(props.canSendToManaProp);

//when it's this player's turn, 
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
    cardsInBattleZone.value.forEach((card) => {
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

    emits("sendCardToMana", index);

}

function sendCardFromHandToBattleZone(index) {
    showHand();
    currentTurnManaAvailable.value -= cardsInHand.value[index].mana;
    let cardToAdd = cardsInHand.value[index];
    //attribute used when selecting card for attack
    cardToAdd.selected = false;
    cardsInBattleZone.value.push(cardToAdd);
    cardsInHand.value.splice(index, 1);

    emits("sendCardToBattleZone", index);
}

function drawCard() {
    cardsInHand.value.push(cardsInDeck.value[0]);
    cardsInDeck.value.splice(0, 1);
    emits("drawCardEvent");
}

function endTurn() {
    emits("endOfTurn");
}

const lastCardSelectedIndex = ref(-1);

function selectCard(index) {
    if(lastCardSelectedIndex.value != -1 && lastCardSelectedIndex.value != index) {
        cardsInBattleZone.value[lastCardSelectedIndex.value].selected = false;
    }
    cardsInBattleZone.value[index].selected = !cardsInBattleZone.value[index].selected;
    lastCardSelectedIndex.value = index;
    emits("selectCard", lastCardSelectedIndex.value);
}

const opponentSelectedShield = ref(false);
const opponentSelectedBattleZoneCard = ref(false);
const opponentSelectedCardIndex = ref(-1);

function opponentSelectCard(index, zone) {
    lastCardSelectedIndex.value = index;
    if(zone == "BZ") {
        opponentSelectedBattleZoneCard.value = true;
    }
    else {
        opponentSelectedShield.value = true;
    }
    
    emits("opponentSelectCard", lastCardSelectedIndex.value);
}

function executeAction(action) {
    switch(action) {
        case "MTG" : {
            cardsInGraveyard.value.push(cardsInBattleZone.value[lastCardSelectedIndex.value]);
            cardsInBattleZone.value.splice(lastCardSelectedIndex.value, 1);
            break;
        }
        default : { 
            break;
        }
    }
    resetCardHighlightedStatusEffect();
}

defineExpose({executeAction});

function isGraveyardEmpty() {
    return cardsInGraveyard.value.length == 0 ? true : false;
}

function resetCardHighlightedStatusEffect() {
    //shields
    cardsInShields.value.forEach((card) => {
        card.selected = false;
    })
    //battle zone
    cardsInBattleZone.value.forEach((card) => {
        card.selected = false;
    })
    lastCardSelectedIndex.value = null;
}


</script>




<template>
    
    <div v-if="!isHandSelected" id="table_container" class="border-2 border-myBeige bg-myBlack w-[95%] h-[100%] m-auto grid grid-rows-[40%_35%_25%]">
      
        <div id="battleZone_container" class="w-[100%] h-[100%] flex flex-row justify-evenly mb-2 mt-2">

            <div v-for="(card, index) in cardsInBattleZone" :key="card" class="w-[6%] h-[100px]">
                <div v-if="card.selected == true && turn == 'BOTTOM'" class="border-4">
                    <ImageContainerV2 :image="card.image" container-width="100%" @click="selectCard(index)"/>
                </div>
                <div v-else-if="card.selected == true && turn == 'TOP'" class="border-4 border-myLightGreen">
                    <ImageContainerV2 :image="card.image" container-width="100%" @click="opponentSelectCard(index, 'BZ')"/>
                </div>
                <div v-else>
                    <ImageContainerV2 :image="card.image" container-width="100%" @click="selectable && selectCard(index)"/>
                </div>
                
            </div>

        </div>

        <div id="middleZone_container" class="grid grid-cols-[15%_70%_15%]">

            <div id="graveyard_container" class="w-[40%] h-[90%] border-2 border-myBeige m-auto grid cursor-pointer">

                <div v-if="!isGraveyardEmpty()" :key="isGraveyardEmpty()">
                    <ImageContainerV2 :image="cardsInGraveyard[0].image" container-width="80%"/>
                </div>
                <p v-else class="text-myBeige m-auto">
                    GRAVEYARD
                </p>

            </div>

            <div id="shields_container" class="w-[70%] h-[90%] border-2 border-myBeige m-auto flex flex-row justify-between">
              
                <div v-for="card in cardsInShields" :key="card">

                    <div v-if="card.selected == true" class="border-4 border-myLightGreen">
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

            <CardHandBlock v-for="(card, index) in cardsInHand" :key="card" :image="card.image" :index="index" 
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