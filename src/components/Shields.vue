<script setup>
import { useLimitedStore } from '../stores/limitedStore';
import { useMatchStore } from '../stores/matchStore';

const matchStore = useMatchStore();
const limitedStore = useLimitedStore();

const props = defineProps({
    player: String,

    limited: Boolean
});

function limitedSelection(index) {
    limitedStore.limitedSelection(props.player, 'shields', index);
}

</script>

<template>
    
    <div id="shields_container" class="w-[70%] h-[90%] border-2 border-myBeige m-auto flex flex-row justify-between">
              
        <div v-for="(card, index) in matchStore.getCardsInZoneForPlayer('shields', player)" :key="card">

            <div v-if="!limited">
                <div v-if="card.selected == true" class="border-4 border-myLightGreen">
                    <img src="../assets/Shield.jpg" class="h-28"/>
                </div>
                <div v-else >
                    <img src="../assets/Shield.jpg" class="h-28"/>
                </div>
            </div>

            <div v-else>
                <div v-if="card.limitedSelected" class="border-4 border-myLimitedGreen">
                    <img src="../assets/Shield.jpg" class="h-28"
                        @click="limitedSelection(index)"/>
                </div>
                <div v-else >
                    <img src="../assets/Shield.jpg" class="h-28"
                        @click="limitedSelection(index)"/>
                </div>
            </div>
        </div>
    </div>

</template>