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
import utils from "@/Utils";

//current user
const responseUser = await fetch("/api/users/633f18459af2fa78268b91d4");
const user = ref(await responseUser.json());

const userId = "633f18459af2fa78268b91d4";
//get players details
const responsePlayers = await fetch("/api/game/initialize/" + userId + "/" + userId);
const players = ref(await responsePlayers.json());

const turn = ref("BOTTOM");

const isGameLogOpen = ref(false)
//game log contains array of strings, representing the match timeline
const gameLog = ref([]);

const player1Component = ref(null);
const player2Component = ref(null);

const hasPlayer1SelectedCard = ref(false);
const hasPlayer2SelectedCard = ref(false);

const player1SelectedCardIndex = ref(-1);
const player2SelectedCardIndex = ref(-1);

async function changeTurn() {
    turn.value = turn.value == "BOTTOM" ? "TOP" : "BOTTOM";
}

const isBottomTurn = computed(() => {
    return turn.value == "BOTTOM" ? true : false;
});

const isTopTurn = computed(() => {
    return turn.value == "TOP" ? true : false;
});

async function addMomentToGameLog(event, moment) {
    let newMoment = utils.getCurrentTime() + " : " + moment;
    gameLog.value.push(newMoment);

    let currentPlayer = turn.value == "BOTTOM" ? "player1" : "player2";
    await fetch("/api/game/action/" + moment + "/" + currentPlayer);
}

function showAttackingOptionsForPlayer1(index) {
    //for now, every card/shield can be attacked by any card (be it blocker or not)
    //so, every card in the battle zone and shield will be highlighted
    player1SelectedCardIndex.value = index;
    hasPlayer1SelectedCard.value = !hasPlayer1SelectedCard.value;
}

function showAttackingOptionsForPlayer2(index) {
    //for now, every card/shield can be attacked by any card (be it blocker or not)
    //so, every card in the battle zone and shield will be highlighted
    player2SelectedCardIndex.value = index;
    hasPlayer2SelectedCard.value = !hasPlayer2SelectedCard.value;
}

async function basicMove(index, move, player) {
    let action = move;
    action += " " + index;
    await fetch("/api/game/action/" + action +  "/" + player)
}

async function attack(index, player) {
    console.log(index);
    console.log(player);
    let action = "Attack ";
    if(player == "player1") {
        //set index of the card that is attacked
        player2SelectedCardIndex.value = index;
        action += player1SelectedCardIndex.value + " " + player2SelectedCardIndex.value;
    }
    else { 
        //set index of the card that is attacked
        player1SelectedCardIndex.value = index;
        action += player2SelectedCardIndex.value + " " + player1SelectedCardIndex.value;
    }
    //inform the server of this action
    const awaitingResponse = await fetch("/api/game/action/" + action + "/" + player);
    let attackResponse = await awaitingResponse.json();

    //perform action provided by server

    //get player1 response
    let player1Response = attackResponse.at(0);
    switch(player1Response) {
        case "" : {
            player1Component.value?.executeAction("");
            break;
        }
        //move player2 last selected card to graveyard
        case "MTG" : {
            player1Component.value?.executeAction("MTG");
            break;
        }
        default : {
            break;
        }
    }

    //get player2 response
    let player2Response = attackResponse.at(1);
    switch(player2Response) {
        case "" : {
            player2Component.value?.executeAction("");
            break;
        }
        //move player2 last selected card to graveyard
        case "MTG" : {
            player2Component.value?.executeAction("MTG");
            break;
        }
        default : {
            break;
        }
    }
}

</script>



<template>
    <Header :money="user.money" :nickname="user.nickname" ></Header>
    <div id="page" class="bg-myLightBlue w-screen h-[90%] grid grid-rows-[47%_5%_47%]">

        <div id="opponent_container" class="w-full">

            <GameTableTop ref="player2Component" :player="players[1]" :its-your-turn="isTopTurn"
                :opponent-is-attacking="hasPlayer1SelectedCard"
                @end-of-turn="changeTurn()" 
                @draw-card-event="addMomentToGameLog($event, 'Draw card')"
                @select-card="showAttackingOptionsForPlayer2($event, index)"
                @opponent-select-card="attack($event, 'player1')"
                @send-card-to-mana="basicMove($event, 'MoveToMana', 'player2')"
                @send-card-to-battle-zone="basicMove($event, 'MoveToBattleZone', 'player2')"
            />

        </div>

        <div id="turn_indicator_container">
            <p class="text-myBeige h-[100%] text-2xl">
                TURN - {{turn}}
            </p>
        </div>

        <div id="my_container" class="w-full">

            <GameTableBottom ref="player1Component" :player="players[0]" :its-your-turn="isBottomTurn"
                :opponent-is-attacking="hasPlayer2SelectedCard" 
                @end-of-turn="changeTurn()" 
                @draw-card-event="addMomentToGameLog($event, 'Draw card')"
                @select-card="showAttackingOptionsForPlayer1($event, index)"
                @opponent-select-card="attack($event, 'player2')"
                @send-card-to-mana="basicMove($event, 'MoveToMana', 'player1')"
                @send-card-to-battle-zone="basicMove($event, 'MoveToBattleZone', 'player1')"
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
                <p v-for="moment in gameLog" :key="moment" class="text-myBeige">
                    {{ moment }}
                </p>
            </div>
        </div>


  </div>
</template>




<style scoped>

</style>