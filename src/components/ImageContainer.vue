<script setup>
import { computed } from '@vue/reactivity';


const props = defineProps({
    imageUrl: String,
    containerWidth: String,
    containerHeight: String,
    imageBorderRadius: String
});

const cssProps = computed(() => {
    return {
        '--container-width': props.containerWidth,
        '--container-height': props.containerHeight,
        '--border-radius': props.imageBorderRadius ? props.imageBorderRadius : '0%'
    }
});

function _base64ToArrayBuffer(base64) {
    console.log(base64);
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

</script>


<template>
    <div :style="cssProps" class="image-container">
        <img v-if="imageUrl" :src="imageSrc" />
        <img v-else src="@/assets/defaultUser.jpg" />
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