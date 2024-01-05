<script setup>
import { ref } from 'vue';
import router from '../router';
import { useUserStore } from '../stores/userStore';

const userStore = useUserStore();

const lastSelectedPageIndex = ref(-1);

function goToMyCollection() {
    lastSelectedPageIndex.value = 0;
    router.push("/myCollection");
}

function goToAddCard() {
    lastSelectedPageIndex.value = 1;
    router.push("/addCard");
}

function goToAllCards() {
    lastSelectedPageIndex.value = 2;
    router.push("/cardCollection");
}

function goToCombineCards() {
    lastSelectedPageIndex.value = 3;
    router.push("/combineCards");
}

function goToShop() { 
    lastSelectedPageIndex.value = 4;
    router.push("/packs");
}

function goToMatch() { 
    lastSelectedPageIndex.value = 5;
    router.push("/match");
}

function goToMatchAI() { 
    lastSelectedPageIndex.value = 6;
    router.push("/matchAI");
}

function goToHome() { router.push("/"); }

</script>



<template>
    
    <div class="
          relative w-screen h-[10%] bg-myDarkBlue grid grid-cols-[30%_15%_10%_15%_30%]
          place-items-center text-myGold2 border-b-4 border-myGold2 ">
        <div class="w-[100%] grid grid-cols-4 gap-2">
            <p class="min-w-min p-2 transition duration-1000 ease-in-out
                hover:scale-110 hover:bg-myGold2 hover:text-myBlack text-myGold2 cursor-pointer rounded"
                @click="goToMyCollection">
                My Collection
            </p>
            <p class="min-w-min p-2 transition duration-1000 ease-in-out
                hover:scale-110 hover:bg-myGold2 hover:text-myBlack text-myGold2 cursor-pointer rounded"
                @click="goToAddCard">
                Add Card
            </p>
            <p class="min-w-min p-2 transition duration-1000 ease-in-out
                hover:scale-110 hover:bg-myGold2 hover:text-myBlack text-myGold2 cursor-pointer rounded"
                @click="goToAllCards">
                All Cards
            </p>
            <p class="min-w-min p-2 transition duration-1000 ease-in-out
                hover:scale-110 hover:bg-myGold2 hover:text-myBlack text-myGold2 cursor-pointer rounded"
                @click="goToCombineCards">
                Combine
            </p>
        </div>
        <div class="w-[100%]">
            <p class="float-right min-w-min">
                {{ userStore.name }}
            </p>
        </div>
        <div class="grid place-items-center">
            <img src="../assets/avatar.jpg" class="absolute w-[5%] rounded-full border-4 border-myGold2 cursor-pointer" @click="goToHome()" />
        </div>
        <div class="w-[100%]">
            <p class="float-left min-w-min">
                {{ userStore.money }}
            </p>
            <div class="w-48">
                <img src="../assets/money.png" class="w-[15%] h-[50%]" />
            </div>
        </div>
        <div class="w-[100%] grid grid-cols-4 gap-2">

            <p class="min-w-min p-2 transition duration-1000 ease-in-out
                hover:scale-110 hover:bg-myGold2 hover:text-myBlack text-myGold2 cursor-pointer rounded"
                @click="goToShop()">
                SHOP
            </p>

            <p class="min-w-min p-2 transition duration-1000 ease-in-out
                hover:scale-110 hover:bg-myGold2 hover:text-myBlack text-myGold2 cursor-pointer rounded"
                @click="goToMatch()">
                PLAYER MATCH
            </p>

            <p class="min-w-min p-2 transition duration-1000 ease-in-out
                hover:scale-110 hover:bg-myGold2 hover:text-myBlack text-myGold2 cursor-pointer rounded"
                @click="goToMatchAI()">
                AI MATCH
            </p>
        </div>
    </div>

</template>


<style scoped>

</style>