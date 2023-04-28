<script setup>
import { computed } from 'vue';
import { useMatchStore } from '../../../stores/matchStore';
import CardImage from '../../CardImage.vue';

const matchStore = useMatchStore();

const props = defineProps({
    player: String
});

const graveyardCards = computed(() => {
    return matchStore.getCardsInZoneForPlayer('graveyard', props.player);
});

</script>


<template>
    
    <div id="graveyard_container" class="w-[40%] h-[90%] border-2 border-myBeige m-auto grid cursor-pointer">

        <div v-if="!matchStore.isGraveyardEmpty(player)" :key="matchStore.isGraveyardEmpty(player)">
            <CardImage :name="graveyardCards[graveyardCards.length - 1].name" container-width="80%"/>
        </div>
        <p v-else class="text-myBeige m-auto">
            GRAVEYARD
        </p>

    </div>

</template>