<script setup>
import { useMatchStore } from '../../../stores/matchStore';

const matchStore = useMatchStore();

const props = defineProps({
    clickable: Boolean,
    player: String
});

</script>

<template>
    
    <div id="deck_container" class="w-[40%] h-[90%] border-2 border-myBeige m-auto grid cursor-pointer">
                
        <p class="text-myBeige m-auto" @click="clickable === true ? matchStore.drawCard(player) : null">
            DECK
            <br>
            GET CARD
        </p>

    </div>

</template>