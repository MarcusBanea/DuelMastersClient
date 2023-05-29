<script setup>
import { useLimitedStore } from '../../../stores/limitedStore';
import { useMatchStore } from '../../../stores/matchStore';
import CardImage from '../../CardImage.vue';


const matchStore = useMatchStore();
const limitedStore = useLimitedStore();

const props = defineProps({
    player: String,

    limited: Boolean
});

function limitedSelection(index) {
    limitedStore.limitedSelection(props.player, 'manaZone', index);
}

</script>

<template>
    
    <div v-for="(card, index) in matchStore.getCardsInZoneForPlayer('manaZone', player)" :key="card" class="w-[100px] h-[100px]">
        <div v-if="!limited">
            <div v-if="!card.tapped">
                <CardImage :zoom-on-hover-activated="false" :name="card.name" container-width="70%" :rotated=false />
            </div>
            <div v-else>
                <CardImage :zoom-on-hover-activated="false" :name="card.name" container-width="70%" :rotated=true />
            </div>
        </div>

        <div v-else>
            <div v-if="card.limitedSelected == true" class="pulse_animation">
                <div v-if="!card.tapped">
                    <CardImage :zoom-on-hover-activated="false" :name="card.name" container-width="70%" :rotated=false @click="limitedSelection(index)"/>
                </div>
                <div v-else>
                    <CardImage :zoom-on-hover-activated="false" :name="card.name" container-width="70%" :rotated=true @click="limitedSelection(index)"/>
                </div>
            </div>
            <div v-else>
                <div v-if="!card.tapped">
                    <CardImage :zoom-on-hover-activated="false" :name="card.name" container-width="70%" :rotated=false @click="limitedSelection(index)"/>
                </div>
                <div v-else>
                    <CardImage :zoom-on-hover-activated="false" :name="card.name" container-width="70%" :rotated=true @click="limitedSelection(index)"/>
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