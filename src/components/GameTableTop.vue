<script setup>
import Hand from './Hand.vue';
import TableVariant from './TableVariant.vue';

const props = defineProps({
    state: Object,
    send: Object,
    service: Object
});

const hand_container_style = "border-2 border-myBeige bg-myBlack w-[1500px] h-[100%] m-auto";
const limited_table_variant_style = "border-2 border-myBeige bg-myLimited w-[95%] h-[100%] m-auto grid grid-rows-[25%_35%_40%]";
const full_control_table_variant_style = "border-2 border-myBeige bg-myBlack w-[95%] h-[100%] m-auto grid grid-rows-[25%_35%_40%]";

</script>


<template>

    <div v-if="state.matches('player2Hand')" id="hand_container" :class = hand_container_style>
        <Hand player = "player2" :send = send :state = state />
    </div>

    <div v-else-if="state.matches('player1TurnLimited') || state.matches('player2TurnLimited')" :class = limited_table_variant_style>
        <TableVariant player="player2" :state = state :send = send :limited = true />
    </div>

    <div v-else-if="state.matches('player2Turn')" :class = full_control_table_variant_style>
        <TableVariant player="player2" :state = state :send = send />
    </div>
    <div v-else :class = full_control_table_variant_style>
        <TableVariant player="player2" :state = state :send = send />
    </div>

</template>



<style scoped>

</style>