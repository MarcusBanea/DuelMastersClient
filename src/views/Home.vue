<script setup>
import Header from "../components/Header.vue";

import { Swiper, SwiperSlide } from 'swiper/vue';
import { EffectFlip, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-flip';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/swiper-bundle.css';

// In your component's data.
const slides = [
  {
    title: 'Oppenheimer 1',
    content: 'Test content 1',
    // You can also provide a URL for the image.
    image: '../assets/oppenheimer1.jpg'
  },
  {
    title: 'Oppenheimer 2',
    content: 'Test content 2',
    // You can also provide a URL for the image.
    image: '../assets/oppenheimer2.jpg'
  },
  {
    title: 'Oppenheimer 3',
    content: 'Test content 3',
    // You can also provide a URL for the image.
    image: '../assets/oppenheimer3.jpg'
  },
]

const modules = [EffectFlip, Pagination, Navigation];

</script>

<template>
    <Header></Header>
    <!-- <div class="bg-background1 h-[90%] w-full grid">
      <p class="m-auto text-8xl text-myGold2">
          DUEL MASTERS
      </p>        
    </div> -->


    <div class="h-[90%]">
        <Swiper :effect="'flip'" :grab-cursor="true" :pagination="true" :navigation="true" :modules="modules">
        <swiper-slide class="">
            <img src="https://swiperjs.com/demos/images/nature-1.jpg" />
        </swiper-slide>
        <swiper-slide class="">
            <img src="https://swiperjs.com/demos/images/nature-2.jpg" />
        </swiper-slide>
    </Swiper>
    </div>
</template>

<style scoped>

body {
  position: relative;
  height: 100%;
}

body {
  background: #eee;
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  font-size: 14px;
  color: #000;
  margin: 0;
  padding: 0;
}

.swiper {
  width: 300px;
  height: 300px;
  padding: 50px;
}

.swiper-slide {
  background-position: center;
  background-size: cover;
  width: 300px;
  height: 300px;
}

.swiper-slide img {
  display: block;
  width: 100%;
}

</style>
