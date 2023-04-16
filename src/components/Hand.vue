<script setup>
import { useMatchStore } from '../stores/matchStore';
import CardHandBlock from './CardHandBlock.vue';

const matchStore = useMatchStore();

const props = defineProps({
    player: String
});

</script>

<template>
    
    <div class="w-full h-full flex flex-row flex-nowrap overflow-x-auto">

        <CardHandBlock v-for="(card, index) in matchStore.getCardsInZoneForPlayer('hand', player)" :key="card" :image="card.image" :index="index" 
            :mana-available="matchStore.currentTurnManaAvailable" 
            :mana="card.mana" 
            :can-send-to-mana="matchStore.currentTurnCanSendToMana"
            @send-to-mana="isHandSelected = !isHandSelected; matchStore.sendCardFromHandToMana(index, player)"
            @send-to-battle-zone=" isHandSelected = !isHandSelected; matchStore.sendCardFromHandToBattleZone(index, player);"
        />

    </div>

    <button v-if="player === 'player1'" class="absolute bg-myBeige text-myBlack font-bold rounded w-min px-4 bottom-8 right-24" @click="isHandSelected = !isHandSelected">
        HAND
    </button>

    <button v-else-if="player === 'player2'" class="absolute bg-myBeige text-myBlack font-bold rounded w-min px-4 top-28 right-24" @click="isHandSelected = !isHandSelected">
        HAND
    </button>



</template>