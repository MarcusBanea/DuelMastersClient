<script setup>
import { computed, ref } from 'vue';
import { useMatchStore } from '../stores/matchStore';
import ImageContainerV2 from './ImageContainerV2.vue';
import { useLimitedStore } from '../stores/limitedStore';

const matchStore = useMatchStore();
const limitedStore = useLimitedStore();

const props = defineProps({
    state: Object,
    send: Object,
    player: String,

    limited: Boolean
});

const lastCardSelectedIndex = ref(-1);

//save the index of the (last) selected card from the battle zone and send it to match interface
//the match interface will notify the opponent player interface to highlight the attack options for this selected card
function selectCard(index) {
    lastCardSelectedIndex.value = index;

    matchStore.selectCard(props.player, 'battleZone', index);
}

function selectCardForAttack(index) {
    matchStore.selectCardForAttack(props.player, index);
}

//when the opponent is attacking, notify the match interface which card was selected
function opponentSelectCard(index) {
    matchStore.selectedCardToAttack(props.player === 'player1' ? 'player2' : 'player1', index); 
}

function selectedCardForCommandExecution(index, zone) {
    //add card to selection for command (ability) execution
    let cardCode = zone + " " + index;
    selection.value.push(cardCode);
    if(selection.value.length == selectionCounter.value) {
        executeAbilityOnSelection();
    }
}

const currentTurn = computed(() => {
    return props.player + "Turn";
});

function limitedSelection(index) {
    limitedStore.limitedSelection(props.player, 'battleZone', index);
}


</script>

<template>
    
    <div id="battleZone_container" class="w-[100%] h-[100%] flex flex-row justify-evenly mb-2 mt-2">

        <div v-for="(card, index) in matchStore.getCardsInZoneForPlayer('battleZone', player)" :key="card" class="w-[6%] h-[100px]">
            <div v-if="card.selected == true" class="border-4">
                <div v-if="state.matches(currentTurn)">
                    <ImageContainerV2 :zoom-on-hover-activated="true" :image="card.image" container-width="100%" 
                        @click="matchStore.resetSelectedAttributeOfAllCards()"/>
                </div>

                <div v-else class="border-myLightGreen">
                    <ImageContainerV2 :zoom-on-hover-activated="true" :image="card.image" container-width="100%" 
                        @click="opponentSelectCard(index)"/>
                </div>
            </div>
            <div v-else>
                <div v-if="limited">
                    <div v-if="card.limitedSelected == true" class="border-4 border-myLimitedGreen">
                        <ImageContainerV2 :zoom-on-hover-activated="true" :image="card.image" container-width="100%" 
                            @click="limitedSelection(index)"/>
                    </div>
                    <div v-else>
                        <ImageContainerV2 :zoom-on-hover-activated="true" :image="card.image" container-width="100%" 
                            @click="limitedSelection(index)"/>
                    </div>
                </div>
                <div v-else >
                    <ImageContainerV2 :zoom-on-hover-activated="true" :image="card.image" container-width="100%" 
                        @click="state.matches(currentTurn) && selectCardForAttack(index)"/>
                </div>
            </div>
        </div>

    </div>

</template>