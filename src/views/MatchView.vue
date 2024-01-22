<script setup>
import { ref } from "@vue/reactivity";
import Header from "../components/Header.vue";
import { useMatchStore } from "../stores/matchStore";
import matchMachine from '../machines/matchMachine';
import { useMachine } from '@xstate/vue';
import { watch } from "vue";
import PlayerTable from "../components/Match/PlayerTable.vue";
import { onBeforeRouteLeave } from "vue-router";
import { useImageStore } from "../stores/imageStore";

const imageStore = useImageStore();

const matchStore = useMatchStore();
matchStore.init(false);

const {state, send, service} = useMachine(matchMachine);

const isGameLogOpen = ref(false)

function endTurn() {
    let matchStore = useMatchStore();
    if(matchStore.usingAI == true) {
        matchStore.newAITurn(props.service);
    }
    service.send('END_TURN');
}


watch(() => matchStore.ct, () => {
    if (matchStore.ct === 15) {
        matchStore.isDataLoaded = true;
    }
})

onBeforeRouteLeave(() => {
    console.log("OUT!");
    matchStore.ct = 0;
    matchStore.isDataLoaded = false;

    imageStore.$reset();
    matchStore.$reset();
})

</script>


<template>
    <Header></Header>
    <div v-if="matchStore.isDataLoaded" id="page" class="bg-background1 w-screen h-[90%] grid grid-rows-[47%_5%_47%]">

        <div id="opponent_container" class="w-full">
            <PlayerTable player = "player2" :state = state :send = send :service = service />
        </div>

        <div id="turn_indicator_container" class="w-full h-full grid place-items-center">
            <button class="bg-myGold3 text-myBlack font-bold rounded px-8" @click="endTurn()">
                END TURN
            </button>
        </div>

        <div id="my_container" class="w-full">
            <PlayerTable player = "player1" :state = state :send = send :service = service />
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
  <div v-else class="w-full h-[90%] grid place-items-center bg-background1">
    <div>
        <img src="../assets/dragon_gold.gif" class="">
        <p class="text-3xl text-myGold3 font-bold font-fantasy mt-[-7%]">Initializing match...</p>
    </div>
  </div>
</template>




<style scoped>

</style>