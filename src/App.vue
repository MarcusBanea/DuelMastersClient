<script setup>

import { RouterView } from 'vue-router';

</script>


<template>
  <div class="wrapper">
    <suspense>
      <RouterView />
    </suspense>
  </div>
</template>


<style scoped>

.wrapper {
  margin: 0;
  width: 100%;
  height: 100vh;
  text-align: center;
  background-color: bisque;
}

.wrapper h1{
  font-size: 25px;
  /* color: black; */
}

</style>