<script setup>
import { ref } from 'vue';
import router from '../router';
import { useUserStore } from '../stores/userStore';

const userStore = useUserStore();

function goToMyCollection() {
    router.push("/myCollection");
}

function goToAddCard() {
    router.push("/addCard");
}

function goToAllCards() {
    router.push("/cardCollection");
}

function goToShop() {
    router.push("/packs");
}

function goToCombineCards() {
    router.push("/combineCards");
}

function goToMatch() {
    router.push("/match");
}

</script>



<template>
    
    <div class="
          relative
          w-screen
          h-[10%]
          bg-myDarkBlue
          grid
          grid-cols-[20%_25%_10%_45%]
          place-items-center
          text-myLightGray
          border-b-4
          border-myBeige
        ">
        <div class="w-[100%] grid grid-cols-4 gap-2">
            <p class="min-w-min p-2 transition duration-1000 ease-in-out
                hover:scale-110 hover:bg-myLightGray hover:text-myBlack text-myLightGray cursor-pointer rounded"
                @click="goToMyCollection">
                My Collection
            </p>
            <p class="min-w-min p-2 transition duration-1000 ease-in-out
                hover:scale-110 hover:bg-transparent hover:text-myLightGray bg-myLightGray text-myBlack cursor-pointer rounded"
                @click="goToAddCard">
                Add Card
            </p>
            <p class="min-w-min p-2 transition duration-1000 ease-in-out
                hover:scale-110 hover:bg-myLightGray hover:text-myBlack text-myLightGray cursor-pointer rounded"
                @click="goToAllCards">
                All Cards
            </p>
            <p class="min-w-min p-2 transition duration-1000 ease-in-out
                hover:scale-110 hover:bg-myLightGray hover:text-myBlack text-myLightGray cursor-pointer rounded"
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
            <img src="../assets/avatar.jpg" class="absolute w-[5%] rounded-full border-4" :title="nickname" />
        </div>
        <div class="w-[100%] grid grid-cols-[20%_20%_20%]">
            <div>
                <p class="float-left min-w-min">
                    {{ userStore.money }}
                </p>
                <div class="w-48">
                    <img src="../assets/money.png" class="w-[15%] h-[50%]" />
                </div>
            </div>
            

            <button class="bg-myBeige text-myBlack font-bold rounded w-min px-4" @click="goToShop()">
                SHOP
            </button>

            <button class="bg-myBeige text-myBlack font-bold rounded w-min px-4" @click="goToMatch()">
                MATCH
            </button>
        </div>
    </div>

</template>


<style scoped>

</style>