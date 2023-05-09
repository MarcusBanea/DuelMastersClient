<script setup>
import FormInputString from "../components/Admin/FormInputString.vue";
import FormInputSelect from "../components/Admin/FormInputSelect.vue";
import FormInputCheckbox from "../components/Admin/FormInputCheckbox.vue";
import { computed, ref } from "@vue/runtime-core";
import FormInputFile from "../components/Admin/FormInputFile.vue";
import ImageContainer from "../components/ImageContainer.vue";
import Header from "../components/Header.vue";
import CardImage from "../components/CardImage.vue";
import { useImageStore } from "../stores/imageStore";

//current user
const userId = "633f18459af2fa78268b91d4";
const responseUser = await fetch("/api/users/" + userId);
const user = ref(await responseUser.json());

// const cardNameField = ref("");
// const cardRealmField = ref("");
// const cardClassField = ref("");
// const cardManaField = ref("");
// const cardPowerField = ref("");
// const cardNumberOfShieldsBreakerField = ref("");
// const cardTypefield = ref("");
// const cardAbilityField = ref("");
// const cardRarityField = ref("");
// const cardImageField = ref();

// const cardRealms = ["Light", "Darkness", "Nature", "Fire", "Aqua"];

// const cardLightClasses = ["None", "Angel Command", "Guardian", "Light Bringer", "Berserker", "Rainbow Phantom", "Starnoid", "Mecha Thunder", "Initiate"];
// const cardDarknessClasses = ["None", "Demon Command", "Dark Lord", "Brain Jacker", "Hedrian", "Chimera", "Parasite Worm", "Zombie Dragon", "Survivor"];
// const cardNatureClasses = ["None", "Horned Beast", "Giant Insect", "Survivor", "Giant", "Balloon Mashroom", "Beast Folk"];
// const cardFireClasses = ["None", "Armored Dragon", "Armored Wyvern","Armorloid","Rock Beast", "Human", "Dragonoid"];
// const cardAquaClasses = ["None", "Cyber Virus", "Liquid People", "Leviathan", "Survivor", "Sea Hacker", "Gel Fish", "Cyber Lord"];

// const imageSet = ref(false);

// const isRealmSelected = computed(() => {
//   return cardRealmField.value ? true : false;
// });

// const areFieldsValid = computed(() => {
//   return (
//     cardNameField.value !== "" &&
//     cardRealmField.value !== "" &&
//     cardClassField.value !== "" &&
//     cardManaField.value !== "" &&
//     cardPowerField.value !== "" &&
//     cardNumberOfShieldsBreakerField.value !== "" &&
//     cardTypefield.value !== "" &&
//     cardAbilityField.value !== "" &&
//     cardRarityField.value !== ""
//   );
// });

// const getClassesForSelectedRealm = computed(() => {
//   switch (cardRealmField.value) {
//     case "Light": {
//       return cardLightClasses;
//     }
//     case "Darkness": {
//       return cardDarknessClasses;
//     }
//     case "Nature": {
//       return cardNatureClasses;
//     }
//     case "Fire": {
//       return cardFireClasses;
//     }
//     case "Aqua": {
//       return cardAquaClasses;
//     }
//   }
// });

// async function addNewCardToDB() {
//   const blob = await testImageRenderFromBlob();
//   //console.log(blob);

//   // cardImageField.value = await toBase64(cardImageField.value);
//   // cardImageField.value = cardImageField.value.replace('data:image/jpeg;base64,','');
//   // cardImageField.value = _base64ToArrayBuffer(cardImageField.value);
//   // console.log(cardImageField.value);

//   //imageSet.value = true;

//   var formData = new FormData();

//   // console.log(cardRarityField.value.substring(0, cardRarityField.value.indexOf(" ")));


//   formData.append("file", cardImageField.value);
//   formData.append(
//     "card",
//     new Blob(
//       [
//         JSON.stringify({
//           name: cardNameField.value,
//           cardRealm: cardRealmField.value,
//           cardClass: cardClassField.value,
//           mana: cardManaField.value,
//           power: cardPowerField.value,
//           breakerNumber: cardNumberOfShieldsBreakerField.value,
//           type: cardTypefield.value,
//           ability: cardAbilityField.value,
//           rarity: cardRarityField.value.substring(0, cardRarityField.value.indexOf(" "))
//         }),
//       ],
//       {
//         type: "application/json",
//       }
//     )
//   );

//   var boundary = Math.random().toString().substr(2);

//   fetch("/api/cards/add", {
//     method: "POST",
//     body: formData,
//   })
//     .then(function (response) {
//       if (response.status !== 200) {
//         alert("There was an error!");
//       } else {
//         alert("Request successful");
//       }
//     })
//     .catch(function (err) {
//       alert("There was an error!");
//     });
// }

// const toBase64 = (file) =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });

// function _base64ToArrayBuffer(base64) {
//   var binary_string = window.atob(base64);
//   var len = binary_string.length;
//   var bytes = new Uint8Array(len);
//   for (var i = 0; i < len; i++) {
//     bytes[i] = binary_string.charCodeAt(i);
//   }
//   return bytes.buffer;
// }

// async function blobFromImage() {
//   return new Blob([await new Response(cardImageField.value).arrayBuffer()], {
//     type: cardImageField.value.name,
//   });
// }

// async function testImageRenderFromBlob() {
//   var blob = await blobFromImage();
//   const array = new Uint8Array(await blob.arrayBuffer());
//   return array;
// }

// const getCardImage = computed(() => {
//   if (cardImageField.value !== undefined) {
//     return cardImageField.value;
//   } else {
//     return "";
//   }
// });


const responseTest = await fetch("/api/cards/test");
const test = await responseTest.json();

const imageStore = useImageStore();
imageStore.addCardImage(test.name, test.image);

</script>
    
<template>

  <Header :money="user.money" :nickname="user.nickname" ></Header>

  <div class="h-[90%] w-full bg-myBlack">
    <CardImage :zoom-on-hover-activated="true" :name="test.name" container-width="100%"/>
  </div>

<!-- 
  <div class="bg-myBlack h-[90%]">
    <div class="grid place-items-center h-full">
      <div class="bg-myDarkGreen rounded-2xl w-[90%] h-[90%] border-4 border-myBeige">
        <div>
          <h1 class="font-bold text-myBlack text-2xl mt-2 mb-2">Create card</h1>
        </div>
        <div class="bg-myLightGray shadow-md rounded ">
          <form @submit.prevent="addNewCardToDB">
            <div class="mb-4">
              <FormInputString label="Card name" placeholder="Card name" v-model="cardNameField" />

              <FormInputSelect label="Realm" :options="cardRealms" no-value-selected="Choose a realm"
                v-model="cardRealmField" />

              <FormInputSelect label="Class" :options="getClassesForSelectedRealm" :key="cardRealmField"
                :disabled="!isRealmSelected" no-value-selected="Choose a class" v-model="cardClassField" />

              <FormInputString label="Mana" placeholder="Mana" v-model="cardManaField" />

              <FormInputString label="Power" placeholder="Power" v-model="cardPowerField" />

              <FormInputString label="Ability" placeholder="Ability" v-model="cardAbilityField" />

              <FormInputSelect label="How many shields can break?" :options="[0, 1, 2, 3, 4, 5]"
                no-value-selected="Choose a number" v-model="cardNumberOfShieldsBreakerField" />

              <FormInputSelect label="Type" :options="['Creature', 'Spell', 'Evolution']"
                no-value-selected="Choose a card type" v-model="cardTypefield" />

              <FormInputSelect label="Rarity"
                :options='["0 - Common", "30 - Uncommon", "50 - Rare", "70 - Very Rare", "90 - Super Rare", "100 - Legendary"]'
                no-value-selected="Choose a rarity" v-model="cardRarityField" />

              <FormInputFile label="Image" v-model="cardImageField" />

              <button class="
                  rounded-md
                  bg-myDarkGreen
                  disabled:opacity-50
                  text-myBlack
                  font-bold
                  px-3
                " type="submit" :disabled="!areFieldsValid">
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div> -->
</template>
    
<style scoped>

</style>