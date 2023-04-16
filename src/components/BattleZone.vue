<script setup>
import { ref } from 'vue';
import { useMatchStore } from '../stores/matchStore';
import ImageContainerV2 from './ImageContainerV2.vue';

const matchStore = useMatchStore();

const props = defineProps({
    state: Object,
    send: Object,
    player: String
});

const lastCardSelectedIndex = ref(-1);

//save the index of the (last) selected card from the battle zone and send it to match interface
//the match interface will notify the opponent player interface to highlight the attack options for this selected card
function selectCard(index) {
    if(lastCardSelectedIndex.value != -1 && lastCardSelectedIndex.value != index) {
        matchStore.getCardsInZoneForPlayer('battleZone', player)[lastCardSelectedIndex.value].selected = false;
    }
    matchStore.getCardsInZoneForPlayer('battleZone', player)[index].selected = !matchStore.getCardsInZoneForPlayer('battleZone', player)[index].selected;
    lastCardSelectedIndex.value = index;
    emits("selectCard", lastCardSelectedIndex.value);
}

//when the opponent is attacking, notify the match interface which card he/she selected
function opponentSelectCard(index) {
    lastCardSelectedIndex.value = index;    
    emits("opponentSelectCard", lastCardSelectedIndex.value);
}

function selectedCardForCommandExecution(index, zone) {
    //add card to selection for command (ability) execution
    let cardCode = zone + " " + index;
    selection.value.push(cardCode);
    if(selection.value.length == selectionCounter.value) {
        executeAbilityOnSelection();
    }
}


</script>

<template>
    
    <div id="battleZone_container" class="w-[100%] h-[100%] flex flex-row justify-evenly mb-2 mt-2">

        <div v-for="(card, index) in matchStore.getCardsInZoneForPlayer('battleZone', player)" :key="card" class="w-[6%] h-[100px]">
            <div v-if="card.selected == true && state.matches('player1Turn')" class="border-4">
                <ImageContainerV2 :zoom-on-hover-activated="true" :image="card.image" container-width="100%" @click="selectCard(index)"/>
            </div>
            <div v-else-if="card.selected == true && state.matches('player2Turn')" class="border-4 border-myLightGreen">
                <ImageContainerV2 :zoom-on-hover-activated="true" :image="card.image" container-width="100%" @click="opponentSelectCard(index)"/>
            </div>
            <div v-else>
                <ImageContainerV2 :zoom-on-hover-activated="true" :image="card.image" container-width="100%" @click="state.matches('player1Turn') && selectCard(index)"/>
            </div>
        </div>

    </div>

</template>