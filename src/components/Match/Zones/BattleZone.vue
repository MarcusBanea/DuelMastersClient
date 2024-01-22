<script setup>
import { computed, ref } from 'vue';
import { useMatchStore } from '../../../stores/matchStore';
import { useLimitedStore } from '../../../stores/limitedStore';
import CardImage from '../../CardImage.vue';

const matchStore = useMatchStore();
const limitedStore = useLimitedStore();

const props = defineProps({
    state: Object,
    send: Function,
    service: Object,
    player: String,

    limited: Boolean
});

function selectCardForAttack(index) {
    matchStore.resetSelectedAttributeOfAllCards();
    matchStore.selectCardForAttack(props.player, index);
}

//when the opponent is attacking, notify the match interface which card was selected
function opponentSelectCard(index) {
    console.log("Service = " + props.service);
    matchStore.selectedCardToAttack(props.player === 'player1' ? 'player2' : 'player1', index, "battleZone", props.service, true, false); 
}

const currentTurn = computed(() => {
    return props.player + "Turn";
});

function limitedSelection(index) {
    limitedStore.limitedSelection(props.player, 'battleZone', index);
}


</script>

<template>
    
    <div id="battleZone_container" class="w-[100%] h-[100%] flex flex-row justify-evenly mb-2 mt-2">

        <div v-for="(card, index) in matchStore.getCardsInZoneForPlayer('battleZone', player)" :key="card" class="w-[6%] h-[100px]">
            <div v-if="card.selected == true" class="">
                <div v-if="state.matches(currentTurn)" class="pulse_animation">
                    <CardImage :zoom-on-hover-activated="true" :name="card.name" container-width="100%" :rotated=card.tapped
                        @click="matchStore.resetSelectedAttributeOfAllCards()"/>
                </div>

                <div v-else class="pulse_animation">
                    <CardImage :zoom-on-hover-activated="true" :name="card.name" container-width="100%" :rotated=card.tapped
                        @click="opponentSelectCard(index)"/>
                </div>
            </div>
            <div v-else>
                <div v-if="limited">
                    <div v-if="card.limitedSelected == true" class="pulse_animation">
                        <CardImage :zoom-on-hover-activated="true" :name="card.name" container-width="100%" :rotated=card.tapped
                            @click="limitedSelection(index)"/>
                    </div>
                    <div v-else>
                        <CardImage :zoom-on-hover-activated="true" :name="card.name" container-width="100%" :rotated=card.tapped
                            @click="limitedSelection(index)"/>
                    </div>
                </div>
                <div v-else >
                    <CardImage :zoom-on-hover-activated="true" :name="card.name" container-width="100%" :rotated=card.tapped
                        @click="!card.tapped && state.matches(currentTurn) && selectCardForAttack(index)"/>
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