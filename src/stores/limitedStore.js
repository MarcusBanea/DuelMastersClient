import { defineStore } from "pinia";
import { useMatchStore } from "./matchStore";

export const useLimitedStore = defineStore({
    id: 'limited',
    state: () => ({
        //TODO - will be set by ability decoding
        limit: 0,
        cards: [],
        action: "",

        admissibleZone: [],
        admissibleRealm: [],
        admissibleClass: [],
        admissibleMaxPower: [],
        admissibleMinPower: [],
        admissiblePower: [],
        admissibleType: [],

        admissiblePlayer: [],

        isDataLoaded : false
    }),
    actions : {
        limitedSelection(player, zone, index) {
            const matchStore = useMatchStore();
            let card = player + " " + zone + " " + index;
            if(!this.cards.includes(card)) {
                if(this.cards.length < this.limit && this.checkAdmissibleCard(player, zone, index)) {
                    console.log("Card added to limited selection: " + card);
                    this.cards.push(card);
                    matchStore.toggleLimitedHighlightStatusOfCards(player, zone, index);
                }
                else {
                    console.log("Invalid selection");
                }
            }
            else {
                console.log("Card removed from limited selection: " + card);
                this.cards.splice(this.cards.indexOf(card), 1);
                matchStore.toggleLimitedHighlightStatusOfCards(player, zone, index);
            }
        },

        executeLimitedAction() {
            const matchStore = useMatchStore();
            //TODO - update mana available on current turn
            switch(this.action) {
                case "MTH": {
                    console.log("Move cards to hand.");
                    this.cards.forEach((card) => {
                        let cardDetails = card.split(/[ ,]+/);

                        matchStore.moveCard(cardDetails[2], cardDetails[1], "hand", cardDetails[0]);
                    });
                    this.cards = [];
                    break;
                }
                case "MTM": {
                    console.log("Move cards to mana.");
                    break;
                }
                case "MTB": {
                    console.log("Move cards to battle zone.");
                    break;
                }
                case "MTG": {
                    console.log("Move cards to graveyard.");
                    break;
                }
            }
        },

        //check if card is admissible for selection
        checkAdmissibleCard(player, zone, index) {
            //check card zone
            if(this.admissibleZone.length > 0 && !this.admissibleZone.includes(zone)){
                return false;
            }
            else {
                const matchStore = useMatchStore();
                let card = matchStore.getCardFromZone(player, zone, index);
                //check card realm
                if(!this.admissibleRealm.length > 0 && this.admissibleRealm.includes(card.realm)) {
                    return false;
                }
                //check card class
                if(this.admissibleClass.length > 0 && !this.admissibleClass.includes(card.class)) {
                    return false;
                }
            }
            return true;
        }
    }
});