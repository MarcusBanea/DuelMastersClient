<script setup>
import { computed, ref } from '@vue/runtime-core';
import ImageContainer from './ImageContainer.vue';
import ImageContainerV2 from './ImageContainerV2.vue';
import ImageRevealOnClick from './ImageRevealOnClick.vue';

const props = defineProps({
    image: String, 
    index: Number,
    rotate: Boolean,

    canSendToMana: Boolean,
    mana: Number,
    manaAvailable: Number
});

const emits = defineEmits(['sendToBattleZone', 'sendToMana']);


const cssProps = computed(() => {
    return {
        '--container-width': props.containerWidth,
        '--container-height': props.containerHeight,
        '--border-radius': props.imageBorderRadius ? props.imageBorderRadius : '0%'
    }
});


function _base64ToArrayBuffer(base64) {
    var binary_string = atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

const imageSrc = computed(() => {
    const imgBlob = new Blob([_base64ToArrayBuffer(props.image)]);
    let urlCreator = URL;
    let imgUrl = urlCreator.createObjectURL(imgBlob);
    return imgUrl;
});



const cardClicked = ref(false);

function clickOnCard() {
    if(props.mana <= props.manaAvailable || props.canSendToMana == true) {
        cardClicked.value = true;
    }
}

function sendToBattleZone(index) {
    emits('sendToBattleZone', props.index);
}

function sendToMana(index) {
    emits('sendToMana', props.index);
}


</script>



<template>
    
    <div id="card_container" class="w-[300px] h-[90%] m-auto grid flex-none border-r-2  overflow-y-hidden">
          
          <div id="card_image_container" class="m-auto w-[90%] h-[100%] grid">

            <div v-if="!cardClicked" id="card_image" class="m-auto w-[65%] h-[70%]">
              
                <img :src="imageSrc" container-width="50%" class="hover:scale-150 cursor-pointer" @click="clickOnCard"/>

            </div>

            <div v-else-if="mana <= manaAvailable || canSendToMana == true" class="m-auto grid grid-rows-2 gap-4">

                <button v-if="mana <= manaAvailable" class="bg-myBeige text-myBlack font-bold rounded w-[100%] px-4" @click="sendToBattleZone()">
                    BATTLE ZONE
                </button>

                <button v-if="canSendToMana == true" class="bg-myBeige text-myBlack font-bold rounded w-[100%] px-4" @click="sendToMana()">
                    MANA
                </button>

                <button class="bg-[#FF0000] text-myBlack font-bold rounded w-min px-4 m-auto" @click="cardClicked = false">
                    X
                </button>

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