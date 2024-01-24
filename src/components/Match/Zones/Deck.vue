<script setup>
import { onMounted } from 'vue';
import { useLimitedStore } from '../../../stores/limitedStore';
import { useMatchStore } from '../../../stores/matchStore';

const matchStore = useMatchStore();

const limitedStore = useLimitedStore();

const props = defineProps({
    player: String,
    state: Object
});

</script>

<template>
    
    <div v-if="matchStore.currentTurnCanDrawCard == true" 
        class="w-[90%] h-full m-auto grid cursor-pointer pulse_animation" title="Draw card"
        @click="matchStore.drawCard(player)">

        <div class="grid place-items-center">
            <img src="../../../assets/Shield.jpg" class="h-[90%] relative opacity-100"/>
        </div>

    </div>

    <!-- <div v-else-if="state.matches(player + 'TurnLimited') && limitedStore.admissibleDraw == true && limitedStore.limit > 0" 
        class="w-[100%] h-[90%] border-2 border-myBeige m-auto grid cursor-pointer pulse_animation"
        @click="matchStore.drawCard(player) && limitedStore.limit--">

        <div class="grid">
            <img src="../../../assets/Shield.jpg" class="h-28 relative m-auto opacity-30"/>
            <p class="text-myBeige mt-8 mb-8 ml-4 absolute">
                DECK
                <br>
                GET CARD
            </p>
        </div>

    </div> -->

    <div v-else class="w-[90%] h-full m-auto grid" title="Cannot draw again this turn!">

        <div class="grid place-items-center" @click="temp()">
            <img src="../../../assets/Shield.jpg" class="h-[90%] relative opacity-100"/>
        </div>

    </div>

</template>

<style scoped>

@-webkit-keyframes pulse {
    0% { -webkit-transform: scale(0.9); opacity: 0.7; }
    50% { -webkit-transform: scale(1); opacity: 1; }
    100% { -webkit-transform: scale(0.9); opacity: 0.7; }
}

@keyframes pulse {
    0% { transform: scale(0.9); opacity: 0.7; }
    50% { transform: scale(1); opacity: 1; }
    100% { transform: scale(0.9); opacity: 0.7; }
}

.pulse_animation {
    
    -webkit-animation: pulse 3s infinite ease-in-out;
    -o-animation: pulse 3s infinite ease-in-out;
    -ms-animation: pulse 3s infinite ease-in-out; 
    -moz-animation: pulse 3s infinite ease-in-out; 
    animation: pulse 3s infinite ease-in-out;
}

</style>