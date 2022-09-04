<script setup>
import { computed } from '@vue/runtime-core';
import ImageContainer from '../components/ImageContainer.vue';

const response = await fetch("/api/cards");
const cards = await response.json();


const getCardImage = computed(() => {
    return cards[0].image;
});

</script>



<template>
    
    <div class="bg-myDarkGreen h-full grid grid-cols-2 col-gap-2">
        <div class="bg-myBlack text-white font-bold grid place-items-center h-screen">
            {{cards[0].name}}
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