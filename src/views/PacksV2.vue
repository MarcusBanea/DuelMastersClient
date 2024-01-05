<script setup>
import { ref } from "@vue/reactivity";
import Header from "../components/Header.vue";
import PackBlock from "../components/PackBlock.vue";
import { computed } from "@vue/runtime-core";
import CardBlock from "../components/CardBlock.vue";
import { useUserStore } from "../stores/userStore";
import PackService from "../services/PackService";
import UserService from "../services/UserService";

//list of packs
// const response = await fetch("/api/packs");
const responsePacks = await PackService.getAllPacks();
const packs = ref(await responsePacks.data);

const userStore = useUserStore();

//selected pack
const selectedPack = ref(null);
const openedPack = ref(false);
const contentOfPack = ref();

async function openSelectedPack(packType) {
  console.log("Pack open = " + packType);
  selectedPack.value = packs.value.filter(currentPack => currentPack.name == packType);
  //currently using a hardcoded user id, will be replaced with connected user id in the future version
  //const response = await fetch("/api/users/openPack/633f18459af2fa78268b91d4?packType=" + packType);
  const response = await UserService.openPack("Markus", packType);
  contentOfPack.value = [...(await response.json())];

  userStore.money -= selectedPack.value.price;
  openedPack.value = true;
}

function getListOfCardTypesFromPack(pack) {
  let cardTypes = [];
  if (pack.numberOfCommonCards != null) {
    cardTypes.push(pack.numberOfCommonCards + " Common Cards");
  }
  if (pack.numberOfUncommonCards != null) {
    cardTypes.push(pack.numberOfUncommonCards + " Uncommon Cards");
  }
  if (pack.numberOfRareCards != null) {
    cardTypes.push(pack.numberOfRareCards + " Rare Cards");
  }
  if (pack.numberOfVeryRareCards != null) {
    cardTypes.push(pack.numberOfVeryRareCards + " Very Rare Cards");
  }
  if (pack.numberOfSuperRareCards != null) {
    cardTypes.push(pack.numberOfSuperRareCards + " Super Rare Cards");
  }
  if (pack.numberOfLegendaryCards != null) {
    cardTypes.push(pack.numberOfLegendaryCards + " Legendary Cards");
  }
  return cardTypes;
}

const isPackSelected = computed(() => {
  return selectedPack.value != null ? true : false;
});

const packSlider = ref(null);

function scrollLeft() {
  //var packSlider = document.getElementById("page_content_packs");
  // var packSlider = document.querySelector("page_content_packs");
  packSlider.value.scrollLeft = packSlider.value.scrollLeft - 350;
}

function scrollRight() {
  // var packSlider = document.getElementById("page_content_packs");
  // var packSlider = document.querySelector("page_content_packs");
  packSlider.value.scrollLeft = packSlider.value.scrollLeft + 350;
}

</script>


<template>
  <Header></Header>
  <div id="page" class="bg-background1 w-screen h-[90%] grid select-none">

    <!-- <div id="page_title_container" class="w-screen grid place-items-center">
      <p id="page_title_text" class="text-3xl text-myGold2 m-auto">
        SHOP
      </p>
    </div> -->

    <div id="page_content_container" class="w-full grid">

      <div v-if="isPackSelected" :key="isPackSelected" id="page_content_packCards_container"
        class="border-4 border-myBlack w-[1500px] h-[90%] m-auto grid grid-rows-[80%_20%]">

        <div id="pack_cards" class="w-full h-full flex flex-row flex-nowrap overflow-x-auto">

          <CardBlock v-for="card in contentOfPack" :key="card" :image="card" />

        </div>

        <div id="options" class="w=full h-full grid grid-cols-[33%_33%_33%]">

          <div id="store_all" class="bg-myLightBlue border-2 border-myBeige bg-myBlack w-[40%] h-[60%] m-auto">

            <button class="bg-myBeige text-myLightBlue font-bold rounded w-[80%] h-[80%]" @click="storeAllCards()">
              STORE ALL
            </button>

          </div>

          <div id="discard_selected" class="bg-myLightBlue border-2 border-myBeige bg-myBlack w-[40%] h-[60%] m-auto">

            <button class="bg-myLightBlue text-myBeige font-bold rounded w-[80%] h-[80%]" @click="discardSelectedCards()">
              DISCARD SELECTED
            </button>

          </div>

          <div id="discard_all" class="bg-myLightBlue border-2 border-myBeige bg-myBlack w-[40%] h-[60%] m-auto">

            <button class="bg-myLightBlue text-myBeige font-bold rounded w-[80%] h-[80%]" @click="discardAllCards()">
              DISCARD ALL
            </button>

          </div>

        </div>


      </div>

      <div v-else class="backdrop-blur-sm w-[1700px] h-[90%] m-auto flex ">

        <div id="scroll-left" class="text-myGold2 w-[5%] grid place-items-center mr-4">
          <v-icon name="pr-angle-left" class="cursor-pointer" :scale="4" @click="scrollLeft()"/>
        </div>

        <div id="page_content_packs" ref="packSlider" class="pack-slider flex flex-row flex-nowrap overflow-hidden scroll-smooth w-[90%] h-[100%]">

          <PackBlock v-for="pack in packs" :key="pack" :name="pack.name" :price="pack.price"
            :content="getListOfCardTypesFromPack(pack)" @open-pack="openSelectedPack($event, pack.name)" />

        </div>

        <div id="scroll-right" class="w-[5%] grid place-items-center ml-4">
          <v-icon name="pr-angle-right" class="cursor-pointer" :scale="4" @click="scrollRight()"/>
        </div>

      </div>

    </div>


  </div>
</template>




<style scoped>

.pack-slider {
  -webkit-mask-image: -webkit-linear-gradient(left, rgba(0,0,0,1) 90%, rgba(0,0,0,0));
}

</style>