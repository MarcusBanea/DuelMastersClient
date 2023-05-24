<script setup>
import { useMatchStore } from '../../../stores/matchStore';
import CardGraveyardBlock from '../../CardGraveyardBlock.vue';
import CardHandBlock from '../../CardHandBlock.vue';


const matchStore = useMatchStore();

const props = defineProps({
    player: String,
    state: Object,
    send: Object,
    service: Object
});

</script>

<template>
    
    <div class="w-full h-full flex flex-row flex-nowrap overflow-x-auto">

        <CardGraveyardBlock v-for="(card, index) in matchStore.getCardsInZoneForPlayer('graveyard', player)" :key="card" :name="card.name" :index="index" 
            :service = "service"
        />

    </div>

    <button v-if="player === 'player1'" class="absolute bg-myBeige text-myBlack font-bold rounded w-min px-4 bottom-8 right-24" @click="send('HIDE_GRAVEYARD');">
        HIDE GRAVEYARD
    </button>

    <button v-else-if="player === 'player2'" class="absolute bg-myBeige text-myBlack font-bold rounded w-min px-4 top-28 right-24" @click="send('HIDE_GRAVEYARD');">
        HIDE GRAVEYARD
    </button>



</template>