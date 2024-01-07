<script setup>
import ImageContainerV2 from './ImageContainerV2.vue';
import { ref } from "@vue/reactivity";

const props = defineProps({
    cardId: String
});

const selected = ref(false);

</script>



<template>
    
    <div id="card_container" class="w-[450px] h-[100%] m-auto grid flex-none select-none">
          
        <div v-if="selected" id="card_image_container" class="m-auto w-[90%] h-[100%] transition duration-1000 ease-in-out bg-gradient-to-b via-myGold2 from-current to-current"
        @click="selected = !selected">

            <div id="card_image" class="grid m-auto w-[70%] h-[100%]">

                <ImageContainerV2 :card-id="props.cardId" container-width="100%" container-height="70%"/>

            </div>

        </div>

        <div v-else id="card_image_container" class="m-auto w-[90%] h-[100%]" @click="selected = !selected">

            <div id="card_image" class="grid m-auto w-[70%] h-[100%]">

                <ImageContainerV2 :card-id="props.cardId" container-width="100%" container-height="70%"/>

            </div>

        </div>

    </div>

</template>




<style scoped>

#pack_info_details_text::-webkit-scrollbar {
    display: none
}

#pack_info_details_text {
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;  /* Firefox */
    overflow-y: scroll;
}

</style>