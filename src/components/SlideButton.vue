<script setup>
import { computed } from 'vue';

const props = defineProps({
    leftBorder: Boolean,
    rightBorder: Boolean,

    label: String
});

const slider_css = computed(() => {
    let style = "bg-myBlack/50 grid place-items-center border-y-2 border-myGold2 cursor-pointer ";
    if (props.leftBorder === true) {
        style += "border-l-2";
    }
    if (props.rightBorder === true) {
        style += "border-r-2";
    }
    return style;
});

</script>


<template>
    
    <div id="displayGraveyardButton" :class="slider_css">
        <p class="text-myGold3 text-2xl font-bold font-fantasy" style="writing-mode: vertical-lr; text-orientation: upright;">
            {{ label }}
        </p>
    </div>

</template>