import AddCardView from "../views/AddCardView.vue";
import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import CardCollection from "../views/CardCollection.vue";
import Packs from "../views/Packs.vue";
import AddPackView from "../views/AddPackView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/addCard",
            name: "addCard",
            component: AddCardView
        },
        {
            path: "/cardCollection",
            name: "cardCollection",
            component: CardCollection
        },
        {
            path: "/packs",
            name: "packs",
            component: Packs
        },
        {
            path: "/addPack",
            name: "addPack",
            component: AddPackView
        }
    ]
});

export default router;