import { defineStore } from "pinia";

export const useMatchStore = defineStore({
    id: 'match',
    state: () => ({
        player1 : null,
        player2 : null,

        currentTurnManaAvailable : null,
        currentTurnCanSendToMana : null,

        cardForAttack : null,
        cardToAttack : null,

        gamelog : [],

        isDataLoaded : false
    }),
    actions : {
        async init() {
            const userId = "633f18459af2fa78268b91d4";
            //get players details
            const responsePlayers = await fetch("/api/game/initialize/" + userId + "/" + userId);
            const players = await responsePlayers.json();

            this.player1 = players[0];
            this.player2 = players[1];

            this.initNewTurn();

            this.isDataLoaded = true;
        },

        initNewTurn(currentTurn) {
            this.currentTurnCanSendToMana = true;
            this.currentTurnManaAvailable = currentTurn === "player1" ? this.player2['manaZone'].length : this.player1['manaZone'].length;
        },

        getCardsInZoneForPlayer(zone, player) {
            let currentPlayer = player === "player1" ? this.player1 : this.player2;
            return currentPlayer[zone];
        },

        sendCardFromHandToBattleZone(index, player) {
            let currentPlayer = player === "player1" ? this.player1 : this.player2;
            this.currentTurnManaAvailable -= currentPlayer['hand'][index].mana;
            //deactivate card highlighted status
            currentPlayer['hand'][index].selected = false;

            this.moveCard(index, "hand", "battleZone", player);
                
            this.basicMove(index, "MoveToBattleZone", player);
        },

        sendCardFromHandToMana(index, player) {
            this.currentTurnManaAvailable++;
            this.currentTurnCanSendToMana = false;

            this.moveCard(index, "hand", "manaZone", player);

            this.basicMove(index, "MoveToMana", player);
        },

        drawCard(player) {
            this.moveCard(0, "deck", "hand", player);

            this.basicMove(null, "DrawCard", player);
        },

        moveCard(index, zoneFrom, zoneTo, player) {
            console.log(player + " distruge cartea " + index + " din " + zoneFrom);
            let currentPlayer = player === "player1" ? this.player1 : this.player2;
            currentPlayer[zoneTo].push(currentPlayer[zoneFrom][index]);
            currentPlayer[zoneFrom].splice(index, 1);
        },

        //notify server of move/action
        async basicMove(index, move, player) {
            let action = move;
            if(index !== null) {
                action += " " + index;
            }
            action += "/" + player;
            this.gamelog.push(action);
            await fetch("/api/game/action/" + action);
        },

        isGraveyardEmpty(player) {
            if(player === 'player1') {
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
                this.player1[zone].forEach((card) => {card.selected = false;})
                this.player2[zone].forEach((card) => {card.selected = false;})
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
            if(attackOptions == "ALL") {
                let opponent = player === 'player1' ? this.player2 : this.player1;
                opponent['battleZone'].forEach((card) => {card.selected = true;})
                opponent['shields'].forEach((card) => {card.selected = true;})
            }
            else {
                //TODO
            }
        },

        async selectedCardToAttack(player, index) {
            this.cardToAttack = index;
            console.log("ATTACK : " + this.cardForAttack);
            console.log("DEFEND : " + this.cardToAttack);

            this.attack(player);
        },

        async attack(player) {
            let action = "Attack ";
            action += this.cardForAttack + " " + this.cardToAttack;

            //inform the server of this action
            const awaitingResponse = await fetch("/api/game/action/" + action + "/" + player);
            let attackResponse = await awaitingResponse.json();

            //perform action provided by server
            this.applyAttackChanges(player, attackResponse);
        },

        applyAttackChanges(player, attackResponse) {
            //get player1 response
            let player1Response = attackResponse.at(0);
            let moveResponse = player1Response.substring(0, 3);
            switch(moveResponse) {
                case "NMV" : {
                    //player1Component.value?.executeAction(player1Response.substring(4));
                    break;
                }
                //move player1 last selected card to graveyard
                case "MTG" : {
                    this.moveCard(player === 'player1' ? this.cardForAttack : this.cardToAttack, "battleZone", "graveyard", 'player1');
                    break;
                }
                default : {
                    break;
                }
            }
        
            //get player2 response
            let player2Response = attackResponse.at(1);
            switch(player2Response) {
                case "" : {
                    //player2Component.value?.executeAction("");
                    break;
                }
                //move player2 last selected card to graveyard
                case "MTG" : {
                    this.moveCard(player === 'player1' ? this.cardToAttack : this.cardForAttack, "battleZone", "graveyard", 'player2');
                    break;
                }
                default : {
                    break;
                }
            }

            //reset selected attribute
            this.resetSelectedAttributeOfAllCards();
        },

        toggleLimitedHighlightStatusOfCards(player, zone, index) {
            let zoneCards = this.getCardsInZoneForPlayer(zone, player);
            zoneCards[index].limitedSelected = !zoneCards[index].limitedSelected;
        },

        getCardFromZone(player, zone, index) {
            return this.getCardsInZoneForPlayer(zone, player)[index];
        }
    }
})