<script setup>
import { useLimitedStore } from '../../../stores/limitedStore';
import { useMatchStore } from '../../../stores/matchStore';


const matchStore = useMatchStore();
const limitedStore = useLimitedStore();

const props = defineProps({
    player: String,
    service: Object,

    limited: Boolean
});

function limitedSelection(index) {
    limitedStore.limitedSelection(props.player, 'shields', index);
}

//when the opponent is attacking, notify the match interface which card was selected
function opponentSelectCard(index) {
    console.log("Service = " + props.service);
    matchStore.selectedCardToAttack(props.player === 'player1' ? 'player2' : 'player1', index, "shields", props.service, true); 
}

</script>

<template>
    
    <div id="shields_container" class="w-[70%] h-[90%] border-2 border-myBeige m-auto flex flex-row justify-between">
              
        <div v-for="(card, index) in matchStore.getCardsInZoneForPlayer('shields', player)" :key="card">

            <div v-if="!limited">
                <div v-if="card.selected == true" class="pulse_animation">
                    <img src="../../../assets/Shield.jpg" class="h-28" @click="opponentSelectCard(index)"/>
                </div>
                <div v-else >
                    <img src="../../../assets/Shield.jpg" class="h-28"/>
                </div>
            </div>

            <div v-else>
                <div v-if="card.limitedSelected" class="pulse_animation">
                    <img src="../../../assets/Shield.jpg" class="h-28"
                        @click="limitedSelection(index)"/>
                </div>
                <div v-else >
                    <img src="../../../assets/Shield.jpg" class="h-28"
                        @click="limitedSelection(index)"/>
                </div>
            </div>
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