<script setup>
import { computed, ref } from '@vue/reactivity';


const props = defineProps({
    imageUrl: String,
    containerWidth: String,
    containerHeight: String,
    imageBorderRadius: String,

    flipAnimationOn: Boolean,
    cardRarity: String
});

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
    const imgBlob = new Blob([_base64ToArrayBuffer(props.imageUrl)]);
    let urlCreator = URL;
    let imgUrl = urlCreator.createObjectURL(imgBlob);
    return imgUrl;
});

function getImage() {
    const imgBlob = new Blob([_base64ToArrayBuffer(props.imageUrl)]);
    let urlCreator = URL;
    let imgUrl = urlCreator.createObjectURL(imgBlob);
    return imgUrl;
}



const clicked = ref(false);

</script>


<template>
    <div :style="cssProps" class="image-container m-auto">
        <div v-if="props.flipAnimationOn || props.cardRarity">
            <img v-if="clicked" :src="imageSrc" />
            <img v-if="props.cardRarity === 'Common' && clicked === false" src="../assets/common-card.png"
                @click="clicked = true" />
            <img v-else-if="props.cardRarity === 'Uncommon' && clicked === false" src="../assets/uncommon-card.png"
                @click="clicked = true" />
            <img v-else-if="props.cardRarity === 'Rare' && clicked === false" src="../assets/rare-card.png"
                @click="clicked = true" />
            <img v-else-if="props.cardRarity === 'VeryRare' && clicked === false" src="../assets/very-rare-card.png"
                @click="clicked = true" />
            <img v-else-if="props.cardRarity === 'SuperRare' && clicked === false" src="../assets/super-rare-card.png"
                @click="clicked = true" />
            <img v-else-if="props.cardRarity === 'Legendary' && clicked === false" src="../assets/legendary-card.png"
                @click="clicked = true" />
        </div>
        <div v-else>
            <img :src="getImage()" />
        </div>
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
}
</style>