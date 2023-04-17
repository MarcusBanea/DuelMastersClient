<script setup>
import { useMatchStore } from '../stores/matchStore';
import CardHandBlock from './CardHandBlock.vue';

const matchStore = useMatchStore();

const props = defineProps({
    player: String,
    state: Object,
    send: Object
});

</script>

<template>
    
    <div class="w-full h-full flex flex-row flex-nowrap overflow-x-auto">

        <CardHandBlock v-for="(card, index) in matchStore.getCardsInZoneForPlayer('hand', player)" :key="card" :image="card.image" :index="index" 
            :mana="card.mana" 
            @send-to-mana="send({type: 'TOGGLE_HAND_VISIBILITY'}); matchStore.sendCardFromHandToMana(index, player)"
            @send-to-battle-zone="send({type: 'TOGGLE_HAND_VISIBILITY'});  matchStore.sendCardFromHandToBattleZone(index, player);"
        />

    </div>

    <button v-if="player === 'player1'" class="absolute bg-myBeige text-myBlack font-bold rounded w-min px-4 bottom-8 right-24" @click="send('TOGGLE_HAND_VISIBILITY');">
        HAND
    </button>

    <button v-else-if="player === 'player2'" class="absolute bg-myBeige text-myBlack font-bold rounded w-min px-4 top-28 right-24" @click="send('TOGGLE_HAND_VISIBILITY');">
        HAND
    </button>



</template>