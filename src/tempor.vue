<template>



<div v-else-if="(mana <= matchStore.currentTurnManaAvailable || matchStore.currentTurnCanSendToMana == true) && 
    service.state.matches(player + 'Hand')" class="...">

    <button v-if="mana <= matchStore.currentTurnManaAvailable" class="..." @click="sendToBattleZone()">
        BATTLE ZONE
    </button>

    <button v-if="matchStore.currentTurnCanSendToMana == true" class="..." @click="sendToMana()">
        MANA
    </button>

    <button class="..." @click="cardClicked = false">
        X
    </button>

</div>



</template>