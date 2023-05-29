import { defineStore } from "pinia";
import { useMatchStore } from "./matchStore";
import decoder from "../Decoder";
import { isNavigationFailure } from "vue-router";

export const useLimitedStore = defineStore({
    id: 'limited',
    state: () => ({

        //queue of abilities to be executed
        abilities: [],

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
        //0 - tapped, 1 - untapped, 2 - any
        admissibleTapped: null,

        admissiblePlayer: [],
        admissibleDraw: false,

        tempSwitchToOpponentTurn: false,

        mainTurn: null,

        isExecuteEnabled: false,
        blockerSelection: false,

        isDataLoaded: false
    }),
    actions: {
        limitedSelection(player, zone, index) {
            const matchStore = useMatchStore();
            let card = player + " " + zone + " " + index;
            if (!this.cards.includes(card)) {
                if (this.cards.length < this.limit && this.checkAdmissibleCard(player, zone, index)) {
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
            if(this.cards.length == this.limit) {
                this.isExecuteEnabled = true;
            }
            else {
                this.isExecuteEnabled = false;
            }
        },

        sendAbilityToDecodeFromQueueOfAbilities(service) {
            let abilityPart = this.abilities[0];
            console.log("This ability will be executed = " + abilityPart);
            console.log("There are " + this.abilities.length + " abilities left in queue!");
            if(this.abilities.length === 1) {
                this.abilities = [];
            }
            else {
                this.abilities = this.abilities.slice(1, this.abilities.length);
            }
            let playerForWhichTheAbilityWasActivated = abilityPart.split(/[#]+/)[0];
            console.log(playerForWhichTheAbilityWasActivated + " will execute ability!");
            console.log("Current turn is " + service.state.value);
            //TODO - check current state
            if(service.state.matches(playerForWhichTheAbilityWasActivated + "TurnLimited")) {
                //nothing to do
            }
            else if (service.state.matches(playerForWhichTheAbilityWasActivated + "Turn")) {
                service.send('YOUR_TURN_LIMITED');
            }
            else  {
                service.send('OPP_TURN_LIMITED');
            }
            decoder.decodeAbility(abilityPart.split(/[#]+/)[1], service);
        },

        executeLimitedAction(service) {
            const matchStore = useMatchStore();
            //TODO - update mana available on current turn
            //sort cards by index (in order to keep card-index-zone consistency)
            console.log("Before sort = " + this.cards);
            if(this.cards.length > 1) {
                this.cards.sort();
            }
            this.cards.reverse();
            console.log("After sort = " + this.cards);
            switch (this.action) {
                case "MTH": {
                    console.log("Move cards to hand.");
                    this.cards.forEach((card) => {
                        let cardDetails = card.split(/[ ,]+/);
                        matchStore.moveCard(cardDetails[2], cardDetails[1], "hand", cardDetails[0], false, null);
                    });
                    break;
                }
                case "MTM": {
                    console.log("Move cards to mana.");
                    this.cards.forEach((card) => {
                        let cardDetails = card.split(/[ ,]+/);
                        matchStore.moveCard(cardDetails[2], cardDetails[1], "manaZone", cardDetails[0], false, null);
                    });
                    break;
                }
                case "MTB": {
                    console.log("Move cards to battle zone.");
                    this.cards.forEach((card) => {
                        let cardDetails = card.split(/[ ,]+/);
                        matchStore.moveCard(cardDetails[2], cardDetails[1], "battleZone", cardDetails[0], false, null);
                    });
                    break;
                }
                case "DES": {
                    console.log("Move cards to graveyard.");
                    this.cards.forEach((card) => {
                        let cardDetails = card.split(/[ ,]+/);
                        matchStore.moveCard(cardDetails[2], cardDetails[1], "graveyard", cardDetails[0], false, null);
                    });
                    break;
                }
                case "TAP": {
                    this.cards.forEach((card) => {
                        let cardDetails = card.split(/[ ,]+/);
                        matchStore.getCardFromZone(cardDetails[0], cardDetails[1], cardDetails[2]).tapped = true;
                    });
                    console.log("Card was tapped.");
                    break;
                }
            }
            this.informServerOfAbilityExecution();
            this.resetAdimissibleFields();
            this.checkForAbilitiesLeftToExecute(service);
        },

        checkForAbilitiesLeftToExecute(service) {
            //check if there are more abilities in the ability queue
            if(this.abilities.length > 0) {
                console.log("There are more abilities left to execute! There are : " + this.abilities.length + " left!");
                this.sendAbilityToDecodeFromQueueOfAbilities(service);
            }
            else {
                //return to the last main-turn state
                console.log("No abilities left to execute! Return to original state!");
                if ((this.mainTurn === "player1Turn" && service.state.matches("player1TurnLimited")) ||
                    (this.mainTurn === "player2Turn" && service.state.matches("player2TurnLimited"))) {
                    service.send("YOUR_TURN");
                }
                else if ((this.mainTurn === "player1Turn" && service.state.matches("player2TurnLimited")) ||
                    (this.mainTurn === "player2Turn" && service.state.matches("player1TurnLimited"))) {
                    service.send("END_TURN");
                }
            }
        },

        //check if card is admissible for selection
        checkAdmissibleCard(player, zone, index) {
            //check player
            if (!this.admissiblePlayer.includes(player)) {
                return false;
            }
            //check card zone
            if (this.admissibleZone.length > 0 && !this.admissibleZone.includes(zone)) {
                return false;
            }
            else {
                const matchStore = useMatchStore();
                let card = matchStore.getCardFromZone(player, zone, index);
                //check tapped property
                if((this.admissibleTapped == 0 && !card.tapped) || 
                    (this.admissibleTapped == 1 && card.tapped)) {
                    return false;
                }
                //check card realm
                console.log("Admissible realms = " + this.admissibleRealm);
                console.log("Current realm = " + card.realm.toUpperCase());
                if (this.admissibleRealm.length > 0 && !this.admissibleRealm.includes(card.realm.toUpperCase())) {
                    return false;
                }
                //check card class
                if (this.admissibleClass.length > 0 && !this.admissibleClass.includes(card.cardClass.toUpperCase())) {
                    return false;
                }
                //check card max power
                if (this.admissibleMaxPower !== null && this.admissibleMaxPower < card.power) {
                    return false;
                }
                //check card min power
                if (this.admissibleMiPower !== null && this.admissibleMinPower > card.power) {
                    return false;
                }
                //check card exact power
                if (this.admissiblePower !== null && this.admissiblePower !== card.power) {
                    return false;
                }
                if(this.admissibleType.length > 0) {
                    let admissibleCard = false;
                    card.type.forEach((type) => {
                        console.log("Card type = " + type);
                        if(this.admissibleType.includes(type)) {
                            admissibleCard = true;
                        }
                    })
                    if(admissibleCard == false) {
                        return false;
                    }
                }
            }
            return true;
        },

        chooseBlocker(service) {
            service.send("END_TURN");
            let matchStore = useMatchStore();

            //no blocker chosen, so the attack is not blocked
            if (this.cards.length > 0) {
                let cardDetails = this.cards[0].split(/[ ]+/);
                let currentPlayer = "";
                if (cardDetails[0] == "player1") {
                    currentPlayer = "player2";
                    matchStore.player1["battleZone"][cardDetails[2]].tapped = true;
                }
                else {
                    currentPlayer = "player1";
                    matchStore.player2["battleZone"][cardDetails[2]].tapped = true;
                }
                console.log("Player = " + currentPlayer);
                console.log("Index = " + cardDetails[2]);
                console.log("Zone = " + cardDetails[1]);
                matchStore.cardToAttackZone = "battleZone";
                matchStore.selectedCardToAttack(currentPlayer, cardDetails[2], cardDetails[1], service, false, false);
            }
            else {
                matchStore.selectedCardToAttack(service.state.matches("player1TurnLimited") ? "player1" : "player2", null, null, service, false, true);
            }
            
            this.resetAdimissibleFields();
        },

        async informServerOfAbilityExecution() {
            console.log("Cards = " + this.cards);
            console.log("Action = " + this.action);
            await fetch("/api/game/informServer/" + this.cards + "/" + this.action);
        },

        isSelectionComplete() {
            return this.cards.length === this.limit;
        },

        resetAdimissibleFields() {
            this.cards = [];
            this.action = "";
            this.limit = 0;

            this.admissibleZone = [];
            this.admissibleRealm = [];
            this.admissibleClass = [];
            this.admissibleMaxPower = null;
            this.admissibleMinPower = null;
            this.admissiblePower = null;
            this.admissibleType = [];

            this.admissiblePlayer = [];
            this.admissibleDraw = false;

            this.tempSwitchToOpponentTurn = false;
            this.blockerSelection = false;
        }
    }
});