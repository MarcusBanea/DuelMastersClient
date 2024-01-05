<script setup>
import { computed } from 'vue';
import ImageContainer from './ImageContainer.vue';

const props = defineProps({
    name: String,
    price: Number,
    content: Array
});

const emits = defineEmits(['openPack']);

function openPack() {
  emits('openPack', props.name);
}

</script>


<template>
  <div id="pack_container" class="w-[450px] h-[100%] m-auto grid grid-rows-[75%_25%] flex-none transition duration-1000 ease-in-out hover:text-myBlack text-myGold2 
  hover:bg-gradient-to-b hover:via-myGold2 hover:from-current hover:to-current">
    <div id="pack_image_container" class="m-auto w-[90%] h-[100%]">
      <div id="pack_image" class="grid m-auto w-[75%] h-[100%]">
        <ImageContainer container-width="80%" :image-url="name" :is-pack="true"/>
      </div>
    </div>

    <div id="pack_info_container" class="w-full h-full grid grid-rows-[20%_80%]">
      <div id="pack_info_packName_container" class="w-full h-full grid">
        <p id="pack_info_packName_text" class="ml-auto mr-auto mt-auto text-2xl font-fantasy">
          {{ name }}
        </p>
      </div>

      <div class="w-full h-full grid text-myGold2">
        <div id="pack_info_details" class="border-2 border-myBeige bg-myBlack w-[90%] h-[90%] m-auto grid grid-cols-[60%_40%]">
          <div id="pack_info_details_text" class="w-full h-24 place-items-center">
            <p v-for="cardType in content" :key="cardType" class="">
              {{cardType}}
            </p>
          </div>

          <div id="pack_info_details_buyButtonAndPrice" class="m-auto">
            <button class="bg-myGold2 text-myBlack font-bold py-2 px-8 rounded" @click="openPack()">
              BUY
            </button>
            <p class="grid place-items-center">
              <div class="w-24 grid grid-cols-[50%_50%]">
                {{price}} <img src="../assets/money.png" class="w-[50%]" />
              </div>
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>

</template>




<style scoped>

#pack_info_details_text::-webkit-scrollbar {
    display: none
}

#pack_info_details_text {
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;  /* Firefox */
    overflow-y: scroll;
}

</style>