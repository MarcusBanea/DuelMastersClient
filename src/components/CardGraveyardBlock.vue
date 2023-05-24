<script setup>
import { computed, ref } from '@vue/runtime-core';
import { useImageStore } from '../stores/imageStore';
import { useMatchStore } from '../stores/matchStore';

const props = defineProps({
    name: String, 
    index: Number,
    rotate: Boolean,

    service: Object
});

const matchStore = useMatchStore();

const emits = defineEmits(['sendToBattleZone', 'sendToMana']);


const cssProps = computed(() => {
    return {
        '--container-width': props.containerWidth,
        '--container-height': props.containerHeight,
        '--border-radius': props.imageBorderRadius ? props.imageBorderRadius : '0%'
    }
});

const imageStore = useImageStore();

const image = computed(() => {
    return imageStore.cardImages[props.name];
});


function limitedSelection(index) {
    limitedStore.limitedSelection(props.player, 'graveyard', index);
}

</script>



<template>
    
    <div id="card_container" class="w-[300px] h-[90%] m-auto grid flex-none border-r-2 overflow-y-hidden">
          
          <div id="card_image_container" class="m-auto w-[90%] h-[100%] grid">

            <div id="card_image" class="m-auto w-[65%] h-[70%]">
              
                <img :src="image" container-width="50%" class="hover:scale-150 cursor-pointer" @click="(service.state.matches('player1TurnLimited') ||  
                service.state.matches('player2TurnLimited')) && limitedSelection(index)"/>

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