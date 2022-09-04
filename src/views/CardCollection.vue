<script setup>
import { computed, ref } from '@vue/runtime-core';
import ImageContainer from '../components/ImageContainer.vue';

const response = await fetch("/api/cards");
const cards = await response.json();

const currentCardIndex = ref(0);

const getCardImage = computed(() => {
    return cards[currentCardIndex.value].image;
});

</script>


<template>
    
    <div class="bg-myDarkGreen h-full grid grid-cols-2 col-gap-2">
        <div class="bg-myBlack text-white font-bold grid place-items-center h-screen">
            <ul>
                <li class="cursor-pointer mb-2 transition duration-1000 ease-in-out hover:scale-110 hover:bg-gray-100 hover:text-myBlack" v-for="(card, index) in cards" :key="card" @click="currentCardIndex = index">
                    {{card.name}}
                </li>
            </ul>
        </div>


        <div class="grid place-items-center h-screen">
            <div class="grid place-items-center shadow-md rounded px-8 pt-6 pb-8 m-4">
                <ImageContainer container-width="50%" :image-url="getCardImage"/>
            </div>
        </div>
    </div>

</template>




<style scoped>


</style>