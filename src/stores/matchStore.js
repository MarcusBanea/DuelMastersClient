import { defineStore } from "pinia";
import utils from "@/Utils";
import { useImageStore } from "./imageStore";
import decoder from "../Decoder";
import { useLimitedStore } from "./limitedStore";

export const useMatchStore = defineStore({
    id: 'match',
    state: () => ({
        player1: null,
        player2: null,

        currentTurnManaAvailable: null,
        currentTurnCanSendToMana: null,
        currentTurnCanDrawCard: null,
        //can be changed by drawing cards abilities
        currentTurnDrawCardLimit: null,

        cardForAttack: null,
        cardToAttack: null,

        gamelog: [],

        isDataLoaded: false
    }),
    actions: {
        async init() {
            const userId = "633f18459af2fa78268b91d4";
            //get players details
            const responsePlayers = await fetch("/api/game/initialize/" + userId + "/" + userId);
            const players = await responsePlayers.json();

            this.player1 = players[0];
            this.player2 = players[1];

            this.gamelog = [];

            this.initCardStoreWithDisplayedCards();

            this.initNewTurn();

            this.isDataLoaded = true;
        },

        initCardStoreWithDisplayedCards() {
            const imageStore = useImageStore();
            let zones = ["battleZone", "manaZone", "hand", "graveyard"];
            zones.forEach((zone) => {
                this.player1[zone].forEach((card) => {
                    imageStore.addCardImage(card.name, card.image);
                })
                this.player2[zone].forEach((card) => {
                    imageStore.addCardImage(card.name, card.image);
                })
            });
        },

        initNewTurn(currentTurn) {
            let limitedStore = useLimitedStore();
            if (!limitedStore.tempSwitchToOpponentTurn) {
                this.currentTurnCanSendToMana = true;
                this.currentTurnManaAvailable = currentTurn === "player1" ? this.player2['manaZone'].length : this.player1['manaZone'].length;
                this.currentTurnCanDrawCard = true;
                this.currentTurnDrawCardLimit = 1;

                let currentPlayer = currentTurn === "player1" ? this.player2 : this.player1;
                currentPlayer["manaZone"].forEach((card) => {
                    card.tapped = false;
                })
            }

            //untapp current turn's player's cards
            this.getCardsInZoneForPlayer("battleZone", currentTurn === "player1" ? "player2" : "player1").forEach((card) => { card.tapped = false; });
        },

        getCardsInZoneForPlayer(zone, player) {
            //console.log("Get cards in zone [" + zone + "] for player [" + player + "]");
            let currentPlayer = player === "player1" ? this.player1 : this.player2;
            return currentPlayer[zone];
        },

        getCardsInZoneForPlayerWithIndex(zone, player) {
            let currentPlayer = player === "player1" ? this.player1 : this.player2;
            let cards = currentPlayer[zone];
            let returnedCards = [];
            cards.forEach((card) => {
                returnedCards.push(player + "_" + zone + "_" + cards.indexOf(card));
            });
            return returnedCards;
        },

        sendCardFromHandToBattleZone(index, player, service) {

            //TODO - "state" object is obsolete, as we can access the state through the "service" object
            service.send("HIDE_HAND");

            let currentPlayer = player === "player1" ? this.player1 : this.player2;

            //tap used mana
            let manaUsed = currentPlayer["hand"][index].mana;
            currentPlayer["manaZone"].forEach((card) => {
                if (!card.tapped && manaUsed > 0) {
                    card.tapped = true;
                    manaUsed--;
                }
            })

            this.currentTurnManaAvailable -= currentPlayer['hand'][index].mana;
            //deactivate card highlighted status
            currentPlayer['hand'][index].selected = false;

            this.addMomentToGamelog(player + " moved card \'" + this.getCardFromZone(player, 'hand', index).name + "\' to battle zone.");

            this.moveCard(index, "hand", "battleZone", player, true, service);

            //this.basicMove(index, "MoveToBattleZone", player);
        },

        sendCardFromHandToMana(index, player, service) {
            service.send("HIDE_HAND");

            this.currentTurnManaAvailable++;
            this.currentTurnCanSendToMana = false;

            this.addMomentToGamelog(player + " added card \'" + this.getCardFromZone(player, 'hand', index).name + "\' to mana.");

            this.moveCard(index, "hand", "manaZone", player, true, null);

            //this.basicMove(index, "MoveToMana", player);
        },

        drawCard(player) {
            this.currentTurnCanDrawCard = false;
            this.moveCard(0, "deck", "hand", player, true, null);
            //this.basicMove(null, "DrawCard", player);

            this.addMomentToGamelog(player + " draws a card.");
        },

        async moveCard(index, zoneFrom, zoneTo, player, informServer, service) {
            let currentPlayer = player === "player1" ? this.player1 : this.player2;
            if (zoneFrom === "deck") {
                const imageStore = useImageStore();
                imageStore.addCardImage(currentPlayer[zoneFrom][index].name, currentPlayer[zoneFrom][index].image);
            }
            if (zoneTo === "manaZone") {
                //TODO - check ability that makes the card be put into mana zone tapped
                currentPlayer[zoneFrom][index].tapped = false;
            }
            currentPlayer[zoneTo].push(currentPlayer[zoneFrom][index]);
            currentPlayer[zoneFrom].splice(index, 1);

            if (informServer) {
                const placementResponse = await fetch("/api/game/moveCard/" + player + "/" + zoneFrom + "/" + zoneTo + "/" + index);
                if (zoneFrom === "hand" && zoneTo === "battleZone") {
                    const placement = await placementResponse.json();
                    if (placement !== undefined && placement !== null && placement !== []) {
                        console.log("placement ability triggered: " + placement.triggeredAbilities);

                        this.decodeAbilityEnterLimitedState(service, placement.triggeredAbilities);
                    }
                }
            }
        },

        //notify server of move/action
        async basicMove(index, move, player) {
            let action = move;
            if (index !== null) {
                action += " " + index;
            }
            action += "/" + player;
            await fetch("/api/game/action/" + action);
        },

        isGraveyardEmpty(player) {
            if (player === 'player1') {
                return this.player1['graveyard'].length == 0 ? true : false;
            }
            return this.player2['graveyard'].length == 0 ? true : false;
        },

        selectCard(player, zone, index) {
            let cardsInZone = this.getCardsInZoneForPlayer(zone, player);
            cardsInZone[index].selected = !cardsInZone[index].selected;
        },

        resetSelectedAttributeOfAllCards() {
            //reset selected attribute from other cards
            let zones = ["battleZone", "manaZone", "shields"];
            zones.forEach((zone) => {
                this.player1[zone].forEach((card) => { card.selected = false; })
                this.player2[zone].forEach((card) => { card.selected = false; })
            });
        },

        async selectCardForAttack(player, index) {
            this.cardForAttack = index;

            let cardsInZone = this.getCardsInZoneForPlayer('battleZone', player);
            cardsInZone[index].selected = !cardsInZone[index].selected;

            //get attack options
            //TODO - remove zone variable, value is always 'battleZone', as you can attack only using battle zone cards
            let responseAttackOptions = await fetch("/api/game/getAttackOptions/" + player + "/" + 'battleZone' + "/" + index);
            let attackOptions = await responseAttackOptions.json();

            //server will provide a list
            //if the list contains only one message, then all cards can be attacked
            //else, only the cards from that list can be attacked
            console.log("Card attack options: " + attackOptions);
            let opponent = player === 'player1' ? this.player2 : this.player1;
            if (attackOptions.at(0) == "NONE") {
                //nothing to do
            }
            else if (attackOptions.at(0) == "ALL") {
                opponent['battleZone'].forEach((card) => { card.selected = true; })
                opponent['shields'].forEach((card) => { card.selected = true; })
            }
            else {
                attackOptions.forEach((card) => {
                    let cardDetails = card.split(/[_]+/);
                    opponent[cardDetails[0]][cardDetails[1]].selected = true;
                });
            }
        },

        async selectedCardToAttack(player, index, zone, service, checkForBlocker) {

            this.cardToAttack = index;

            if (checkForBlocker) {
                //check if opponent has an untapped blocker
                let opponentHasBlocker = false;
                let opponentBattleZoneCards = player == "player1" ? this.player2["battleZone"] : this.player1["battleZone"];
                opponentBattleZoneCards.forEach((card) => {
                    if (!card.tapped && card.type.includes("T0")) {
                        opponentHasBlocker = true;
                    }
                })

                if (opponentHasBlocker) {

                    //reset highlight attribute of opponent's cards
                    opponentBattleZoneCards.forEach((card) => card.selected = false);
                    let opponentShields = player == "player1" ? this.player2["shields"] : this.player1["shields"];
                    opponentShields.forEach((card) => card.selected = false);

                    //opponent enters limited state
                    //can choose only a single blocker
                    //set that blocker as "cardToAttack"
                    let limitedStore = useLimitedStore();
                    let opponentIndicator = player == "player1" ? "player2" : "player1";
                    limitedStore.admissiblePlayer.push(opponentIndicator);
                    limitedStore.admissibleZone.push("battleZone");
                    limitedStore.admissibleType.push("T0");
                    limitedStore.limit = 1;
                    limitedStore.tempSwitchToOpponentTurn = true;
                    //limitedStore.mainTurn = player + "Turn";
                    limitedStore.blockerSelection = true;

                    service.send("OPP_TURN_LIMITED");
                }
                else {
                    this.attack(player, zone, service);
                }
            }
            else {
                this.attack(player, zone, service);
            }

        },

        async attack(player, zone, service) {
            this.addMomentToGamelog(player + " used card \'" + this.getCardFromZone(player, 'battleZone', this.cardForAttack).name
                + "\' to attack!");

            //inform the server of this action
            let actionCard1 = this.cardForAttack + "/" + "battleZone" + "/" + player;
            let actionCard2 = this.cardToAttack + "/" + zone + "/" + (player === "player1" ? "player2" : "player1");

            const awaitingResponse = await fetch("/api/game/2cardAction/" + actionCard1 + "/" + actionCard2 + "/attack");
            let aftermath = await awaitingResponse.json();

            //perform action provided by server
            this.applyAttackChanges(player, aftermath, service);
        },

        applyAttackChanges(player, aftermath, service) {

            //tap attacking card
            let attackingCard = this.getCardFromZone(player, 'battleZone', this.cardForAttack);
            if (attackingCard !== undefined) {
                attackingCard.tapped = true;
            }

            //get attacking player response
            let attackingPlayerResponse = aftermath.card1State;
            switch (attackingPlayerResponse) {
                case "": {

                    break;
                }
                //move player1 last selected card to graveyard
                case "destroyed": {
                    this.addMomentToGamelog("Card \'" + this.getCardFromZone(player, 'battleZone', this.cardForAttack).name + "\' of " + player + " was destroyed!");
                    this.moveCard(this.cardForAttack, "battleZone", "graveyard", player, false, null);
                    break;
                }
                case "MTH": {
                    this.addMomentToGamelog("Card \'" + this.getCardFromZone(player, 'battleZone', this.cardForAttack).name + "\' of " + player + " was moved to hand.");
                    this.moveCard(this.cardForAttack, "battleZone", "hand", player, false, null);
                    break;
                }
                case "MTM": {
                    this.addMomentToGamelog("Card \'" + this.getCardFromZone(player, 'battleZone', this.cardForAttack).name + "\' of " + player + " was moved to mana.");
                    this.moveCard(this.cardForAttack, "battleZone", "manaZone", player, false, null);
                    break;
                }
                case "MTS": {
                    this.addMomentToGamelog("Card \'" + this.getCardFromZone(player, 'battleZone', this.cardForAttack).name + "\' of " + player + " was moved to shields.");
                    this.moveCard(this.cardForAttack, "battleZone", "shields", player, false, null);
                    break;
                }
                case "MTD": {
                    //TODO
                    console.log("MTD not implemented!");
                    break;
                }
                default: {
                    break;
                }
            }

            //get defending player response
            let defendingPlayerResponse = aftermath.card2State;
            let defendingPlayer = player === "player1" ? "player2" : "player1";
            switch (defendingPlayerResponse) {
                case "": {

                    break;
                }
                //move player2 last selected card to graveyard
                case "destroyed": {
                    this.addMomentToGamelog("Card \'" + this.getCardFromZone(defendingPlayer, 'battleZone', this.cardToAttack).name + "\' of " + defendingPlayer + " was destroyed!");
                    this.moveCard(this.cardToAttack, "battleZone", "graveyard", defendingPlayer, false, null);
                    break;
                }
                //shield moved to hand
                case "SMTH": {
                    this.addMomentToGamelog(player + " destroyed a shield!");
                    this.moveCard(this.cardToAttack, "shields", "hand", defendingPlayer, false, null);
                    break;
                }
                case "MTH": {
                    this.addMomentToGamelog("Card \'" + this.getCardFromZone(defendingPlayer, 'battleZone', this.cardToAttack).name + "\' of " + defendingPlayer + " was moved to hand.");
                    this.moveCard(this.cardToAttack, "battleZone", "hand", defendingPlayer, false, null);
                    break;
                }
                case "MTM": {
                    this.addMomentToGamelog("Card \'" + this.getCardFromZone(defendingPlayer, 'battleZone', this.cardToAttack).name + "\' of " + defendingPlayer + " was moved to mana.");
                    this.moveCard(this.cardToAttack, "battleZone", "manaZone", defendingPlayer, false, null);
                    break;
                }
                case "MTS": {
                    this.addMomentToGamelog("Card \'" + this.getCardFromZone(defendingPlayer, 'battleZone', this.cardToAttack).name + "\' of " + defendingPlayer + " was moved to shields.");
                    this.moveCard(this.cardToAttack, "battleZone", "shields", defendingPlayer, false, null);
                    break;
                }
                case "MTD": {
                    //TODO
                    console.log("MTD not implemented!");
                    break;
                }
                default: {
                    break;
                }
            }

            //get possible ability activation
            let ability = aftermath.triggeredAbilities;
            console.log("Ability = " + ability);
            if (ability !== undefined && ability.length > 0) {
                this.decodeAbilityEnterLimitedState(service, ability);
            }
            //reset selected attribute
            this.resetSelectedAttributeOfAllCards();
        },

        decodeAbilityEnterLimitedState(service, ability) {
            let limitedStore = useLimitedStore();
            ability.forEach((wholeAbility) => {
                let player = wholeAbility.substring(0, wholeAbility.indexOf("#") + 1);
                wholeAbility = wholeAbility.substring(wholeAbility.indexOf("#") + 1);
                let abilityParts = wholeAbility.split(/[*]+/);
                abilityParts.forEach((part) => {
                    console.log("Ability sent to queue : " + player + part);
                    limitedStore.abilities.push(player + part);
                })
            })

            //send first ability to decode
            limitedStore.sendAbilityToDecodeFromQueueOfAbilities(service);
        },


        toggleLimitedHighlightStatusOfCards(player, zone, index) {
            let zoneCards = this.getCardsInZoneForPlayer(zone, player);
            zoneCards[index].limitedSelected = !zoneCards[index].limitedSelected;
        },

        getCardFromZone(player, zone, index) {
            return this.getCardsInZoneForPlayer(zone, player)[index];
        },

        addMomentToGamelog(moment) {
            this.gamelog.push(utils.getCurrentTime() + "  -  " + moment);
        }
    }
})