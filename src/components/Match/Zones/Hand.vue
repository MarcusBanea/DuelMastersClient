<script setup>
import { useLimitedStore } from '../../../stores/limitedStore';
import { useMatchStore } from '../../../stores/matchStore';
import CardHandBlock from '../../CardHandBlock.vue';


const matchStore = useMatchStore();
const limitedStore = useLimitedStore();

const props = defineProps({
    player: String,
    state: Object,
    send: Object,
    service: Object
});

</script>

<template>
    
    <div class="w-full h-full flex flex-row flex-nowrap overflow-x-auto">

        <div v-for="(card, index) in matchStore.getCardsInZoneForPlayer('hand', player)" :key="card">
            <div v-if="service.state.matches(player + 'HandLimited')" class="h-[100%]">
                <div v-if="card.limitedSelected === true" class="pulse_animation h-[100%]">
                    <CardHandBlock :name="card.name" :index="index" :service = "service" :player = "player"
                        @click="limitedStore.limitedSelection(player, 'hand', index)"
                    />
                </div>
                <div v-else class="h-[100%]">
                    <CardHandBlock :name="card.name" :index="index" :service = "service" :player = "player"
                        @click="limitedStore.limitedSelection(player, 'hand', index)"
                    />
                </div>
            </div>
            
            <div v-else class="h-[100%]" >
                <CardHandBlock :name="card.name" :index="index" :mana="card.mana" :service = "service" :player = "player"
                    @send-to-mana="matchStore.sendCardFromHandToMana(index, player, service)"
                    @send-to-battle-zone="matchStore.sendCardFromHandToBattleZone(index, player, service)"
                />
            </div>
        </div>

    </div>

    <button v-if="player === 'player1'" class="absolute bg-myBeige text-myBlack font-bold rounded w-min px-4 bottom-8 right-24" @click="send('HIDE_HAND');">
        HAND
    </button>

    <button v-else-if="player === 'player2'" class="absolute bg-myBeige text-myBlack font-bold rounded w-min px-4 top-28 right-24" @click="send('HIDE_HAND');">
        HAND
    </button>

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