<script setup>
import { computed, ref } from 'vue';
import { useLimitedStore } from '../../../stores/limitedStore';
import { useMatchStore } from '../../../stores/matchStore';
import CardHandBlock from '../../CardHandBlock.vue';
import Deck from './Deck.vue';

const matchStore = useMatchStore();
const limitedStore = useLimitedStore();

const props = defineProps({
    player: String,
    state: Object,
    send: Function,
    service: Object
});

const emits = defineEmits(['slideToTable']);

function slideToTable() { emits('slideToTable'); }

const cardSlider = ref(null);
const isLeftScrollPossible = ref(false);
const isRightScrollPossible = ref(true);

function scrollLeft() {
    cardSlider.value.scrollLeft = cardSlider.value.scrollLeft - 250;
    if(cardSlider.value.scrollLeft - 250 <= 0) {
        isLeftScrollPossible.value = false;
    }
    isRightScrollPossible.value = true;
}

function scrollRight() {
    cardSlider.value.scrollLeft = cardSlider.value.scrollLeft + 250;
    if(cardSlider.value.scrollLeft + 250 >= (cardSlider.value.scrollWidth - cardSlider.value.clientWidth)) {
        isRightScrollPossible.value = false;
    }
    isLeftScrollPossible.value = true;
}

const gradient = computed(() => {
  if(isRightScrollPossible.value == true && isLeftScrollPossible.value == true) {
    return {
      '--gradient': "left, rgba(255,0,0,0) 0%, rgba(255,0,0,1) 10%, rgba(255,0,0,1) 90%, rgba(255,0,0,0) 100%"
    }
  }
  else if(isRightScrollPossible.value != true) {
    return {
      '--gradient': "right, rgba(0,0,0,1) 90%, rgba(0,0,0,0)"
    }
  }
  else if(isLeftScrollPossible.value != true) {
    return {
      '--gradient': "left, rgba(0,0,0,1) 90%, rgba(0,0,0,0)"
    }
  }
})

</script>

<template>
    
    <div class="w-full h-full grid grid-cols-[16%_84%]">

        <div id="card_container" class="w-[300px] h-[100%] border-r-2">
          
            <div id="card_image_container" class="m-auto w-[300px] h-[100%] grid">
                <Deck :player = player :state = state />
            </div>

        </div>

        <div class="w-[1570px] h-full m-auto flex">
            
            <div id="scroll-left" class="text-myGold2 w-[5%] grid place-items-center mr-4">
                <v-icon v-if="isLeftScrollPossible" name="pr-angle-left" class="cursor-pointer" :scale="4" @click="scrollLeft()"/>
            </div>
            
            <div ref="cardSlider" :style="gradient" class="card-slider w-[90%] h-[100%] flex flex-row flex-nowrap overflow-hidden scroll-smooth" >
                <KeepAlive>
                    <CardHandBlock v-for="(card, index) in matchStore.getCardsInZoneForPlayer('hand', player)" :key="card"
                        :name="card.name" :index="index" :mana="card.mana" :service = "service" :player = "player"
                        @send-to-mana="matchStore.sendCardFromHandToMana(index, player, service); slideToTable();"
                        @send-to-battle-zone="matchStore.sendCardFromHandToBattleZone(index, player, service); slideToTable();"
                    />
                </KeepAlive>
            </div>
            
            <div id="scroll-right" class="text-myGold2 w-[5%] grid place-items-center ml-4">
                <v-icon v-if="isRightScrollPossible" name="pr-angle-right" class="cursor-pointer" :scale="4" @click="scrollRight()"/>
            </div>
        </div>
        
        <!-- <div v-if="service.state.matches(player + 'HandLimited')" class="h-[100%]">
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
        </div> -->
    </div>
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

.card-slider {
  /* -webkit-mask-image: -webkit-linear-gradient(left, rgba(0,0,0,1) 90%, rgba(0,0,0,0)); */
  -webkit-mask-image: -webkit-linear-gradient(var(--gradient));
}

</style>