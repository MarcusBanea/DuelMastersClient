<script setup>
import { KeepAlive, computed, onMounted, watch } from 'vue';
import PlayerTableVariant from './PlayerTableVariant.vue';
import CurrentTurnPlayerTable from './CurrentTurnPlayerTable.vue';
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

</script>


<template>
    
    <div class="h-full w-full">
        <KeepAlive>
            <CurrentTurnPlayerTable v-if="service.state.matches(player + 'Turn')" :service = service :player = player :state = state :send = send />
        </KeepAlive>

        <div v-show="!service.state.matches(player + 'Turn')" id="opponent_table" class ="w-full h-full grid grid-cols-[2.5%_95%_2.5%] bg-transparent">
            <div id="displayGraveyardButton" class="bg-myBlack/50 border-y-2 border-myGold2"></div>
            <div :class = full_control_table_variant_style>
                <PlayerTableVariant :player = player :state = state :send = send :service = service />
            </div>
            <div id="displayHandButton" class="bg-myBlack/50 border-y-2 border-myGold2"></div>
        </div>
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

</style>