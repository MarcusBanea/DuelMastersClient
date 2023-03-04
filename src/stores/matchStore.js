import { defineStore } from "pinia";

export const useMatchStore = defineStore({
    id: 'match',
    state: () => ({
        player1 : null,
        player2 : null,

        turn : null,

        currentTurnManaAvailable : null,
        currentTurnCanSendToMana : null,

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
            this.changeTurn();

            this.isDataLoaded = true;
        },

        changeTurn() {
            this.turn = this.turn === "BOTTOM" ? "TOP" : "BOTTOM";
            this.currentTurnCanSendToMana = true;
            this.currentTurnManaAvailable = this.turn === "BOTTOM" ? this.player1['manaZone'].length : this.player2['manaZone'].length;
        },

        itsTurnOf(playerIndicator) {
            return playerIndicator == this.turn ? true : false;
        },

        sendCardFromHandToBattleZone(index, player) {
            let currentPlayer = player === "player1" ? this.player1 : this.player2;
            this.currentTurnManaAvailable -= currentPlayer['hand'][index].mana;
            let cardToAdd = currentPlayer['hand'][index];
            //deactivate card highlighted status
            cardToAdd.selected = false;

            this.moveCard(index, "hand", "battleZone", player);
                
            this.basicMove(index, "MoveToBattleZone", player);
        },

        sendCardFromHandToMana(index, player) {
            this.moveCard(index, "hand", "manaZone", player);

            this.currentTurnManaAvailable++;
            this.currentTurnCanSendToMana = false;

            this.basicMove(index, "MoveToMana", player);
        },

        moveCard(index, zoneFrom, zoneTo, player) {
            let currentPlayer = player === "player1" ? this.player1 : this.player2;
            currentPlayer[zoneTo].push(currentPlayer[zoneFrom][index]);
            currentPlayer[zoneFrom].splice(index, 1);
        },

        drawCard(player) {
            this.moveCard(0, "deck", "hand", player);

            this.basicMove(null, "DrawCard", player);
        },

        //notify server of move/action
        async basicMove(index, move, player) {
            let action = move;
            if(index !== null) {
                action += " " + index;
            }
            await fetch("/api/game/action/" + action +  "/" + player);
        },

        isGraveyardEmpty(player) {
            if(player === 'player1') {
                return this.player1['graveyard'].length == 0 ? true : false;
            }
            return this.player2['graveyard'].length == 0 ? true : false;
        }

    }
})