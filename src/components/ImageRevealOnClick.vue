<script setup>
import { computed, ref } from '@vue/reactivity';
import { useImageStore } from '../stores/imageStore.js'
import CardService from '../services/CardService';

const imageStore = useImageStore();


const props = defineProps({
    cardId: String,
    containerWidth: String,
    containerHeight: String,
    imageBorderRadius: String,

    flipAnimationOn: Boolean,
});

const response = await getCardImageByName();
const image = await response.data;

const imageCode = ref();

const cssProps = computed(() => {
    return {
        '--container-width': props.containerWidth,
        '--container-height': props.containerHeight,
        '--border-radius': props.imageBorderRadius ? props.imageBorderRadius : '0%'
    }
});

async function getCardImageByName() {
    let cardImage = await CardService.getCardImageByCardId(props.cardId);
    return cardImage;
}

const imageSrc = computed(() => {
    imageStore.addCardImage(props.cardId, image);
    return imageStore.cardImages[props.cardId];
});

</script>
    
    
<template>
    <div :style="cssProps" class="image-container grid palce-items-center">
        <img :src="imageSrc"/>
    </div>
</template>
    
    
<style scoped>
.image-container {
    width: var(--container-width);
    height: var(--container-height);
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
}

.image-container img {
    object-fit: cover;
    border-radius: var(--border-radius);
}
</style>