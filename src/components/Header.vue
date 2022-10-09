<script setup>
import router from '../router';


const props = defineProps({
    nickname: String,
    money: String
});

function goToMyCollection() {
    router.push("/myCollection");
}

function goToAddCard() {
    router.push("/addCard");
}

function goToAllCards() {
    router.push("/cardCollection");
}

</script>



<template>
    
    <div class="
          relative
          w-screen
          h-[10%]
          bg-myBlack
          grid
          grid-cols-[20%_25%_10%_45%]
          place-items-center
          text-myLightGray
          border-b-4
        ">
        <div class="w-[100%] grid grid-cols-3 gap-4">
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
        </div>
        <div class="w-[100%]">
            <p class="float-right min-w-min">
                {{ nickname }}
            </p>
        </div>
        <div class="grid place-items-center">
            <img src="../assets/avatar.jpg" class="absolute w-[5%] rounded-full border-4" :title="nickname" />
        </div>
        <div class="w-[100%]">
            <p class="float-left min-w-min">
                {{ money }}
            </p>
            <div class="w-48">
                <img src="../assets/money.png" class="w-[15%] h-[15%]" />
            </div>
        </div>
    </div>

</template>


<style scoped>

</style>