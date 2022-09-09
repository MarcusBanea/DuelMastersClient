<script setup>
import { ref } from "@vue/reactivity";
import ImageContainer from "../components/ImageContainer.vue";

const response = await fetch("/api/packs");
const packs = ref(await response.json());

const responseUser = await fetch("/api/users/631b10bc5f56771e8167ee17");
const user = ref(await responseUser.json());

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
  const response = await fetch("/api/users/openPack/631b10bc5f56771e8167ee17?packType=" + packType);
  contentOfPack.value = [...(await response.json())];
  const responseUser = await fetch("/api/users/631b10bc5f56771e8167ee17");
  user.value = await responseUser.json();
  selectedPack.value = null;
  openedPack.value = true;
  
}
</script>





<template>
  <div
    class="
      absolute
      w-screen
      h-[7%]
      bg-myBlack
      grid
      grid-cols-[45%_10%_45%]
      place-items-center
      text-myLightGray
      border-b-4
    "
  >
    <div class="w-[100%]">
      <p class="float-right min-w-min">
        {{ user.nickname }}
      </p>
    </div>
    <div class="grid place-items-center">
      <img src="../assets/avatar.jpg" class="absolute w-[5%] rounded-full border-4" :title="user.nickname"/>
    </div>
    <div class="w-[100%]">
      <p class="float-left min-w-min">
        {{ user.money }}
      </p>
      <div class="w-48">
        <img src="../assets/money.png" class="w-[15%] h-[15%]" />
      </div>
    </div>
  </div>

  <div
    id="page"
    class="bg-myDarkGreen w-screen h-screen grid place-items-center"
  >
    <div
      id="content"
      class="bg-myDarkGray w-[75%] h-[640px] grid grid-cols-[15%_85%]"
    >
      <div id="pack-list" class="border-4 myLightGray overflow-scroll h-full">
        <ImageContainer
          v-for="(pack, index) in packs"
          :key="pack"
          :image-url="pack.image"
          class="cursor-pointer"
          @click="selectPack(index)"
        />
      </div>

      <div
        id="pack-content"
        class="border-4 myLightGray grid grid-rows-[65%_35%]"
      >
        <div id="pack-details" class="grid place-items-center">
          <div
            id="pack-content-"
            class="border-4 w-[95%] h-[90%] border-myLightGray flex flex-row"
          >
            <ImageContainer
              v-if="contentOfPack"
              v-for="card in contentOfPack"
              :key="card"
              :image-url="card.image"
              :flip-animation-on="true"
              :card-rarity="card.rarity"
            />
          </div>
        </div>

        <div id="pack-options" class="grid grid-cols-[65%_35%]">
          <div id="pack-data-container" class="grid place-items-center">
            <div
              id="pack-data"
              class="mb-4 border-4 border-myLightGray w-[90%] h-[90%]"
            >
              <p v-if="selectedPack" class="text-myLightGray font-bold text-xl">
                {{ selectedPack.name }} includes:
              </p>
              <ul
                v-if="selectedPack"
                class="
                  text-myLightGray
                  font-bold
                  text-md
                  grid
                  place-items-center
                "
              >
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
                <li
                  v-if="selectedPack.numberOfSuperRareCards"
                  class="list-disc"
                >
                  {{ selectedPack.numberOfSuperRareCards }} Super Rare cards
                </li>
                <li
                  v-if="selectedPack.numberOfLegendaryCards"
                  class="list-disc"
                >
                  {{ selectedPack.numberOfLegendaryCards }} Legendary cards
                </li>
              </ul>
            </div>
          </div>

          <div class="grid place-items-center">
            <div
              class="
                mb-4
                -ml-4
                border-4 border-myLightGray
                w-[60%]
                h-[70%]
                grid
                place-items-center
              "
            >
              <button
                v-if="selectedPack"
                @click="openSelectedPack"
                class="
                  rounded-md
                  bg-myDarkGreen
                  disabled:opacity-50
                  text-myBlack
                  font-bold
                  px-5
                  py-2
                  text-xl
                "
                type="submit"
              >
                OPEN
              </button>
              <button
                v-if="openedPack"
                @click="openSelectedPack"
                class="
                  rounded-md
                  bg-myDarkGreen
                  disabled:opacity-50
                  text-myBlack
                  font-bold
                  px-5
                  py-2
                  text-xl
                "
                type="submit"
              >
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