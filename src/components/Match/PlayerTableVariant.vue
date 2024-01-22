<script setup>
import { computed, ref, watch} from '@vue/runtime-core';
import { useLimitedStore } from '../../stores/limitedStore';
import BattleZone from './Zones/BattleZone.vue';
import Mana from './Zones/Mana.vue';
import Shields from './Zones/Shields.vue';
import Deck from './Zones/Deck.vue';
import Graveyard from './Zones/Graveyard.vue';
import { useMatchStore } from '../../stores/matchStore';


const props = defineProps({
    player: String,
    state: Object,
    send: Function,
    service: Object,

    limited: Boolean
});

const limitedStore = useLimitedStore();

const middleZone_container_style = "grid grid-cols-[15%_70%_15%]";
const manaZone_container_style = "w-[55%] h-[100%] flex flex-row flex-nowrap m-auto";

const end_turn_button_style = computed(() => {
    let style = "absolute bg-myGold3 text-myBlack font-bold rounded px-4";
    if(props.player === 'player1') {
        style += " bottom-8 left-24";
    }
    else {
        style += " top-28 left-24";
    }
    return style;
});
const limited_turn_button_style = computed(() => {
    let style = "absolute bg-myGold3 text-myBlack font-bold rounded px-4";
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
        
    <BattleZone v-if="player === 'player1'" :state = state :send = send 
        :player = player :limited = limited :service = service />

    <div v-else :class = manaZone_container_style>
        <Mana :player = player :limited = limited />
    </div>

    <div id="middleZone_container" :class = middleZone_container_style>

        <div></div>
        <!-- <Graveyard :player = player @click="(service.state.matches(player + 'Turn') || service.state.matches(player + 'TurnLimited')) && service.send('SHOW_GRAVEYARD')"/> -->

        <Shields :player = player :limited = limited :service = service />

        <Deck :player = player :state = state />

    </div>

    <BattleZone v-if="player === 'player2'" :state = state :send = send :player = player :limited = limited :service = service />

    <div v-else :class = manaZone_container_style>
        <Mana :player = player :limited = limited />
    </div>

    <button v-if="service.state.matches(player + 'TurnLimited') && limitedStore.isExecuteEnabled && !limitedStore.blockerSelection" :class = end_turn_button_style 
        @click="limitedStore.executeLimitedAction(service, state); isExecuteActionButtonVisible = false;">
        EXECUTE
    </button>

    <button v-if="service.state.matches(player + 'TurnLimited') && limitedStore.blockerSelection" :class = end_turn_button_style 
        @click="limitedStore.chooseBlocker(service) ">
        <p v-if="limitedStore.isExecuteEnabled">
            CHOOSE
        </p>
        <p v-else>
            NO BLOCK
        </p>
       
    </button>

</template>