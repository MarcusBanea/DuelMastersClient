<script setup>
import { useMatchStore } from '../../../stores/matchStore';

const matchStore = useMatchStore();

const props = defineProps({
    player: String,
    state: Object
});

</script>

<template>
    
    <div id="deck_container" class="w-[40%] h-[90%] border-2 border-myBeige m-auto grid cursor-pointer">
                
        <p class="text-myBeige m-auto" @click="state.matches(player + 'Turn') ? matchStore.drawCard(player) : null">
            DECK
            <br>
            GET CARD
        </p>

    </div>

</template>