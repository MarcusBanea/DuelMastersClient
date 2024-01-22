<script setup>
import { computed, onMounted } from 'vue';
import PlayerTableVariant from './PlayerTableVariant.vue';
import Hand from './Zones/Hand.vue';
import GraveyardContent from './Zones/GraveyardContent.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { EffectFlip, Pagination, Navigation } from 'swiper/modules';
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
    let style = "border-2 border-myGold2 bg-myBlack/50 w-[100%] h-[100%] m-auto grid";
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
    const swiper = document.getElementById("swiper" + props.player);
    // swiper.slidesPerView = 1.1;
    // console.log(document.querySelector(".swiper-button-next"));
    const swiper_next = document.querySelector(".swiper-button-next");
    swiper_next.style.visibility = "hidden";
    const swiper_prev = document.querySelector(".swiper-button-prev");
    swiper_prev.style.visibility = "hidden";
    // console.log(swiper_next.style);
});

function slideNext() {
    const swiper = document.getElementById("swiper" + props.player).swiper;
    swiper.slideNext();
}

function slidePrev() {
    const swiper = document.getElementById("swiper" + props.player).swiper;
    swiper.slidePrev();
}

</script>


<template>
    
    <div class="h-full w-full">
        <Swiper v-if="player === 'player1'" :id="'swiper' + player" :init="false" class="w-[1920px] h-[100%]" :navigation="true" :modules="modules" :initial-slide="1">

            <swiper-slide class="">
                <div id="hand" class = "w-[100%] h-[100%] grid grid-cols-[97.5%_2.5%] bg-transparent">
                    <div class="border-2 border-myGold2 bg-myBlack/50 w-[100%] h-[100%] m-auto grid">
                        <GraveyardContent :player = player :send = send :state = state :service = service />
                    </div>
                    <div id="displayGraveyardButton" class="bg-myBlack/50 grid place-items-center border-y-2 border-myGold2 cursor-pointer" @click="slideNext();">
                        <p class="text-myGold3 text-2xl font-bold font-fantasy" style="writing-mode: vertical-lr; text-orientation: upright;">
                            TABLE
                        </p>
                    </div>
                </div>
            </swiper-slide>
            
            <swiper-slide class="bg-myBlack">
                <div id="player_table" class ="w-[100%] h-[100%] grid grid-cols-[2.5%_95%_2.5%] bg-transparent">
                    <div id="displayGraveyardButton" class="bg-myBlack/25 grid place-items-center border-y-2 border-myGold2 cursor-pointer" @click="slidePrev();">
                        <p class="text-myGold3 text-2xl font-bold font-fantasy" style="writing-mode: vertical-lr; text-orientation: upright;">
                            GRAVEYARD
                        </p>
                    </div>
                    <div :class=full_control_table_variant_style>
                        <PlayerTableVariant :player = player :state = state :send = send :service = service />
                    </div>
                    <div id="displayHandButton" class="bg-myBlack/50 grid place-items-center border-y-2 border-myGold2 cursor-pointer" @click="send('SHOW_HAND'); slideNext();">
                        <p class="text-myGold3 text-2xl font-bold font-fantasy" style="writing-mode: vertical-lr; text-orientation: upright;">
                            HAND
                        </p>
                    </div>
                </div>
            </swiper-slide>


            <swiper-slide class="">
                <div id="hand" class = "w-[100%] h-[100%] grid grid-cols-[2.5%_97.5%] bg-transparent">
                    <div id="displayHandButton" class="bg-myBlack/50 grid place-items-center border-y-2 border-myGold2 cursor-pointer" @click="slidePrev();">
                        <p class="text-myGold3 text-2xl font-bold font-fantasy" style="writing-mode: vertical-lr; text-orientation: upright;">
                            TABLE
                        </p>
                    </div>
                    <div class="border-2 border-myGold2 bg-myBlack/50 w-[100%] h-[100%] m-auto grid">
                        <Hand :player = player :send = send :state = state :service = service @slide-to-table="slidePrev()" />
                    </div>
                </div>
            </swiper-slide>

        </Swiper>
    </div>


    <!--     
    <div id="hand" v-if="service.state.matches(player + 'Hand') || state.matches(player + 'HandLimited')" :class = hand_container_style>
        <Hand :player = player :send = send :state = state :service = service />
    </div>

    <div id="player_table" v-else-if="service.state.matches(player + 'Turn')" class ="w-[100%] h-[100%] grid grid-cols-[2.5%_95%_2.5%]">
        <div id="displayGraveyardButton" class="bg-myBlack/25 grid place-items-center border-y-2 border-myGold2 cursor-pointer" @click="service.send('SHOW_GRAVEYARD')">
            <p class="text-myGold3 text-2xl font-bold font-fantasy" style="writing-mode: vertical-lr; text-orientation: upright;">
                GRAVEYARD
            </p>
        </div>
        <div :class=full_control_table_variant_style>
            <PlayerTableVariant :player = player :state = state :send = send :service = service />
        </div>
        <div id="displayHandButton" class="bg-myBlack/50 grid place-items-center border-y-2 border-myGold2 cursor-pointer" @click="send('SHOW_HAND')">
            <p class="text-myGold3 text-2xl font-bold font-fantasy" style="writing-mode: vertical-lr; text-orientation: upright;">
                HAND
            </p>
        </div>
    </div>

    <div id="graveyard" v-else-if="service.state.matches(player + 'Graveyard') || state.matches(player + 'GraveyardLimited')" :class = hand_container_style>
        <GraveyardContent :player = player :send = send :state = state :service = service />
    </div> -->
</template>



<style scoped>

.swiper {
  background-color: transparent;
}

.swiper-slide {
  background: transparent;
}

</style>