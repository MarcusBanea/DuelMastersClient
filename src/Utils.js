import { toRaw } from "vue";

var utils = {
    getCurrentTime() {
        var currentdate = new Date(); 
        var currentDateTime = 
            currentdate.getHours() + ":"  
            + currentdate.getMinutes() + ":" 
            + currentdate.getSeconds();
    return currentDateTime;
    },
    getCards(player, type, filter, zone) {
        player = this.getTargetFromProxy(player);
        let selectedZone = this.getZone(player, zone);
        let selectedCards = [];
        switch(type) {
            //no filter
            case "0" : {
                for(let i = 0; i < selectedZone.length; i++) {
                    selectedCards.push(zone + "_" + i);
                }
                break;
            }
            //realm
            case "1" : {
                for(let i = 0; i < selectedZone.length; i++) {
                    if(selectedZone[i].realm == filter) {
                        selectedCards.push(zone + "_" + i);
                    }
                }
                break;
            }
            //class
            case "2" : {
                for(let i = 0; i < selectedZone.length; i++) {
                    if(selectedZone[i].class == filter) {
                        selectedCards.push(zone + "_" + i);
                    }
                }
                break;
            }
            //less power
            case "3" : {
                for(let i = 0; i < selectedZone.length; i++) {
                    if(selectedZone[i].power < filter) {
                        selectedCards.push(zone + "_" + i);
                    }
                }
                break;
            }
            //more power
            case "4" : {
                for(let i = 0; i < selectedZone.length; i++) {
                    if(selectedZone[i].power > filter) {
                        selectedCards.push(zone + "_" + i);
                    }
                }
                break;
            }
            //power
            case "5" : {
                for(let i = 0; i < selectedZone.length; i++) {
                    if(selectedZone[i].power == filter) {
                        selectedCards.push(zone + "_" + i);
                    }
                }
                break;
            }
            //TODO Blocker Evolution Tapped Untapped Random Spell
            default : {
                break;
            }
        }
        return selectedCards;
    },
    getZone(player, zone) {
        switch(zone) {
            case "BZ0" : {
                return player.cardsInBattleZone;
            }
            case "MN0" : {
                return player.cardsInMana;
            }
            case "GV0" : {
                return player.cardsInGraveyard;
            }
            case "DK0" : {
                return player.cardsInDeck;
            }
            case "HD0" : {
                return player.cardsInHand;
            }
            default : {
                return null;
            }
        }
    },
    getTargetFromProxy(player) {
        player.cardsInBattleZone = toRaw(player.cardsInBattleZone);
        player.cardsInMana = toRaw(player.cardsInMana);
        player.cardsInHand = toRaw(player.cardsInHand);
        player.cardsInGraveyard = toRaw(player.cardsInGraveyard);
        player.cardsInDeck = toRaw(player.cardsInDeck);
        return player;
    }
}   

export default utils