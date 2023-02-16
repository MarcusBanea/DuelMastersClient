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

//your deck
//25 random cards from collection
const userId = "633f18459af2fa78268b91d4";
const responseMatchDeck = await fetch("/api/users/getMatchDeck/" + userId);
const matchDeck = ref(await responseMatchDeck.json());

const turn = ref("BOTTOM");
const canBottomSendToMana = ref(true);
const canTopSendToMana = ref(false);

function changeTurn() {
    turn.value = turn.value == "BOTTOM" ? "TOP" : "BOTTOM";
    canBottomSendToMana.value = !canBottomSendToMana.value;
    canTopSendToMana.value = !canTopSendToMana.value;
}

const isBottomSelectable = computed(() => {
    return turn.value == "BOTTOM" ? true : false;
});

const isTopSelectable = computed(() => {
    return turn.value == "TOP" ? true : false;
});

</script>



<template>
    <Header :money="user.money" :nickname="user.nickname" ></Header>
    <div id="page" class="bg-myLightBlue w-screen h-[90%] grid grid-rows-[47%_5%_47%]">

        <div id="opponent_container" class="w-full">

            <GameTableTop :selectable="isTopSelectable" :can-send-to-mana-prop="canTopSendToMana"
                @end-of-turn="changeTurn()"
            />

        </div>


        <div id="turn_indicator_container">
            <p class="text-myBeige h-[100%] text-2xl">
                TURN - {{turn}}
            </p>
        </div>


        <div id="my_container" class="w-full">

            <GameTableBottom :selectable="isBottomSelectable" :can-send-to-mana-prop="canBottomSendToMana" :deck="matchDeck"
                @end-of-turn="changeTurn()"
            />

        </div>


  </div>
</template>




<style scoped>

</style>