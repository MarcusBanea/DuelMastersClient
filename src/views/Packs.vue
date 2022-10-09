<script setup>
import { ref } from "@vue/reactivity";
import ImageContainer from "../components/ImageContainer.vue";
import ImageRevealOnClick from "../components/ImageRevealOnClick.vue";
import Header from "../components/Header.vue";

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
</script>





<template>
  <Header :money="user.money" :nickname="user.nickname" ></Header>

  <div id="page" class="bg-myDarkGreen w-screen h-screen grid place-items-center">
    <div id="content" class="bg-myDarkGray w-[75%] h-[640px] grid grid-cols-[15%_85%]">
      <div id="pack-list" class="border-4 myLightGray overflow-scroll h-full">
        <ImageContainer v-for="(pack, index) in packs" :key="pack" :image-url="pack.image" class="cursor-pointer"
          @click="selectPack(index)" />
      </div>

      <div id="pack-content" class="border-4 myLightGray grid grid-rows-[65%_35%]">
        <div id="pack-details" class="grid place-items-center">
          <div id="pack-content-" class="border-4 w-[95%] h-[90%] border-myLightGray flex flex-row">
            <ImageRevealOnClick v-for="card in contentOfPack" :key="card" :image-id="card" container-height="70%" container-width="90%"
              :flip-animation-on="true"/>
          </div>
        </div>

        <div id="pack-options" class="grid grid-cols-[65%_35%]">
          <div id="pack-data-container" class="grid place-items-center">
            <div id="pack-data" class="mb-4 border-4 border-myLightGray w-[90%] h-[90%]">
              <p v-if="selectedPack" class="text-myLightGray font-bold text-xl">
                {{ selectedPack.name }} includes:
              </p>
              <ul v-if="selectedPack" class="
                  text-myLightGray
                  font-bold
                  text-md
                  grid
                  place-items-center
                ">
                <li v-if="selectedPack.numberOfCommonCards" class="list-disc">
                  {{ selectedPack.numberOfCommonCards }} Common cards
                </li>
                <li v-if="selectedPack.numberOfUncommonCards" class="list-disc">
                  {{ selectedPack.numberOfUncommonCards }} Uncommon cards
                </li>
                <li v-if="selectedPack.numberOfRareCards" class="list-disc">
                  {{ selectedPack.numberOfRareCards }} Rare cards
                </li>
                <li v-if="selectedPack.numberOfVeryRareCards" class="list-disc">
                  {{ selectedPack.numberOfVeryRareCards }} Very Rare cards
                </li>
                <li v-if="selectedPack.numberOfSuperRareCards" class="list-disc">
                  {{ selectedPack.numberOfSuperRareCards }} Super Rare cards
                </li>
                <li v-if="selectedPack.numberOfLegendaryCards" class="list-disc">
                  {{ selectedPack.numberOfLegendaryCards }} Legendary cards
                </li>
              </ul>
            </div>
          </div>

          <div class="grid place-items-center">
            <div class="
                mb-4
                -ml-4
                border-4 border-myLightGray
                w-[60%]
                h-[70%]
                grid
                place-items-center
              ">
              <button v-if="selectedPack" @click="openSelectedPack" class="
                  rounded-md
                  bg-myDarkGreen
                  disabled:opacity-50
                  text-myBlack
                  font-bold
                  px-5
                  py-2
                  text-xl-mb-16
                " :disabled="user.money < selectedPack.price" type="submit">
                OPEN
              </button>
              <div v-if="selectedPack">
                <p class="text-myLightGray">PRICE: {{ selectedPack.price }}</p>
              </div>
              <button v-if="openedPack" @click="openSelectedPack" class="
                  rounded-md
                  bg-myDarkGreen
                  disabled:opacity-50
                  text-myBlack
                  font-bold
                  px-5
                  py-2
                  text-xl
                " type="submit">
                STORE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>




<style scoped>

</style>