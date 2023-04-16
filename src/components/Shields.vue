<script setup>
import { useMatchStore } from '../stores/matchStore';

const matchStore = useMatchStore();

const props = defineProps({
    player: String
});

</script>

<template>
    
    <div id="shields_container" class="w-[70%] h-[90%] border-2 border-myBeige m-auto flex flex-row justify-between">
              
        <div v-for="card in matchStore.getCardsInZoneForPlayer('shields', player)" :key="card">

            <div v-if="card.selected == true" class="border-4 border-myLightGreen">
                <img src="../assets/Shield.jpg" class="h-28"/>
            </div>
            <div v-else >
                <img src="../assets/Shield.jpg" class="h-28"/>
            </div>

            </div>

        </div>

</template>