<script setup>
import { computed, ref } from '@vue/reactivity';
import { useImageStore } from '../stores/imageStore';


const props = defineProps({
    name: String,

    containerWidth: String,
    containerHeight: String,
    imageBorderRadius: String,
    rotated: Boolean,

    zoomOnHoverActivated: Boolean
});

const cssProps = computed(() => {
    return {
        '--container-width': props.containerWidth,
        '--container-height': props.containerHeight,
        '--border-radius': props.imageBorderRadius ? props.imageBorderRadius : '0%',
        '--rotate': props.rotated ? "-0.25turn" : 0
    }
});

const imageStore = useImageStore();

const image = computed(() => {
    return imageStore.cardImages[props.name];
});

</script>
    
    
<template>
    <div v-if="zoomOnHoverActivated" :style="cssProps" class="image-container m-auto hover:scale-[3] hover:delay-500 duration-300 hover:border-2 hover:border-myBeige">
        <img :src="image" />
    </div>
    <div v-else :style="cssProps" class="image-container m-auto">
        <img :src="image" />
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