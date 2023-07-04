<script setup>
import { ref } from "@vue/reactivity";
import ImageContainer from "../components/ImageContainer.vue";
import ImageRevealOnClick from "../components/ImageRevealOnClick.vue";
import Header from "../components/Header.vue";
import PackBlock from "../components/PackBlock.vue";
import { computed } from "@vue/runtime-core";
import CardBlock from "../components/CardBlock.vue";
import ImageContainerV2 from "../components/ImageContainerV2.vue";

//collection
const userId = "633f18459af2fa78268b91d4";
const responseCollection = await fetch("/api/users/getCollection/" + userId);
const collection = ref(await responseCollection.json());

const card1Clicked = ref(false);
const card2Clicked = ref(false);
const card3Clicked = ref(false);

const card1ImageId = ref(null);
const card2ImageId = ref(null);
const card3ImageId = ref(null);
const cardResultImageId = ref(null);

const isCard1Clicked = computed(() => {
    return card1Clicked.value == true ? true : false;
});

const isCard2Clicked = computed(() => {
    return card2Clicked.value == true ? true : false;
});

const isCard3Clicked = computed(() => {
    return card3Clicked.value == true ? true : false;
});

const isCard1Selected = computed(() => {
    return card1ImageId.value !== null  ? true : false;
});

const isCard2Selected = computed(() => {
    return card2ImageId.value !== null  ? true : false;
});

const isCard3Selected = computed(() => {
    return card3ImageId.value !== null  ? true : false;
});

const isCardResultGenerated = computed(() => {
    return cardResultImageId.value !== null ? true : false;
})

async function selectCardToCombine(combineCardNumber, cardIndex) {
    switch(combineCardNumber) {
        case 1 : {
            card1ImageId.value = collection.value[cardIndex].imageId;
            break;
        }
        case 2 :{
            card2ImageId.value = collection.value[cardIndex].imageId;
            break;
        }
        case 3 : {
            card3ImageId.value = collection.value[cardIndex].imageId;
            break;
        }
        default : {
            break;
        }
    }
    collection.value[cardIndex].numberOfCards--;
    if(collection.value[cardIndex].numberOfCards == 0) {
        collection.value.splice(cardIndex, 1);
    }
}

async function combineCards() {
    //generated random card
    //TODO: generated card based on the combining cards properties
    const responseCard = await fetch("/api/cards/random");
    const cardTemp = await responseCard.json();
    cardResultImageId.value = cardTemp.imageId;
}

</script>



<template>
    <Header></Header>
    <div id="page" class="bg-myLightBlue w-screen h-[90%] grid grid-rows-[15%_85%]">
        <div id="page_title_container" class="w-screen grid place-items-center">
            <p id="page_title_text" class="text-3xl text-myBeige m-auto">
                COMBINE
            </p>
        </div>
        <div id="page_content_container" class="w-full">
            <div id="page_content_combining_container" class="bg-myDarkBlue border-4 border-myBlack w-[1500px] h-[90%] m-auto grid grid-cols-4">
                <div id="card1_container" class="w-full h-full grid m-auto">
                    <div v-if="isCard1Selected" :key="isCard1Selected" class="border-2 border-myBeige bg-myBlack w-[60%] h-[60%] grid m-auto">
                        <ImageContainerV2 container-width="100%" container-height="80%" :image-id="card1ImageId"/>
                    </div>
                    <div v-else-if="isCard1Clicked" class="border-2 border-myBeige bg-myBlack w-[80%] h-[500px] grid m-auto">
                        <ul class="text-myBeige overflow-y-scroll">
                            <li v-for="(card, index) in collection" :key="card" class="hover:bg-myBeige hover:text-myBlack border-b-2 border-myBeige grid grid-cols-[80%_20%]"
                                @click="selectCardToCombine(1, index)">
                                <p class="border-r-2 border-myBeige">
                                    {{card.name}}
                                </p>
                                <p>
                                    {{card.numberOfCards}}
                                </p>
                            </li>
                        </ul>
                    </div>
                    <div v-else id="card1" class="border-2 border-myBeige bg-myBlack w-[60%] h-[60%] grid m-auto cursor-pointer" @click="card1Clicked = true">
                        <div class="w-[100%] h-min m-auto text-myBeige">
                            SELECT CARD 1
                        </div>      
                    </div>
                </div>
                <div id="card2_container" class="w-full h-full grid m-auto">
                    <div v-if="isCard2Selected" :key="isCard2Selected" class="border-2 border-myBeige bg-myBlack w-[60%] h-[60%] grid m-auto">
                        <ImageContainerV2 container-width="100%" container-height="80%" :image-id="card2ImageId"/>
                    </div>
                    <div v-else-if="isCard2Clicked" class="border-2 border-myBeige bg-myBlack w-[80%] h-[500px] grid m-auto">
                        <ul class="text-myBeige overflow-y-scroll">
                            <li v-for="(card, index) in collection" :key="card" class="hover:bg-myBeige hover:text-myBlack border-b-2 border-myBeige grid grid-cols-[80%_20%]"
                                @click="selectCardToCombine(2, index)">
                                <p class="border-r-2 border-myBeige">
                                    {{card.name}}
                                </p>
                                <p>
                                    {{card.numberOfCards}}
                                </p>
                            </li>
                        </ul>
                    </div>
                    <div v-else id="card2" class="border-2 border-myBeige bg-myBlack w-[60%] h-[60%] grid m-auto cursor-pointer" @click="card2Clicked = true">
                        <div class="w-[100%] h-min m-auto text-myBeige">

                            SELECT CARD 2

                        </div>    
                    </div>
                </div>
                <div id="card3_container" class="w-full h-full grid m-auto">
                    <div v-if="isCard3Selected" :key="isCard3Selected" class="border-2 border-myBeige bg-myBlack w-[60%] h-[60%] grid m-auto">
                        <ImageContainerV2 container-width="100%" container-height="80%" :image-id="card3ImageId"/>
                    </div>
                    <div v-else-if="isCard3Clicked" class="border-2 border-myBeige bg-myBlack w-[80%] h-[500px] grid m-auto">
                        <ul class="text-myBeige overflow-y-scroll">
                            <li v-for="(card, index) in collection" :key="card" class="hover:bg-myBeige hover:text-myBlack border-b-2 border-myBeige grid grid-cols-[80%_20%]"
                                @click="selectCardToCombine(3, index)">
                                <p class="border-r-2 border-myBeige">
                                    {{card.name}}
                                </p>
                                <p>
                                    {{card.numberOfCards}}
                                </p>
                            </li>
                        </ul>
                    </div>
                    <div v-else id="card3" class="border-2 border-myBeige bg-myBlack w-[60%] h-[60%] grid m-auto cursor-pointer" @click="card3Clicked = true">
                        <div class="w-[100%] h-min m-auto text-myBeige">
                            SELECT CARD 3
                        </div>    
                    </div>
                </div>
                <div id="cardResult_container" class="w-full h-full bg-myBeige bg-opacity-70 border-l-4 border-black grid m-auto">
                    <div v-if="isCardResultGenerated" :key="isCardResultGenerated" class="border-2 border-myBeige bg-myBlack w-[60%] h-[60%] grid m-auto">
                        <ImageContainerV2 container-width="100%" container-height="80%" :image-id="cardResultImageId"/>
                    </div>
                    <div v-else-if="!(isCard1Selected && isCard2Selected && isCard3Selected)" id="cardResult" class="border-2 border-myBeige bg-myBlack w-[60%] h-[60%] grid m-auto">
                        <div class="w-[100%] h-min m-auto text-myBeige">
                            CANNOT COMBINE YET
                        </div>       
                    </div>
                    <div v-else id="cardResult" class="border-2 border-myBeige bg-myBlack w-[60%] h-[60%] grid m-auto cursor-pointer" @click="combineCards">
                        <div class="w-[100%] h-min m-auto text-myBeige">
                            COMBINE CARDS
                        </div>      
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
