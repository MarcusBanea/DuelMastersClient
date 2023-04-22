<script setup>
import { computed } from 'vue';
import { useLimitedStore } from '../../stores/limitedStore';
import BattleZone from './Zones/BattleZone.vue';
import Mana from './Zones/Mana.vue';
import Shields from './Zones/Shields.vue';
import Deck from './Zones/Deck.vue';
import Graveyard from './Zones/Graveyard.vue';


const props = defineProps({
    player: String,
    state: Object,
    send: Object,

    limited: Boolean
});

const limitedStore = useLimitedStore();

const middleZone_container_style = "grid grid-cols-[15%_70%_15%]";
const manaZone_container_style = "w-[55%] h-[100%] flex flex-row flex-nowrap m-auto";

const hand_button_style = computed(() => {
    let style = "absolute bg-myBeige text-myBlack font-bold rounded w-min px-4";
    if(props.player === 'player1') {
        style += " bottom-8 right-24";
    }
    else {
        style += " top-28 right-24";
    }
    return style;
});
const end_turn_button_style = computed(() => {
    let style = "absolute bg-myBeige text-myBlack font-bold rounded px-4";
    if(props.player === 'player1') {
        style += " bottom-8 left-24";
    }
    else {
        style += " top-28 left-24";
    }
    return style;
});
const limited_turn_button_style = computed(() => {
    let style = "absolute bg-myBeige text-myBlack font-bold rounded px-4";
    if(props.player === 'player1') {
        style += " bottom-16 left-24";
    }
    else {
        style += " top-36 left-24";
    }
    return style;
});

</script>



<template>
        
    <BattleZone v-if="player === 'player1'" :state = state :send = send :player = player :limited = limited />

    <div v-else :class = manaZone_container_style>
        <Mana :player = player :limited = limited />
    </div>

    <div id="middleZone_container" :class = middleZone_container_style>

        <Graveyard :player = player />

        <Shields :player = player :limited = limited />

        <Deck :clickable = state.matches(turnText) :player = player />

    </div>

    <BattleZone v-if="player === 'player2'" :state = state :send = send :player = player :limited = limited />

    <div v-else :class = manaZone_container_style>
        <Mana :player = player :limited = limited />
    </div>

    <button v-if="state.matches(player + 'Turn') || state.matches(player + 'TurnLimited')" :class = hand_button_style @click="send('SHOW_HAND');">
        HAND
    </button>

    <button v-if="state.matches(player + 'Turn')" :class = end_turn_button_style @click="send('END_TURN')">
        END TURN
    </button>

    <button v-if="state.matches(player + 'Turn')" :class = limited_turn_button_style @click="send('YOUR_TURN_LIMITED')">
        LIMITED
    </button>

    <button v-if="state.matches(player + 'TurnLimited')" :class = limited_turn_button_style @click="send('YOUR_TURN')">
        FULL CONTROL
    </button>

    <button v-if="state.matches(player + 'TurnLimited')" :class = end_turn_button_style @click="limitedStore.executeLimitedAction() ;send('YOUR_TURN')">
        EXECUTE
    </button>

</template>