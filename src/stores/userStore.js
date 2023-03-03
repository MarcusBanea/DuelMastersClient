import { defineStore } from "pinia";

export const useUserStore = defineStore({ 
    id: 'user', 
    state : () => ({
        name: "userName",
        money: "userMoney"
    }),
    actions : {
        init(userName, userMoney) {
            this.name = userName;
            this.money = userMoney;
        },

        setName(userName) {
            this.name = userName;
        },

        setMoney(userMoney) {
            this.money = userMoney;
        }
    }
})