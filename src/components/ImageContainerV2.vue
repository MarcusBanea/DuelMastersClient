<script setup>
import { computed, ref } from '@vue/reactivity';
import CardService from '../services/CardService';
import { useImageStore } from '../stores/imageStore.js'

const imageStore = useImageStore();

const props = defineProps({
    cardId: String,
    cardName: String,
    containerWidth: String,
    containerHeight: String,
    imageBorderRadius: String,
    rotate: String,

    image: String,
    rotated: Boolean,

    zoomOnHoverActivated: Boolean
});

const response = await getCardImageByName();
const image = await response.data;

const cssProps = computed(() => {
    return {
        '--container-width': props.containerWidth,
        '--container-height': props.containerHeight,
        '--border-radius': props.imageBorderRadius ? props.imageBorderRadius : '0%',
        '--rotate': props.rotated ? "-0.25turn" : 0
    }
});

async function getCardImageByName() {
    let cardImage = await CardService.getCardImageByName(props.cardName);
    return cardImage;
}

const imageSrc = computed(() => {
    imageStore.addCardImage(props.cardName, image);
    return imageStore.cardImages[props.cardName];
});

</script>
    
    
<template>
    <div v-if="zoomOnHoverActivated" :style="cssProps" class="image-container m-auto hover:scale-[3] 
        hover:delay-500 duration-300 hover:border-2 hover:border-myBeige">
        <img :src="imageSrc" />
    </div>
    <div v-else :style="cssProps" class="image-container m-auto shadow-2xl">
        <img :src="imageSrc" />
    </div>
</template>
    
    
<style scoped>
.image-container {
    width: var(--container-width);
    height: var(--container-height);
    display: flex;
    justify-content: center;
    align-items: center;
}

.image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: var(--border-radius);
    transform: rotate(var(--rotate));
}
</style>