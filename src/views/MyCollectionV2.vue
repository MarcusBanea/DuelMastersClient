<script setup>
import { ref } from "@vue/reactivity";
import ImageContainerV2 from "../components/ImageContainerV2.vue";
import Header from "../components/Header.vue";
import CardService from "../services/CardService";

//collection
const userId = "633f18459af2fa78268b91d4";
const responseCollection = await CardService.getAllCardsInUserCollection("Markus");
const collection = ref(await responseCollection.data);

const isCardSelected = ref(false);
const selectedCardName = ref();

function selectCard(cardName) {
    isCardSelected.value = true;
    selectedCardName.value = cardName;
}

function getCardAbilities(card) {
    let abilities = [];
    if(card.ability != null) {
        for(let i  = 0; i < card.ability.length; i++) {
            abilities.push(card.ability[i]);
        }
    }
    if(card.attackProperty != null) {
        for(let i  = 0; i < card.attackProperty.length; i++) {
            abilities.push(card.attackProperty[i]);
        }
    }
    if(card.blockProperty != null) {
        for(let i  = 0; i < card.blockProperty.length; i++) {
            abilities.push(card.blockProperty[i]);
        }
    }
    if(card.placement != null) {
        for(let i  = 0; i < card.placement.length; i++) {
            abilities.push(card.placement[i]);
        }
    }
    if(card.endOfTurn != null) {
        for(let i  = 0; i < card.endOfTurn.length; i++) {
            abilities.push(card.endOfTurn[i]);
        }
    }
    if(card.addedPower != null) {
        for(let i  = 0; i < card.addedPower.length; i++) {
            abilities.push(card.addedPower[i]);
        }
    }
    return abilities;
}


</script>

<template>
    <Header></Header>
    <div id="page" class="bg-background1 w-screen h-[90%] grid place-items-center">
        <div id="collection" class="grid place-items-center w-[95%] h-[90%] bg-frame1 bg-[length:100%_100%]">

            <div v-if="!isCardSelected" class="grid h-[60%] w-[80%] backdrop-blur-sm">

                <div class="grid h-[470px] overflow-scroll overflow-x-hidden scroll-smooth">
                    <table class="h-[470px]">
                        <thead class="">
                            <tr class="text-myGold2 italic">
                                <th class="border-t-0 border-b-2 border-r-2 border-myGold p-2 w-[24%]">NAME</th>
                                <th class="border-t-0 border-b-2 border-r-2 border-myGold p-2 w-[9%]">REALM</th>
                                <th class="border-t-0 border-b-2 border-r-2 border-myGold p-2 w-[14%]">CLASS</th>
                                <th class="border-t-0 border-b-2 border-r-2 border-myGold p-2 w-[5%]">POWER</th>
                                <th class="border-t-0 border-b-2 border-r-2 border-myGold p-2 w-[3%]">MANA</th>
                                <th class="border-t-0 border-b-2 border-r-2 border-myGold p-2 w-[45%]">ABILITY</th>
                            </tr>
                        </thead>
                        <tbody class="">
                            <tr class="text-myGold2" v-for="(card) in collection">
                                <td class="border-t-0 border-b-2 border-r-2 border-myGold hover:cursor-pointer
                                transition duration-1000 ease-in-out hover:bg-myGold2 hover:text-myBlack" @click="selectCard(card.name)">{{ card.name }}</td>
                                <td class="border-t-0 border-b-2 border-r-2 border-myGold">{{ card.realm }}</td>
                                <td class="border-t-0 border-b-2 border-r-2 border-myGold">{{ card.cardClass }}</td>
                                <td class="border-t-0 border-b-2 border-r-2 border-myGold">{{ card.power }}</td>
                                <td class="border-t-0 border-b-2 border-r-2 border-myGold">{{ card.mana }}</td>
                                <td class="border-t-0 border-b-2 border-r-2 border-myGold">
                                    <ul>
                                       <li v-for="ability in getCardAbilities(card)">{{ ability }}</li> 
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>

            <div v-else class="grid grid-cols-[70%_30%] h-[60%] w-[80%] backdrop-blur-sm">

                <div class="grid h-[470px] overflow-scroll overflow-x-hidden scroll-smooth">
                    <table class="table-fixed">
                        <thead class="">
                            <tr class="text-myGold2 italic">
                                <th class="border-t-0 border-b-2 border-r-2 border-myGold p-2">NAME</th>
                                <th class="border-t-0 border-b-2 border-r-2 border-myGold p-2">REALM</th>
                                <th class="border-t-0 border-b-2 border-r-2 border-myGold p-2">CLASS</th>
                            </tr>
                        </thead>
                        <tbody class="">
                            <tr class="text-myGold2" v-for="(card) in collection">
                                <td class="border-t-0 border-b-2 border-r-2 border-myGold hover:cursor-pointer
                                transition duration-1000 ease-in-out hover:bg-myGold2 hover:text-myBlack" @click="selectCard(card.name)">{{ card.name }}</td>
                                <td class="border-t-0 border-b-2 border-r-2 border-myGold">{{ card.realm }}</td>
                                <td class="border-t-0 border-b-2 border-r-2 border-myGold">{{ card.cardClass }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="grid place-items-center h-[470px]">
                    <ImageContainerV2 :key="selectedCardName" :card-name="selectedCardName" container-height="80%" container-width="60%" image-border-radius="5%"
                    @click="isCardSelected = false"/>
                </div>

            </div>
        </div>
    </div>
</template>
