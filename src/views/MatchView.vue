<script setup>
import { ref } from "@vue/reactivity";
import Header from "../components/Header.vue";
import GameTableBottom from "../components/GameTableBottom.vue";
import GameTableTop from "../components/PlayerTable.vue";
import utils from "@/Utils";
import { useMatchStore } from "../stores/matchStore";
import matchMachine from '../machines/matchMachine';
import { useMachine } from '@xstate/vue';
import { computed, onMounted, watch } from "vue";
import { interpret } from "xstate";
import PlayerTable from "../components/PlayerTable.vue";

const matchStore = useMatchStore();
matchStore.init();

const {state, send, service} = useMachine(matchMachine);

const isGameLogOpen = ref(false)
//game log contains array of strings, representing the match timeline
const gameLog = ref([]);

const player1Component = ref(null);
const player2Component = ref(null);

const hasPlayer1SelectedCard = ref(false);
const hasPlayer2SelectedCard = ref(false);

const player1SelectedCardIndex = ref(-1);
const player2SelectedCardIndex = ref(-1);

async function addMomentToGameLog(event, moment) {
    let newMoment = utils.getCurrentTime() + " : " + moment;
    gameLog.value.push(newMoment);

    let currentPlayer = state.matches('player1Turn') ? "player1" : "player2";
    await fetch("/api/game/action/" + moment + "/" + currentPlayer);
}

watch(state, (newValue) => {
    console.log("Total = " + newValue.context.numberOfCardsToBeSelected);
});


</script>



<template>
    <Header></Header>
    <div v-if="matchStore.isDataLoaded" id="page" class="bg-myLightBlue w-screen h-[90%] grid grid-rows-[47%_5%_47%]">

        <div id="opponent_container" class="w-full">

            <PlayerTable ref="player2Component" 
                player = "player2"
                :state = state
                :send = send
            />

        </div>

        <div id="turn_indicator_container">
            <p class="text-myBeige h-[100%] text-2xl">
                TURN - {{ state.value }}
            </p>
        </div>

        <div id="my_container" class="w-full">

            <PlayerTable ref="player1Component"
                player = "player1"
                :state = state
                :send = send

            />

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