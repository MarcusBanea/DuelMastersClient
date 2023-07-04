<script setup>
import { ref } from "@vue/reactivity";
import ImageContainerV2 from "../components/ImageContainerV2.vue";
import Header from "../components/Header.vue";

//collection
const userId = "633f18459af2fa78268b91d4";
const responseCollection = await fetch("/api/users/getCollection/" + userId);
const collection = ref(await responseCollection.json());

</script>

<template>
    <Header></Header>
    <div id="page" class="bg-myDarkGreen w-screen h-[90%] grid place-items-center overflow-scroll overflow-x-hidden">
        <div id="collection" class="grid grid-cols-2 gap-24 bg-myBlack w-[90%] mt-[2%] border-4 border-myLightGray">
            <div id="card-container" v-for="card in collection" :key="card" class="grid grid-cols-[50%_50%] h-[500px] place-items-center bg-myDarkGray m-[5%] rounded-lg" >
                <ImageContainerV2 :image-id="card.imageId" container-height="80%" image-border-radius="5%"/>
                <div id="card-details" class="bg-myBlack w-[95%] rounded-lg border-2 border-myLightGray">
                    <p class="text-gray-100 text-2xl">Total:</p>
                    <p class="text-gray-100 text-7xl">{{card.numberOfCards}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
