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
        admissibleMaxPower: null,
        admissibleMinPower: null,
        admissiblePower: null,
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
                case "TAP": {
                    this.cards.forEach((card) => {
                        let cardDetails = card.split(/[ ,]+/);
                        console.log("Card player = " + cardDetails[0]);
                        console.log("Card zone = " + cardDetails[2]);
                        console.log("Card index = " + cardDetails[1]);
                        matchStore.getCardFromZone(cardDetails[0], cardDetails[1], cardDetails[2]).tapped = true;
                    });
                    this.cards = [];
                    console.log("Card was tapped.");
                    break;
                }
            }
        },

        //check if card is admissible for selection
        checkAdmissibleCard(player, zone, index) {
            //check player
            if(!this.admissiblePlayer.includes(player)){
                return false;
            }
            //check card zone
            if(this.admissibleZone.length > 0 && !this.admissibleZone.includes(zone)){
                return false;
            }
            else {
                const matchStore = useMatchStore();
                let card = matchStore.getCardFromZone(player, zone, index);
                //check card realm
                console.log("Admissible realms = " + this.admissibleRealm);
                console.log("Current realm = " + card.cardRealm.toUpperCase());
                if(this.admissibleRealm.length > 0 && !this.admissibleRealm.includes(card.cardRealm.toUpperCase())) {
                    return false;
                }
                //check card class
                if(this.admissibleClass.length > 0 && !this.admissibleClass.includes(card.cardClass.toUpperCase())) {
                    return false;
                }
                //check card max power
                if(this.admissibleMaxPower !== null && this.admissibleMaxPower < card.power) {
                    return false;
                }
                //check card min power
                if(this.admissibleMiPower !== null && this.admissibleMinPower > card.power) {
                    return false;
                }
                //check card exact power
                if(this.admissiblePower !== null && this.admissiblePower !== card.power) {
                    return false;
                }
            }
            return true;
        }
    }
});