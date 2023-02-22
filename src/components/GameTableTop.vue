<script setup>
import { ref } from '@vue/reactivity';
import { watch } from '@vue/runtime-core';
import CardHandBlock from './CardHandBlock.vue';
import ImageContainerV2 from './ImageContainerV2.vue';


const props = defineProps({
    player: Array,
    opponentIsAttacking: Boolean,
    itsYourTurn: Boolean
});

const emits = defineEmits(['endOfTurn', 'drawCardEvent', 'selectCard', 'opponentSelectCard', 'sendCardToMana', 'sendCardToBattleZone']);

defineExpose({executeAction});

const cardsInHand = ref(props.player["hand"]);
const cardsInBattleZone = ref(props.player["battleZone"]);
const cardsInMana = ref(props.player["manaZone"]);
const cardsInGraveyard = ref(props.player["graveyard"]);
const cardsInDeck = ref(props.player["deck"]);
const cardsInShields = ref(props.player["shields"])

const currentTurnManaAvailable = ref(cardsInMana.value.length);
const canSendToMana = ref(props.itsYourTurn);

const isHandSelected = ref(false);

const lastCardSelectedIndex = ref(-1);

//can send to mana only when turn is true
watch(() => props.itsYourTurn, (newValue, oldValue) => {
    canSendToMana.value = newValue;
    currentTurnManaAvailable.value = cardsInMana.value.length;
});

//if the opponent selected a card for attack, all possible cards that can be attacked must be highlighted
//TODO: look at opponent's selected card and see what card it can/can't attack
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

//move the card at index in hand cards array to mana cards array
function sendCardFromHandToMana(index) {
    currentTurnManaAvailable.value++;
    cardsInMana.value.push(cardsInHand.value[index]);
    cardsInHand.value.splice(index, 1);
    canSendToMana.value = false;

    isHandSelected.value = !isHandSelected.value;
    emits("sendCardToMana", index);
}

//move the card at index in hand cards array to battle zone cards array
function sendCardFromHandToBattleZone(index) {
    currentTurnManaAvailable.value -= cardsInHand.value[index].mana;
    let cardToAdd = cardsInHand.value[index];
    //activate card highlighted status
    cardToAdd.selected = false;
    cardsInBattleZone.value.push(cardToAdd);
    cardsInHand.value.splice(index, 1);

    isHandSelected.value = !isHandSelected.value;
    emits("sendCardToBattleZone", index);
}

//move card at index 0 in deck cards array to hand cards array
function drawCard() {
    cardsInHand.value.push(cardsInDeck.value[0]);
    cardsInDeck.value.splice(0, 1);
    emits("drawCardEvent");
}

//notify match interface that this turn has ended
function endTurn() {
    emits("endOfTurn");
}

//save the index of the (last) selected card from the battle zone and send it to match interface
//the match interface will notify the opponent player interface to highlight the attack options for this selected card
function selectCard(index) {
    if(lastCardSelectedIndex.value != -1 && lastCardSelectedIndex.value != index) {
        cardsInBattleZone.value[lastCardSelectedIndex.value].selected = false;
    }
    cardsInBattleZone.value[index].selected = !cardsInBattleZone.value[index].selected;
    lastCardSelectedIndex.value = index;
    emits("selectCard", lastCardSelectedIndex.value);
}

//when the opponent is attacking, notify the match interface which card he/she selected
function opponentSelectCard(index) {
    lastCardSelectedIndex.value = index;    
    emits("opponentSelectCard", lastCardSelectedIndex.value);
}

//decode the response provided by server (through match interface) and execute the action
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

function isGraveyardEmpty() {
    return cardsInGraveyard.value.length == 0 ? true : false;
}

//after specific actions, card highlighted status effect must be reset
function resetCardHighlightedStatusEffect() {
    //shields
    cardsInShields.value.forEach((card) => {
        card.selected = false;
    })
    //battle zone
    cardsInBattleZone.value.forEach((card) => {
        card.selected = false;
    })
    lastCardSelectedIndex.value = -1;
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

        <div id="battleZone_container" class="w-[100%] h-[100%] flex flex-row justify-evenly mb-2 mt-2">

            <div v-for="(card, index) in cardsInBattleZone" :key="card" class="w-[6%] h-[100px]">
                <div v-if="card.selected == true && itsYourTurn" class="border-4">
                    <ImageContainerV2 :image="card.image" container-width="100%" @click="selectCard(index)"/>
                </div>
                <div v-else-if="card.selected == true && !itsYourTurn" class="border-4 border-myLightGreen">
                    <ImageContainerV2 :image="card.image" container-width="100%" @click="opponentSelectCard(index)"/>
                </div>
                <div v-else>
                    <ImageContainerV2 :image="card.image" container-width="100%" @click="itsYourTurn && selectCard(index)"/>
                </div>
            </div>

        </div>

        <button v-if="itsYourTurn" class="absolute bg-myBeige text-myBlack font-bold rounded w-min px-4 top-28 right-24" @click="isHandSelected = !isHandSelected">
            HAND
        </button>

        <button v-if="itsYourTurn" class="absolute bg-myBeige text-myBlack font-bold rounded px-4 top-28 left-24" @click="endTurn()">
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

        <button class="absolute bg-myBeige text-myBlack font-bold rounded w-min px-4 top-28 right-24" @click="isHandSelected = !isHandSelected">
          HAND
        </button>

    </div>

</template>



<style scoped>

</style>