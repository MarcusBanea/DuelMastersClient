<script setup>
import { useLimitedStore } from '../stores/limitedStore';
import { useMatchStore } from '../stores/matchStore';
import ImageContainerV2 from './ImageContainerV2.vue';

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
            <ImageContainerV2 :zoom-on-hover-activated="false" :image="card.image" container-width="70%" rotate="-0.25turn"/>
        </div>

        <div v-else>
            <div v-if="card.limitedSelected == true" class="border-4 border-myLimitedGreen">
                <ImageContainerV2 :zoom-on-hover-activated="false" :image="card.image" container-width="70%"  rotate="-0.25turn"
                    @click="limitedSelection(index)"/>
            </div>
            <div v-else>
                <ImageContainerV2 :zoom-on-hover-activated="false" :image="card.image" container-width="70%"  rotate="-0.25turn"
                    @click="limitedSelection(index)"/>
            </div>
        </div>
    </div>

</template>