<script setup>
import { computed } from 'vue';
import ImageContainer from './ImageContainer.vue';

const props = defineProps({
    name: String,
    price: String,
    content: String
});

const emits = defineEmits(['openPack']);

function openPack() {
    emits('openPack', props.name);
}

</script>




<template>
    
    <div id="pack_container" class="w-[450px] h-[90%] m-auto grid grid-rows-[75%_25%] flex-none border-r-2">
          
          <div id="pack_image_container" class="m-auto w-[90%] h-[100%] border-b-2">

            <div id="pack_image" class="m-auto w-[75%] h-[90%] border-2">
              
                <ImageContainer container-width="80%" :image-url="name" :is-pack="true"/>

            </div>

          </div>

          <div id="pack_info_container" class="w-full h-full grid grid-rows-[20%_80%]">

            <div id="pack_info_packName_container" class="w-full h-full grid">

              <p id="pack_info_packName_text" class="text-myBeige ml-auto mr-auto mt-auto">
                {{name}}
              </p>

            </div>

            <div id="pack_info_details_container" class="w-full h-full grid">

              <div id="pack_info_details" class="border-2 border-myBeige bg-myBlack w-[90%] h-[90%] m-auto grid grid-cols-[60%_40%]">

                <div id="pack_info_details_text" class="w-full h-24 place-items-center">

                  <p v-for="cardType in content" :key="cardType" class="text-myBeige">
                    {{cardType}}
                  </p>

                </div>

                <div id="pack_info_details_buyButtonAndPrice" class="m-auto">

                  <button class="bg-myBeige text-myBlack font-bold py-2 px-8 rounded" @click="openPack()">
                    BUY
                  </button>

                  <p class="text-myBeige grid place-items-center">
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