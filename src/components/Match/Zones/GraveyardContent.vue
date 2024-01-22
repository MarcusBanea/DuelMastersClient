<script setup>
import { useLimitedStore } from '../../../stores/limitedStore';
import { useMatchStore } from '../../../stores/matchStore';
import CardGraveyardBlock from '../../CardGraveyardBlock.vue';
import CardHandBlock from '../../CardHandBlock.vue';


const matchStore = useMatchStore();
const limitedStore = useLimitedStore();

const props = defineProps({
    player: String,
    state: Object,
    send: Function,
    service: Object
});

</script>

<template>
    
    <div class="w-full h-full flex flex-row flex-nowrap overflow-x-auto">

        <div v-for="(card, index) in matchStore.getCardsInZoneForPlayer('graveyard', player)" :key="card">
            <div v-if="card.limitedSelected === true" class="pulse_animation h-[100%]">
                <CardGraveyardBlock :name="card.name" :index="index" :service = "service"
                />
            </div>
            <div v-else class="h-[100%]">
                <CardGraveyardBlock :name="card.name" :index="index" :service = "service"
                    @click="service.state.matches(player + 'GraveyardLimited') && limitedStore.limitedSelection(index)"
                />
            </div>
        </div>


    </div>
<!-- 
    <button v-if="player === 'player1'" class="absolute bg-myBeige text-myBlack font-bold rounded w-min px-4 bottom-8 right-24" @click="send('HIDE_GRAVEYARD');">
        HIDE GRAVEYARD
    </button>

    <button v-else-if="player === 'player2'" class="absolute bg-myBeige text-myBlack font-bold rounded w-min px-4 top-28 right-24" @click="send('HIDE_GRAVEYARD');">
        HIDE GRAVEYARD
    </button> -->
</template>