<script setup>
import { computed, ref } from '@vue/runtime-core';
import { useImageStore } from '../stores/imageStore';
import { useLimitedStore } from '../stores/limitedStore';
import { useMatchStore } from '../stores/matchStore';

const props = defineProps({
    name: String, 
    index: Number,
    rotate: Boolean,
    player: String,

    mana: Number,
    service: Object
});

const matchStore = useMatchStore();
const limitedStore = useLimitedStore();

const emits = defineEmits(['sendToBattleZone', 'sendToMana']);


const cssProps = computed(() => {
    return {
        '--container-width': props.containerWidth,
        '--container-height': props.containerHeight,
        '--border-radius': props.imageBorderRadius ? props.imageBorderRadius : '0%'
    }
});

const cardClicked = ref(false);

function clickOnCard(index) {
    if (props.service.state.matches(props.player + "Hand")) {
        if (props.mana <= matchStore.currentTurnManaAvailable || matchStore.currentTurnCanSendToMana == true) {
            cardClicked.value = true;
        }
    }
    else if (props.service.state.matches(props.player + "HandLimited")) {
        limitedStore.limitedSelection(props.player, "hand", props.index);
    }
}

function sendToBattleZone(index) {
    emits('sendToBattleZone', props.index);
}

function sendToMana(index) {
    emits('sendToMana', props.index);
}

const imageStore = useImageStore();

const image = computed(() => {
    return imageStore.cardImages[props.name];
});

</script>



<template>
    
    <div id="card_container" class="w-[300px] h-[90%] m-auto grid flex-none border-r-2  overflow-y-hidden">
          
          <div id="card_image_container" class="m-auto w-[90%] h-[100%] grid">

            <div v-if="!cardClicked" id="card_image" class="m-auto w-[65%] h-[70%]">
              
                <img :src="image" container-width="50%" class="hover:scale-150 cursor-pointer" @click="clickOnCard"/>

            </div>

            <div v-else-if="(mana <= matchStore.currentTurnManaAvailable || matchStore.currentTurnCanSendToMana == true) && 
                service.state.matches(player + 'Hand')" class="m-auto grid grid-rows-2 gap-4">

                <button v-if="mana <= matchStore.currentTurnManaAvailable" class="bg-myBeige text-myBlack font-bold rounded w-[100%] px-4" @click="sendToBattleZone()">
                    BATTLE ZONE
                </button>

                <button v-if="matchStore.currentTurnCanSendToMana == true" class="bg-myBeige text-myBlack font-bold rounded w-[100%] px-4" @click="sendToMana()">
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