<script setup>
import Graveyard from './Graveyard.vue';
import Deck from './Deck.vue';
import Shields from './Shields.vue';
import Mana from './Mana.vue';
import BattleZone from './BattleZone.vue';
import Hand from './Hand.vue';
import { useMatchStore } from '../stores/matchStore';

const props = defineProps({
    opponentIsAttacking: Boolean,
    state: Object,
    send: Object,
    service: Object
});

const emits = defineEmits(['endOfTurn', 'selectCard', 'opponentSelectCard', 'sendCardToMana', 'sendCardToBattleZone']);

const matchStore = useMatchStore();

const turnText = 'player1Turn';

</script>


<template>
    
    <div v-if="!state.context.isPlayer1HandSelected" id="table_container" class="border-2 border-myBeige bg-myBlack w-[95%] h-[100%] m-auto grid grid-rows-[40%_35%_25%]">
    
        <BattleZone :state = state :send = send player = 'player1' />

        <div id="middleZone_container" class="grid grid-cols-[15%_70%_15%]">

            <Graveyard player = 'player1' />

            <Shields player = 'player1' />

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