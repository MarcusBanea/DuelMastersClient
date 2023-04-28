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
            <CardImage :zoom-on-hover-activated="false" :name="card.name" container-width="70%" :rotated=true />
        </div>

        <div v-else>
            <div v-if="card.limitedSelected == true" class="border-4 border-myLimitedGreen">
                <CardImage :zoom-on-hover-activated="false" :name="card.name" container-width="70%" :rotated=true
                    @click="limitedSelection(index)"/>
            </div>
            <div v-else>
                <CardImage :zoom-on-hover-activated="false" :name="card.name" container-width="70%" :rotated=true
                    @click="limitedSelection(index)"/>
            </div>
        </div>
    </div>

</template>