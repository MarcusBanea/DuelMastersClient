import AddCardView from "../views/AddCardView.vue";
import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import CardCollection from "../views/CardCollection.vue";
import Packs from "../views/Packs.vue";
import AddPackView from "../views/AddPackView.vue";
import MyCollection from "../views/MyCollection.vue";
import CombineCardsView from "../views/CombineCardsView.vue";
import MatchView from "../views/MatchView.vue";
import { useUserStore } from "../stores/userStore";
import { ref } from "vue";
import { useImageStore } from "../stores/imageStore";
import MatchViewAI from "../views/MatchViewAI.vue";

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
        },
        {
            path: "/matchAI",
            name: "matchAI",
            component: MatchViewAI
        }
    ]
});

const responseUser = await fetch("/api/users/633f18459af2fa78268b91d4");
const user = ref(await responseUser.json());

router.beforeEach(() => {
    const userStore = useUserStore();
    userStore.init(user.value.nickname, user.value.money);

    const imageStore = useImageStore();
})

export default router;