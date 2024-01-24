<script setup>
import { onActivated, computed, onMounted } from 'vue';

import PlayerTableVariant from './PlayerTableVariant.vue';
import Hand from './Zones/Hand.vue';
import GraveyardContent from './Zones/GraveyardContent.vue';
import SlideButton from '../SlideButton.vue';

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-flip';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const props = defineProps({
    player: String,
    state: Object,
    send: Function,
    service: Object,
});

const hand_container_style = "border-2 border-myGold2 bg-myBlack/50 w-[1920px] h-[100%] grid grid-cols-[2.5%_95.5%]";

const limited_table_variant_style = computed(() => {
    let style = "border-2 border-myGold2 bg-myLimited w-[95%] h-[100%] m-auto grid";
    if (props.player === 'player1') {
        style += " grid-rows-[40%_35%_25%]";
    }
    else {
        style += " grid-rows-[25%_35%_40%]"
    }
    return style;
});
const full_control_table_variant_style = computed(() => {
    let style = "border-y-2 border-myGold2 bg-myBlack/50 w-[100%] h-[100%] grid";
    if (props.player === 'player1') {
        style += " grid-rows-[40%_35%_25%]";
    }
    else {
        style += " grid-rows-[25%_35%_40%]"
    }
    return style;
});

const modules = [Navigation];

onMounted(() => {
});

function slideNext() {
    const swiper = document.getElementById("swiper" + props.player).swiper;
    swiper.slideNext();
}

function slidePrev() {
    const swiper = document.getElementById("swiper" + props.player).swiper;
    swiper.slidePrev();
}

onActivated(() => {
    const swiper_next = document.querySelector(".swiper-button-next");
    swiper_next.style.visibility = "hidden";
    const swiper_prev = document.querySelector(".swiper-button-prev");
    swiper_prev.style.visibility = "hidden";

    const swiper = document.getElementById("swiper" + props.player).swiper;
    swiper.slideTo(1);
});

</script>


<template>
    <Swiper :id="'swiper' + player" :init="false" class="w-[1920px] h-[100%]" :navigation="true" :modules="modules" :initial-slide="1" :simulate-touch="false">

    <swiper-slide class="">
        <div id="hand" class = "w-[100%] h-[100%] grid grid-cols-[97.5%_2.5%] bg-transparent">
            <div class="border-2 border-myGold2 bg-myBlack/50 w-[100%] h-[100%] m-auto grid">
                <GraveyardContent :player = player :send = send :state = state :service = service />
            </div>
            <SlideButton label="TABLE" @click="slideNext();"/>
        </div>
    </swiper-slide>

    <swiper-slide class="bg-myBlack">
        <div id="player_table" class ="w-[100%] h-[100%] grid grid-cols-[2.5%_95%_2.5%] bg-transparent">
            <SlideButton label="GRAVEYARD" :right-border="true" @click="slidePrev();"/>
            <div :class=full_control_table_variant_style>
                <PlayerTableVariant :player = player :state = state :send = send :service = service />
            </div>
            <SlideButton label="HAND" :left-border="true" @click="slideNext();"/>
        </div>
    </swiper-slide>


    <swiper-slide class="">
        <div id="hand" class = "w-[100%] h-[100%] grid grid-cols-[2.5%_97.5%] bg-transparent">
            <SlideButton label="TABLE" @click="slidePrev();"/>
            <div class="border-2 border-myGold2 bg-myBlack/50 w-[100%] h-[100%] m-auto grid">
                <Hand :player = player :send = send :state = state :service = service @slide-to-table="slidePrev()" />
            </div>
        </div>
    </swiper-slide>

    </Swiper>
</template>

<style scoped>

.swiper {
  background-color: transparent;
}

.swiper-slide {
  background: transparent;
}
</style>
