<script setup>
import { reactive, ref } from '@vue/reactivity';
import { computed, onMounted, watch } from '@vue/runtime-core';
import CardHandBlock from './CardHandBlock.vue';
import ImageContainerV2 from './ImageContainerV2.vue';
import Graveyard from './Graveyard.vue';
import Deck from './Deck.vue';
import Shields from './Shields.vue';
import Mana from './Mana.vue';
import BattleZone from './BattleZone.vue';
import Hand from './Hand.vue';
import utils from "@/Utils";
import { useMatchStore } from '../stores/matchStore';
import matchMachine from '../machines/matchMachine';
import { useMachine } from '@xstate/vue';

const props = defineProps({
    opponentIsAttacking: Boolean,
    state: Object,
    send: Object,
    service: Object
});

const emits = defineEmits(['endOfTurn', 'selectCard', 'opponentSelectCard', 'sendCardToMana', 'sendCardToBattleZone']);

defineExpose({executeAction});

const matchStore = useMatchStore();
//const {state, send, service} = useMachine(matchMachine);

const isHandSelected = ref(false);



//semaphore-alike variable
const waitForAction = ref(false);

//selection array for ability execution
const selection = ref([]);
const selectionCounter = ref(0);

//if the opponent selected a card for attack, all possible cards that can be attacked must be highlighted
//TODO: look at opponent's selected card and see what card it can/can't attack
watch(() => props.opponentIsAttacking, (newValue, oldValue) => {
    matchStore.player1['shields'].forEach((card) => {
        if(card.selected === undefined) {
            card.selected = true;
        }
        else {
            card.selected = !card.selected;
        }
    })
    matchStore.player1['battleZone'].forEach((card) => {
        if(card.selected === undefined) {
            card.selected = true;
        }
        else {
            card.selected = !card.selected;
        }
    })    
});


//decode the response provided by server (through match interface) and execute the action
function executeAction(action) {

    let steps = action.split(' ');
    
    //iterate and execute steps
    for(let i = 0; i < steps.length; i++) {
        console.log("Step " + i + " : " + steps[i]);

        if(steps[i].includes("_")) {
            //command step
            console.log("Step " + i + " is a command step. e.g. a choose, count or get command.");
            //split the command step in 5 specific codes
            //code 0 - command type: CHS/GET/CNT...
            //code 1 - command code: 0/3/8/...
            //code 2 - number of cards considered for this command
            //code 3 - specific class/realm/power/... attribute considered for this command
            //code 4 - zone
            let command = steps[i].split("_");
            //execute specific command type
            switch(command[0]) {
                //choose - highlight cards that can be chosen, based on the command codes
                case "CHS" : {
                    //set selection counter
                    selectionCounter.value = command[2];

                    let player = {
                        cardsInBattleZone : matchStore.player1['battleZone'],
                        cardsInMana: matchStore.player1['manaZone'],
                        cardsInGraveyard: matchStore.player1['graveyard'],
                        cardsInHand: matchStore.player1['hand'],
                        cardsInDeck: matchStore.player1['deck']
                    };
                    let highlightedCards = utils.getCards(player, command[1], command[3], command[4]);
                    console.log(highlightedCards);
                    highlightedCards.forEach((card) => {
                        let cardZone = card.substring(0, 3);
                        let cardIndex = card.substring(4);
                        switch(cardZone) {
                            case "MN0" : {
                                matchStore.player1['manaZone'][cardIndex].highlighted = true;
                                waitForAction.value = true;
                                break;
                            }
                            default : {
                                break;
                            }
                        }
                    });
                    break;
                }
                //get - user will not select anything, the cards will be selected based on the command codes and will be put in a selection array
                //this array will be used after for the rest of ability execution
                case "GET" : {

                    break;
                }
                //count - will count the cards with specific attributes, based on the command codes
                //the result will be used after for the rest of ability execution
                case "CNT" : {

                    break;
                }
                default : {
                    break;
                }
            }
        }
    }

    resetCardHighlightedStatusEffect();
}

//after specific actions, card highlighted status effect must be reset
function resetCardHighlightedStatusEffect() {
    //shields
    matchStore.player1['shields'].forEach((card) => {
        card.selected = false;
    })
    //battle zone
    matchStore.player1['battleZone'].forEach((card) => {
        card.selected = false;
    })
    lastCardSelectedIndex.value = -1;
}

const turnText = 'player1Turn';

</script>


<template>
    
    <div v-if="!state.context.isPlayer1HandSelected" id="table_container" class="border-2 border-myBeige bg-myBlack w-[95%] h-[100%] m-auto grid grid-rows-[40%_35%_25%]">
    
        <BattleZone :state = state :send = send player = 'player1' />

        <div id="middleZone_container" class="grid grid-cols-[15%_70%_15%]">

            <Graveyard />

            <Shields />

            <Deck :clickable = state.matches(turnText) player = 'player1' />

        </div>

        <div id="manaZone_container" class="w-[55%] h-[100%] flex flex-row flex-nowrap m-auto">

            <Mana player = "player1" />

        </div>

        <button v-if="state.matches('player1Turn')" class="absolute bg-myBeige text-myBlack font-bold rounded w-min px-4 bottom-8 right-24" @click="send('TOGGLE_HAND_VISIBILITY');">
            HAND
        </button>

        <button v-if="state.matches('player1Turn')" class="absolute bg-myBeige text-myBlack font-bold rounded px-4 bottom-8 left-24" @click="send('END_TURN')">
          END TURN
        </button>

    </div>

    <div v-else id="hand_container" class="border-2 border-myBeige bg-myBlack w-[1500px] h-[100%] m-auto">

        <Hand player = "player1" :send = send :state = state />

    </div>

</template>



<style scoped>

</style>