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

//current user
const responseUser = await fetch("/api/users/633f18459af2fa78268b91d4");
const user = ref(await responseUser.json());

//your deck
//TODO
//using collection as of now
const userId = "633f18459af2fa78268b91d4";
const responseCollection = await fetch("/api/users/getCollectionV2/" + userId);
const collection = ref(await responseCollection.json());

const responseDeck = await fetch("/api/users/getRandomDeckWithGameCards/" + userId);
const deck = ref(await responseDeck.json());

const cardsInBattleZone = ref([]);
const cardsInMana = ref([]);


const isHandSelected = ref(false);

const myNumberOfShields = ref(5);

const myNumberOfCardsInBattleZone = ref(0);


function showHand() {
    isHandSelected.value = !isHandSelected.value;
}

function sendCardFromHandToMana(index) {
    showHand();
    cardsInMana.value.push(deck.value[index]);
    deck.value.splice(index, 1);
}

function sendCardFromHandToBattleZone(index) {
    showHand();
    cardsInBattleZone.value.push(deck.value[index]);
    deck.value.splice(index, 1);
}

</script>



<template>
    <Header :money="user.money" :nickname="user.nickname" ></Header>
    <div id="page" class="bg-myLightBlue w-screen h-[90%] grid grid-rows-[47%_5%_47%]">

        <div id="opponent_container" class="w-full">

            <div id="opponent_table_container" class="border-2 border-myBeige border-t-0 bg-myBlack w-[95%] h-[100%] m-auto grid grid-cols-4">
      

            </div>

        </div>




        <div id="turn_indicator_container">
            <p class="text-myBeige h-[100%] text-2xl">
                TURN - YOU
            </p>
        </div>





        <div id="my_container" class="w-full">

            <div v-if="!isHandSelected" id="my_table_container" class="border-2 border-myBeige bg-myBlack w-[95%] h-[100%] m-auto grid grid-rows-[40%_35%_25%]">
      
                <div id="my_battleZone_container" class="w-[100%] h-[100%] flex flex-row justify-evenly">

                    <div v-for="card in cardsInBattleZone" :key="card" class="w-[100px] h-[100px]">
                        <ImageContainerV2 :image="card.image" container-width="110%"/>
                    </div>

                </div>

                <div id="my_middleZone_container" class="grid grid-cols-[15%_70%_15%]">

                    <div id="my_graveyard_container" class="w-[100%] h-[100%]">

                    </div>

                    <div id="my_shields_container" class="w-[70%] h-[90%] border-2 border-myBeige m-auto flex flex-row justify-between">
                        
                        <div v-for="index in myNumberOfShields" :key="index">

                            <img src="../assets/Shield.jpg" class="h-28"/>

                        </div>

                    </div>

                    <div id="my_deck_container" class="w-[100%] h-[100%]">
                        
                    </div>

                </div>

                <div id="my_manaZone_container" class="w-[55%] h-[100%] flex flex-row flex-nowrap m-auto">

                    <div v-for="card in cardsInMana" :key="card" class="w-[100px] h-[100px]">
                        <ImageContainerV2 :image="card.image" container-width="70%" rotate="-0.25turn"/>
                    </div>

                </div>

                <button class="absolute bg-myBeige text-myBlack font-bold rounded w-min px-4 bottom-8 right-24" @click="showHand()">
                    HAND
                </button>

            </div>

            <div v-else id="my_hand_container" class="border-2 border-myBeige bg-myBlack w-[1500px] h-[100%] m-auto">

                <div class="w-full h-full flex flex-row flex-nowrap overflow-x-auto">

                    <CardHandBlock v-for="(card, index) in deck" :key="card" :image="card.image" :index="index"
                    @send-to-mana="sendCardFromHandToMana($event, index)"
                    @send-to-battle-zone="sendCardFromHandToBattleZone($event, index)"
                    />

                </div>


                <button class="absolute bg-myBeige text-myBlack font-bold rounded w-min px-4 bottom-8 right-24" @click="showHand()">
                    HAND
                </button>

            </div>

        </div>


  </div>
</template>




<style scoped>

</style>