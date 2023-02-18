<script setup>
import { ref } from "@vue/reactivity";
import ImageContainer from "../components/ImageContainer.vue";
import ImageRevealOnClick from "../components/ImageRevealOnClick.vue";
import Header from "../components/Header.vue";
import PackBlock from "../components/PackBlock.vue";
import { computed } from "@vue/runtime-core";
import CardBlock from "../components/CardBlock.vue";
import ImageContainerV2 from "../components/ImageContainerV2.vue";
import CardHandBlock from "../components/CardHandBlock.vue";
import GameTableBottom from "../components/GameTableBottom.vue";
import GameTableTop from "../components/GameTableTop.vue";

//current user
const responseUser = await fetch("/api/users/633f18459af2fa78268b91d4");
const user = ref(await responseUser.json());

const userId = "633f18459af2fa78268b91d4";
//get players details
const responsePlayers = await fetch("/api/game/initialize/" + userId + "/" + userId);
const players = ref(await responsePlayers.json());

const turn = ref("BOTTOM");
const canBottomSendToMana = ref(true);
const canTopSendToMana = ref(false);

const isGameLogOpen = ref(false)
//game log contains array of strings, representing the game timeline
const gameLog = ref([]);

async function changeTurn() {
    turn.value = turn.value == "BOTTOM" ? "TOP" : "BOTTOM";
    canBottomSendToMana.value = !canBottomSendToMana.value;
    canTopSendToMana.value = !canTopSendToMana.value;
    const test = await fetch("/api/game/test");
}

const isBottomSelectable = computed(() => {
    return turn.value == "BOTTOM" ? true : false;
});

const isTopSelectable = computed(() => {
    return turn.value == "TOP" ? true : false;
});

function toggleGameLog() {
    isGameLogOpen.value = !isGameLogOpen.value;
}

function getCurrentTime() {
    var currentdate = new Date(); 
    var currentDateTime = currentdate.getDate() + "/"
                + (currentdate.getMonth() + 1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    return currentDateTime;
}

async function addMomentToGameLog(moment) {
    console.log(moment);
    let newMoment = getCurrentTime() + " : " + moment;
    gameLog.value.push(newMoment);

    let currentPlayer = turn.value == "BOTTOM" ? "player1" : "player2";
    await fetch("/api/game/action/" + moment + "/" + currentPlayer);
}

const player1SelectedCard = ref(false);

function showAttackingOptions() {
    //for now, every card/shield can be attacked by any card (be it blocker or not)
    //so, every card in the battle zone and shield will be highlighted
    player1SelectedCard.value = !player1SelectedCard.value;
}

</script>



<template>
    <Header :money="user.money" :nickname="user.nickname" ></Header>
    <div id="page" class="bg-myLightBlue w-screen h-[90%] grid grid-rows-[47%_5%_47%]">

        <div id="opponent_container" class="w-full">

            <GameTableTop :selectable="isTopSelectable" :can-send-to-mana-prop="canTopSendToMana" :player="players[1]"
                :opponent-is-attacking="player1SelectedCard"
                @end-of-turn="changeTurn()" 
                @draw-card-event="addMomentToGameLog('Draw card')"
                @select-card="showAttackingOptions(index)"

            />

        </div>


        <div id="turn_indicator_container">
            <p class="text-myBeige h-[100%] text-2xl">
                TURN - {{turn}}
            </p>
        </div>


        <div id="my_container" class="w-full">

            <GameTableBottom :selectable="isBottomSelectable" :can-send-to-mana-prop="canBottomSendToMana" :player="players[0]"
                @end-of-turn="changeTurn()" 
                @draw-card-event="addMomentToGameLog('Draw card')"
                @select-card="showAttackingOptions(index)"
            />

        </div>

        <div class="w-[5%] h-max bg-myBlack border-myBeige border-2 absolute right-0 cursor-pointer z-10">
            <p class="text-myBeige" @click="toggleGameLog()">
                GAMELOG
            </p>
        </div>

        <div v-if="isGameLogOpen" class="w-[25%] h-[90%] bg-myBlack border-myBeige border-2 absolute right-0 grid grid-rows-[10%_90%]">
            <div id="gameLogTitle">
                <p class="text-myBeige">TIMELINE</p>
            </div>

            <div id="timeline">
                <p v-for="moment in gameLog" :key="moment" class="text-myBeige">
                    {{ moment }}
                </p>
            </div>
        </div>


  </div>
</template>




<style scoped>

</style>