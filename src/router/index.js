import AddCardView from "../views/AddCardView.vue";
import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import CardCollection from "../views/CardCollection.vue";
import Packs from "../views/Packs.vue";
import AddPackView from "../views/AddPackView.vue";
import MyCollection from "../views/MyCollection.vue";
import CombineCardsView from "../views/CombineCardsView.vue";
import MatchView from "../views/MatchView.vue";

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
        },
        {
            path: "/myCollection",
            name: "myCollection",
            component: MyCollection
        },
        {
            path: "/combineCards",
            name: "combineCards",
            component: CombineCardsView
        },
        {
            path: "/match",
            name: "match",
            component: MatchView
        }
    ]
});

export default router;