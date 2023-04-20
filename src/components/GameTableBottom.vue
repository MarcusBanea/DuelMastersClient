<script setup>
import Hand from './Hand.vue';
import { useMatchStore } from '../stores/matchStore';
import TableVariant from './TableVariant.vue';

const props = defineProps({
    opponentIsAttacking: Boolean,
    state: Object,
    send: Object,
    service: Object
});

const matchStore = useMatchStore();

const turnText = 'player1Turn';

const hand_container_style = "border-2 border-myBeige bg-myBlack w-[1500px] h-[100%] m-auto";
const limited_table_variant_style = "border-2 border-myBeige bg-myLimited w-[95%] h-[100%] m-auto grid grid-rows-[40%_35%_25%]";
const full_control_table_variant_style = "border-2 border-myBeige bg-myBlack w-[95%] h-[100%] m-auto grid grid-rows-[40%_35%_25%]";

</script>


<template>

    <div v-if="state.matches('player1Hand')" id="hand_container" :class = hand_container_style>
        <Hand player = "player1" :send = send :state = state />
    </div>

    <div v-else-if="state.matches('player1TurnLimited')" :class = limited_table_variant_style>
        <TableVariant player="player1" :state = state :send = send :limited = true />
    </div>

    <div v-else :class = full_control_table_variant_style>
        <TableVariant player="player1" :state = state :send = send />
    </div>

</template>



<style scoped>

</style>