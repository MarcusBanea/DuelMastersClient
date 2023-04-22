<script setup>
import { ref } from "@vue/reactivity";
import Header from "../components/Header.vue";
import { useMatchStore } from "../stores/matchStore";
import matchMachine from '../machines/matchMachine';
import { useMachine } from '@xstate/vue';
import { watch } from "vue";
import PlayerTable from "../components/Match/PlayerTable.vue";

const matchStore = useMatchStore();
matchStore.init();

const {state, send, service} = useMachine(matchMachine);

const isGameLogOpen = ref(false)

watch(state, (newValue) => {
    console.log("Total = " + newValue.context.numberOfCardsToBeSelected);
});

</script>


<template>
    <Header></Header>
    <div v-if="matchStore.isDataLoaded" id="page" class="bg-myLightBlue w-screen h-[90%] grid grid-rows-[47%_5%_47%]">

        <div id="opponent_container" class="w-full">
            <PlayerTable player = "player2" :state = state :send = send />
        </div>

        <div id="turn_indicator_container">
            <p class="text-myBeige h-[100%] text-2xl">
                TURN - {{ state.value }}
            </p>
        </div>

        <div id="my_container" class="w-full">
            <PlayerTable player = "player1" :state = state :send = send />
        </div>

        <div class="w-[5%] h-max bg-myBlack border-myBeige border-2 absolute right-0 cursor-pointer z-10">
            <p class="text-myBeige" @click="isGameLogOpen = !isGameLogOpen">
                GAMELOG
            </p>
        </div>

        <div v-if="isGameLogOpen" class="w-[25%] h-[90%] bg-myBlack border-myBeige border-2 absolute right-0 grid grid-rows-[10%_90%]">
            <div id="gameLogTitle">
                <p class="text-myBeige">TIMELINE</p>
            </div>

            <div id="timeline">
                <p v-for="moment in matchStore.gamelog" :key="moment" class="text-myBeige">
                    {{ moment }}
                </p>
            </div>
        </div>

  </div>
</template>




<style scoped>

</style>