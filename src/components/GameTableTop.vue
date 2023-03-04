<script setup>
import { reactive, ref } from '@vue/reactivity';
import { computed, onMounted, watch } from '@vue/runtime-core';
import CardHandBlock from './CardHandBlock.vue';
import ImageContainerV2 from './ImageContainerV2.vue';
import utils from "@/Utils";
import { useMatchStore } from '../stores/matchStore';

const props = defineProps({
    opponentIsAttacking: Boolean
});

const emits = defineEmits(['endOfTurn', 'selectCard', 'opponentSelectCard', 'sendCardToMana', 'sendCardToBattleZone']);

defineExpose({executeAction});

const matchStore = useMatchStore();

const isHandSelected = ref(false);

const lastCardSelectedIndex = ref(-1);

//semaphore-alike variable
const waitForAction = ref(false);

//selection array for ability execution
const selection = ref([]);
const selectionCounter = ref(0);

//if the opponent selected a card for attack, all possible cards that can be attacked must be highlighted
//TODO: look at opponent's selected card and see what card it can/can't attack
watch(() => props.opponentIsAttacking, (newValue, oldValue) => {
    matchStore.player2['shields'].forEach((card) => {
        if(card.selected === undefined) {
            card.selected = true;
        }
        else {
            card.selected = !card.selected;
        }
    })
    matchStore.player2['battleZone'].forEach((card) => {
        if(card.selected === undefined) {
            card.selected = true;
        }
        else {
            card.selected = !card.selected;
        }
    })    
});

//save the index of the (last) selected card from the battle zone and send it to match interface
//the match interface will notify the opponent player interface to highlight the attack options for this selected card
function selectCard(index) {
    if(lastCardSelectedIndex.value != -1 && lastCardSelectedIndex.value != index) {
        matchStore.player2['battleZone'][lastCardSelectedIndex.value].selected = false;
    }
    matchStore.player2['battleZone'][index].selected = !matchStore.player2['battleZone'][index].selected;
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
            matchStore.moveCard(lastCardSelectedIndex.value, "battleZone", "graveyard", 'player2');
            break;
        }
        default : { 
            break;
        }
    }
    resetCardHighlightedStatusEffect();
}

function selectedCardForCommandExecution(index, zone) {
    //add card to selection for command (ability) execution
    let cardCode = zone + " " + index;
    selection.value.push(cardCode);
    if(selection.value.length == selectionCounter.value) {
        executeAbilityOnSelection();
    }
}

function executeAbilityOnSelection() {
    
}

//after specific actions, card highlighted status effect must be reset
function resetCardHighlightedStatusEffect() {
    //shields
    matchStore.player2['shields'].forEach((card) => {
        card.selected = false;
    })
    //battle zone
    matchStore.player2['battleZone'].forEach((card) => {
        card.selected = false;
    })
    lastCardSelectedIndex.value = -1;
}

</script>




<template>
    
    <div v-if="!isHandSelected" id="table_container" class="border-2 border-myBeige bg-myBlack w-[95%] h-[100%] m-auto grid grid-rows-[25%_35%_40%]">
      
        <div id="manaZone_container" class="w-[55%] h-[100%] flex flex-row flex-nowrap m-auto">

            <div v-for="card in matchStore.player2['manaZone']" :key="card" class="w-[100px] h-[100px]">

                <ImageContainerV2 v-if="!card.highlighted" :zoom-on-hover-activated="false" :image="card.image" container-width="70%" rotate="-0.25turn"/>
            
            </div>

        </div>

        <div id="middleZone_container" class="grid grid-cols-[15%_70%_15%]">

            <div id="graveyard_container" class="w-[40%] h-[90%] border-2 border-myBeige m-auto grid cursor-pointer">

                <div v-if="!matchStore.isGraveyardEmpty('player2')" :key="matchStore.isGraveyardEmpty('player2')">
                    <ImageContainerV2 :image="matchStore.player2['graveyard'][matchStore.player2['graveyard'].length - 1].image" container-width="80%"/>
                </div>
                <p v-else class="text-myBeige m-auto">
                    GRAVEYARD
                </p>

            </div>

            <div id="shields_container" class="w-[70%] h-[90%] border-2 border-myBeige m-auto flex flex-row justify-between">
              
                <div v-for="card in matchStore.player2['shields']" :key="card">

                    <div v-if="card.selected == true" class="border-4 border-myLightGreen">
                        <img src="../assets/Shield.jpg" class="h-28"/>
                    </div>
                    <div v-else >
                        <img src="../assets/Shield.jpg" class="h-28"/>
                    </div>

                </div>

            </div>

            <div id="deck_container" class="w-[40%] h-[90%] border-2 border-myBeige m-auto grid cursor-pointer">
                
                <p class="text-myBeige m-auto" @click="matchStore.drawCard('player2')">
                    DECK
                    <br>
                    GET CARD
                </p>

            </div>

        </div>

        <div id="battleZone_container" class="w-[100%] h-[100%] flex flex-row justify-evenly mb-2 mt-2">

            <div v-for="(card, index) in matchStore.player2['battleZone']" :key="card" class="w-[6%] h-[100px]">
                <div v-if="card.selected == true && matchStore.itsTurnOf('TOP')" class="border-4">
                    <ImageContainerV2 :zoom-on-hover-activated="true" :image="card.image" container-width="100%" @click="selectCard(index)"/>
                </div>
                <div v-else-if="card.selected == true && matchStore.itsTurnOf('BOTTOM')" class="border-4 border-myLightGreen">
                    <ImageContainerV2 :zoom-on-hover-activated="true" :image="card.image" container-width="100%" @click="opponentSelectCard(index)"/>
                </div>
                <div v-else>
                    <ImageContainerV2 :zoom-on-hover-activated="true" :image="card.image" container-width="100%" @click="matchStore.itsTurnOf('TOP') && selectCard(index)"/>
                </div>
            </div>

        </div>

        <button v-if="matchStore.itsTurnOf('TOP')" class="absolute bg-myBeige text-myBlack font-bold rounded w-min px-4 top-28 right-24" @click="isHandSelected = !isHandSelected">
            HAND
        </button>

        <button v-if="matchStore.itsTurnOf('TOP')" class="absolute bg-myBeige text-myBlack font-bold rounded px-4 top-28 left-24" @click="matchStore.changeTurn()">
          END TURN
        </button>

    </div>

    <div v-else id="hand_container" class="border-2 border-myBeige bg-myBlack w-[1500px] h-[100%] m-auto">

        <div class="w-full h-full flex flex-row flex-nowrap overflow-x-auto">

            <CardHandBlock v-for="(card, index) in matchStore.player2['hand']" :key="card" :image="card.image" :index="index" 
                :mana-available="matchStore.currentTurnManaAvailable" 
                :mana="card.mana" 
                :can-send-to-mana="matchStore.currentTurnCanSendToMana"
                @send-to-mana="isHandSelected = !isHandSelected; matchStore.sendCardFromHandToMana(index, 'player2')"
                @send-to-battle-zone=" isHandSelected = !isHandSelected; matchStore.sendCardFromHandToBattleZone(index, 'player2');"
            />

        </div>

        <button class="absolute bg-myBeige text-myBlack font-bold rounded w-min px-4 top-28 right-24" @click="isHandSelected = !isHandSelected">
          HAND
        </button>

    </div>

</template>



<style scoped>

</style>