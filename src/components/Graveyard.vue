<script setup>
import { useMatchStore } from '../stores/matchStore';

const matchStore = useMatchStore();

const props = defineProps({
    player: String
});

</script>


<template>
    
    <div id="graveyard_container" class="w-[40%] h-[90%] border-2 border-myBeige m-auto grid cursor-pointer">

        <div v-if="!matchStore.isGraveyardEmpty(player)" :key="matchStore.isGraveyardEmpty(player)">
            <ImageContainerV2 :image="matchStore.player1['graveyard'][matchStore.player1['graveyard'].length - 1].image" container-width="80%"/>
        </div>
        <p v-else class="text-myBeige m-auto">
            GRAVEYARD
        </p>

    </div>

</template>