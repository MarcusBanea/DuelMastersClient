import AddCardView from "../views/AddCardView.vue";
import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import CardCollection from "../views/CardCollection.vue";
import Packs from "../views/Packs.vue";
import AddPackView from "../views/AddPackView.vue";
import MyCollectionV2 from "../views/MyCollectionV2.vue";
import CombineCardsView from "../views/CombineCardsView.vue";
import MatchView from "../views/MatchView.vue";
import { useUserStore } from "../stores/userStore";
import { ref } from "vue";
import { useImageStore } from "../stores/imageStore";
import MatchViewAI from "../views/MatchViewAI.vue";
import Home from "../views/Home.vue";
import UserService from "../services/UserService";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "",
            component: Home
        },
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
            component: MyCollectionV2
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
        },
        {
            path: "/matchAI",
            name: "matchAI",
            component: MatchViewAI
        }
    ]
});

const responseUser = await UserService.getUser("Markus");
const userBasicData = responseUser.data;

router.beforeEach(() => {
    const userStore = useUserStore();
    userStore.init(userBasicData.nickname, userBasicData.money);

    const imageStore = useImageStore();
})
export default router;