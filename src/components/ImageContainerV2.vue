<script setup>
import { computed, ref } from '@vue/reactivity';


const props = defineProps({
    imageId: String,
    containerWidth: String,
    containerHeight: String,
    imageBorderRadius: String,
    rotate: String,

    image: String,

    zoomOnHoverActivated: Boolean
});

const response = props.imageId != null ? await fetch("/api/file/download/bytes/" + props.imageId) : null;
const image = props.imageId != null ? await response.json() : props.image;

const cssProps = computed(() => {
    return {
        '--container-width': props.containerWidth,
        '--container-height': props.containerHeight,
        '--border-radius': props.imageBorderRadius ? props.imageBorderRadius : '0%',
        '--rotate': props.rotate ? props.rotate : 0
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
    let imgBlob;
    if(props.imageId != null) {
        imgBlob = new Blob([_base64ToArrayBuffer(image.content)]);
    }
    else {
        imgBlob = new Blob([_base64ToArrayBuffer(props.image)]);
    }
    let urlCreator = URL;
    let imgUrl = urlCreator.createObjectURL(imgBlob);
    return imgUrl;
});

const clicked = ref(false);

</script>
    
    
<template>
    <div v-if="zoomOnHoverActivated" :style="cssProps" class="image-container m-auto hover:scale-[3] hover:delay-500 duration-300 hover:border-2 hover:border-myBeige">
        <img :src="imageSrc" />
    </div>
    <div v-else :style="cssProps" class="image-container m-auto">
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