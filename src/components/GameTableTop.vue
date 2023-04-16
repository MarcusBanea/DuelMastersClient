<script setup>
import { reactive, ref } from '@vue/reactivity';
import { computed, onMounted, watch } from '@vue/runtime-core';
import CardHandBlock from './CardHandBlock.vue';
import ImageContainerV2 from './ImageContainerV2.vue';
import utils from "@/Utils";
import { useMatchStore } from '../stores/matchStore';
import Mana from './Mana.vue';
import Graveyard from './Graveyard.vue';
import Shields from './Shields.vue';
import Deck from './Deck.vue';
import BattleZone from './BattleZone.vue';
import Hand from './Hand.vue';

const props = defineProps({
    opponentIsAttacking: Boolean,
    state: Object,
    send: Object
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

const turnText = 'player2Turn';

</script>




<template>
    
    <div v-if="!isHandSelected" id="table_container" class="border-2 border-myBeige bg-myBlack w-[95%] h-[100%] m-auto grid grid-rows-[25%_35%_40%]">
      
        <div id="manaZone_container" class="w-[55%] h-[100%] flex flex-row flex-nowrap m-auto">

            <Mana player = "player2" />

        </div>

        <div id="middleZone_container" class="grid grid-cols-[15%_70%_15%]">

            <Graveyard />

            <Shields />

            <Deck :clickable = state.matches(turnText) player = 'player2' />

        </div>

        <BattleZone :state = state :send = send player = 'player2' />

        <button v-if="state.matches('player2Turn')" class="absolute bg-myBeige text-myBlack font-bold rounded w-min px-4 top-28 right-24" @click="isHandSelected = !isHandSelected">
            HAND
        </button>

        <button v-if="state.matches('player2Turn')" class="absolute bg-myBeige text-myBlack font-bold rounded px-4 top-28 left-24" @click="send('END_TURN')">
          END TURN
        </button>

    </div>

    <div v-else id="hand_container" class="border-2 border-myBeige bg-myBlack w-[1500px] h-[100%] m-auto">

        <Hand player = "player2" />

    </div>

</template>



<style scoped>

</style>