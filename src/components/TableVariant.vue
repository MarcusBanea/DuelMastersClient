<script setup>
import { computed } from 'vue';
import { useMatchStore } from '../stores/matchStore';
import BattleZone from './BattleZone.vue';
import Deck from './Deck.vue';
import Graveyard from './Graveyard.vue';
import Mana from './Mana.vue';
import Shields from './Shields.vue';


const props = defineProps({
    player: String,
    state: Object,
    send: Object,

    limited: Boolean
});

const matchStore = useMatchStore();

const middleZone_container_style = "grid grid-cols-[15%_70%_15%]";
const manaZone_container_style = "w-[55%] h-[100%] flex flex-row flex-nowrap m-auto";
const hand_button_style = "absolute bg-myBeige text-myBlack font-bold rounded w-min px-4 bottom-8 right-24";
const end_turn_button_style = "absolute bg-myBeige text-myBlack font-bold rounded px-4 bottom-8 left-24";
const limited_turn_button_style = "absolute bg-myBeige text-myBlack font-bold rounded px-4 bottom-16 left-24";

</script>



<template>
        
    <BattleZone :state = state :send = send :player = player :limited = limited />

    <div id="middleZone_container" :class = middleZone_container_style>

        <Graveyard :player = player />

        <Shields :player = player :limited = limited />

        <Deck :clickable = state.matches(turnText) :player = player />

    </div>

    <div id="manaZone_container" :class = manaZone_container_style>

        <Mana :player = player :limited = limited />

    </div>

    <button :class = hand_button_style @click="send('SHOW_HAND');">
        HAND
    </button>

    <button v-if="!limited" :class = end_turn_button_style @click="send('END_TURN')">
        END TURN
    </button>

    <button v-if="!limited" :class = limited_turn_button_style @click="send('YOUR_TURN_LIMITED')">
        LIMITED
    </button>

    <button v-if="limited" :class = limited_turn_button_style @click="send('YOUR_TURN')">
        FULL CONTROL
    </button>

    <button v-if="limited" :class = end_turn_button_style @click="matchStore.executeLimitedAction() ;send('YOUR_TURN')">
        EXECUTE
    </button>

</template>