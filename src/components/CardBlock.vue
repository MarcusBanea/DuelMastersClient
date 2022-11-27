<script setup>
import ImageContainer from './ImageContainer.vue';
import ImageRevealOnClick from './ImageRevealOnClick.vue';

const props = defineProps({
    image: String
});


</script>



<template>
    
    <div id="card_container" class="w-[450px] h-[90%] m-auto grid flex-none border-r-2">
          
          <div id="card_image_container" class="m-auto w-[90%] h-[100%] border-b-2">

            <div id="card_image" class="m-auto w-[75%] h-[90%] border-2">
              
                <ImageRevealOnClick :image-id="image" container-width="100%" :flip-animation-on="true"/>

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