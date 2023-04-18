<script setup>
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
    send: Object,
    service: Object
});

const emits = defineEmits(['endOfTurn', 'selectCard', 'opponentSelectCard', 'sendCardToMana', 'sendCardToBattleZone']);

const matchStore = useMatchStore();

const turnText = 'player2Turn';

</script>




<template>
    
    <div v-if="!state.context.isPlayer2HandSelected" id="table_container" class="border-2 border-myBeige bg-myBlack w-[95%] h-[100%] m-auto grid grid-rows-[25%_35%_40%]">
      
        <div id="manaZone_container" class="w-[55%] h-[100%] flex flex-row flex-nowrap m-auto">

            <Mana player = "player2" />

        </div>

        <div id="middleZone_container" class="grid grid-cols-[15%_70%_15%]">

            <Graveyard player = 'player2' />

            <Shields player = 'player2' />

            <Deck :clickable = state.matches(turnText) player = 'player2' />

        </div>

        <BattleZone :state = state :send = send player = 'player2' />

        <button v-if="state.matches('player2Turn')" class="absolute bg-myBeige text-myBlack font-bold rounded w-min px-4 top-28 right-24" @click="send('TOGGLE_HAND_VISIBILITY');">
            HAND
        </button>

        <button v-if="state.matches('player2Turn')" class="absolute bg-myBeige text-myBlack font-bold rounded px-4 top-28 left-24" @click="send('END_TURN')">
          END TURN
        </button>

    </div>

    <div v-else id="hand_container" class="border-2 border-myBeige bg-myBlack w-[1500px] h-[100%] m-auto">

        <Hand player = "player2" :send = send :state = state />

    </div>

</template>



<style scoped>

</style>