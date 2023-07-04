<script setup>
import { computed } from 'vue';
import PlayerTableVariant from './PlayerTableVariant.vue';
import Hand from './Zones/Hand.vue';
import GraveyardContent from './Zones/GraveyardContent.vue';

const props = defineProps({
    player: String,
    state: Object,
    send: Object,
    service: Object,
});

const hand_container_style = "border-2 border-myBeige bg-myBlack w-[1500px] h-[100%] m-auto";

const limited_table_variant_style = computed(() => {
    let style = "border-2 border-myBeige bg-myLimited w-[95%] h-[100%] m-auto grid";
    if(props.player === 'player1') {
        style += " grid-rows-[40%_35%_25%]";
    }
    else {
        style += " grid-rows-[25%_35%_40%]"
    }
    return style;
}); 
const full_control_table_variant_style = computed(() => {
    let style = "border-2 border-myBeige bg-myBlack w-[95%] h-[100%] m-auto grid";
    if(props.player === 'player1') {
        style += " grid-rows-[40%_35%_25%]";
    }
    else {
        style += " grid-rows-[25%_35%_40%]"
    }
    return style;
});

</script>


<template>

    <div v-if="service.state.matches(player + 'Hand') || state.matches(player + 'HandLimited')" id="hand_container" :class = hand_container_style>
        <Hand :player = player :send = send :state = state :service = service />
    </div>

    <div v-else-if="service.state.matches(player + 'Graveyard') || state.matches(player + 'GraveyardLimited')" id="graveyard_container" :class = hand_container_style>
        <GraveyardContent :player = player :send = send :state = state :service = service />
    </div>

    <div v-else-if="service.state.matches('player1TurnLimited') || state.matches('player2TurnLimited')" :class = limited_table_variant_style>
        <PlayerTableVariant :player = player :state = state :send = send :limited = true :service = service />
    </div>

    <div v-else-if="service.state.matches(player + 'Turn')" :class = full_control_table_variant_style>
        <PlayerTableVariant :player = player :state = state :send = send :service = service />
    </div>
    <div v-else :class = full_control_table_variant_style>
        <PlayerTableVariant :player = player :state = state :send = send :service = service />
    </div>

</template>



<style scoped>

</style>