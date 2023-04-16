<script setup>
import { useMatchStore } from '../stores/matchStore';
import ImageContainerV2 from './ImageContainerV2.vue';

const matchStore = useMatchStore();

const props = defineProps({
    player: String
});

</script>

<template>
    
    <div v-for="(card, index) in matchStore.getCardsInZoneForPlayer('manaZone', player)" :key="card" class="w-[100px] h-[100px]">
        <ImageContainerV2 v-if="!card.highlighted" :zoom-on-hover-activated="false" :image="card.image" container-width="70%" rotate="-0.25turn"/>

        <div v-else class="border-4 border-myLightGreen">
            <ImageContainerV2 :zoom-on-hover-activated="false" :image="card.image" container-width="70%"  rotate="-0.25turn"
            @click="selectedCardForCommandExecution(index, zone = 'MN0')"
            />
        </div>
    </div>

</template>