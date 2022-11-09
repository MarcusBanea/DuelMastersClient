<script setup>
import { ref } from "@vue/reactivity";
import ImageContainer from "../components/ImageContainer.vue";
import ImageRevealOnClick from "../components/ImageRevealOnClick.vue";
import Header from "../components/Header.vue";
import PackBlock from "../components/PackBlock.vue";

//list of packs
const response = await fetch("/api/packs");
const packs = ref(await response.json());

//current user
const responseUser = await fetch("/api/users/633f18459af2fa78268b91d4");
const user = ref(await responseUser.json());

//selected pack
const selectedPack = ref();
const openedPack = ref(false);
const contentOfPack = ref();

function selectPack(index) {
  openedPack.value = false;
  selectedPack.value = packs.value[index];
  contentOfPack.value = null;
}

async function openSelectedPack() {
  let packType = selectedPack.value.name;
  //currently using a hardcoded user id, will be replaced with connected user id in the future version
  const response = await fetch("/api/users/openPack/633f18459af2fa78268b91d4?packType=" + packType);
  contentOfPack.value = [...(await response.json())];


  // for (const element of contentOfPackIds.value) {
  //   const responseCard = await fetch("/api/cards/getOne/" + element);
  //   let tempCardData = await responseCard.json();
  //   //console.log(tempCardData.imageId);
  //   const responseImage = await fetch("/api/file/download/bytes/" + tempCardData.imageId);
  //   let tempImageData = await responseImage.json();
  //   //console.log(tempImageData.content);
  //   contentOfPackImages.value.push(tempImageData.content);
  //   //element.imageUrl = tempImageData.content;
  // }

  const responseUser = await fetch("/api/users/633f18459af2fa78268b91d4");
  user.value = await responseUser.json();
  selectedPack.value = null;
  openedPack.value = true;
}


async function openSelectedPackV2(packType) {
  console.log("pack = " + packType);
  // //currently using a hardcoded user id, will be replaced with connected user id in the future version
  // const response = await fetch("/api/users/openPack/633f18459af2fa78268b91d4?packType=" + packType);
  // contentOfPack.value = [...(await response.json())];

  // const responseUser = await fetch("/api/users/633f18459af2fa78268b91d4");
  // user.value = await responseUser.json();
  // selectedPack.value = null;
  // openedPack.value = true;
}

function getListOfCardTypesFromPack(pack){
  let cardTypes = [];
  if(pack.numberOfCommonCards != null){
    cardTypes.push(pack.numberOfCommonCards + " Common Cards");
  }
  if(pack.numberOfUncommonCards != null){
    cardTypes.push(pack.numberOfUncommonCards + " Uncommon Cards");
  }
  if(pack.numberOfRareCards != null){
    cardTypes.push(pack.numberOfRareCards + " Rare Cards");
  }
  if(pack.numberOfVeryRareCards != null){
    cardTypes.push(pack.numberOfVeryRareCards + " Very Rare Cards");
  }
  if(pack.numberOfSuperRareCards != null){
    cardTypes.push(pack.numberOfSuperRareCards + " Super Rare Cards");
  }
  if(pack.numberOfLegendaryCards != null){
    cardTypes.push(pack.numberOfLegendaryCards + " Legendary Cards");
  }
  return cardTypes;
}
</script>





<template>
  <Header :money="user.money" :nickname="user.nickname" ></Header>
  <div id="page" class="bg-myLightBlue w-screen h-[90%] grid grid-rows-[15%_85%]">
    
    <div id="page_title_container" class="w-screen grid place-items-center">
      <p id="page_title_text" class="text-3xl text-myBeige m-auto">
        SHOP
      </p>
    </div>

    <div id="page_content_container" class="w-full">

      <div id="page_content" class="bg-myDarkBlue border-4 border-myBlack w-[1500px] h-[90%] m-auto flex flex-row flex-nowrap overflow-x-auto">

        <PackBlock v-for="(pack, index) in packs" :key="pack" :name="pack.name" :price="pack.price" :content="getListOfCardTypesFromPack(pack)" :image="pack.image"
          @open-pack="openSelectedPackV2($event, name)"
        />

      </div>

    </div>


  </div>
</template>




<style scoped>

</style>