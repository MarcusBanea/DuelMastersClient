import { createApp } from 'vue';
import App from './App.vue';
import router from "./router";
import {createPinia} from 'pinia';
import './index.css'
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { PrAngleLeft, PrAngleRight } from "oh-vue-icons/icons";

addIcons(PrAngleRight, PrAngleLeft);

const pinia = createPinia();
const app = createApp(App);
app.use(router);
app.use(pinia);
app.component("v-icon", OhVueIcon);
app.mount("#app");