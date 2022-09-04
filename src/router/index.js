import AddCardView from "../views/AddCardView.vue";
import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import CardCollection from "../views/CardCollection.vue";

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
        }
    ]
});

export default router;