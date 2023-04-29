import { useLimitedStore } from "./stores/limitedStore";

var decoder = {

    /* ability - string consisting of 5 parts separated by "_"
    *  type - choose, get, ...
    *  filter - 0 (no filter), 1 (realm filter), 2 (class filter), ...
    *  number of cards - 0, 1, ...
    *  extra attribute - power (for filter = 3, 4, 5), realm (for filter = 1), ...
    *  zone + player indicator - MNx (x = 0 for current player, x = 1 for opponent, x = 2 for both players)
    */
    decodeAbility(ability) {

        let limitedStore = useLimitedStore();

        const abilityFiltersSeparator = "_";
        const abilityPartsSeparator = " ";
        const abilityStepsSeparator = "*";

        console.log(ability);

        //separate encoded ability into steps
        //a step represent what a player may do
        //it may be followed be another step, that represents a different action
        let steps = ability.split(/[*]+/);

        //iterate over steps, and separate each step into parts
        //a step consists of 2+ parts
        steps.forEach((step) => {
            console.log("Step = " + step);
            let parts = step.split(/[ ]+/);

            //iterate over parts
            //most of the time, first part will represent the main action (choosing cards :) )
            
            //decode main action
            let mainPart = parts[0].split(/[_]+/);
            console.log("Main part = " + parts[0]);

            //set admissible filter
            switch(mainPart[1]) {
                //no filter
                case 0 : {
                    break;
                }
                //realm filter
                case 1 : {
                    let realms = mainPart[3].split(/[-]+/);
                    realms.forEach((realm) => {limitedStore.admissibleRealm.push(realm)});
                    break;
                }
                //class filter
                case 2 : {
                    let classes = mainPart[3].split(/[-]+/);
                    classes.forEach((clas) => {limitedStore.admissibleClass.push(clas)});
                    break;
                }
                //less power filter
                case 3 : {
                    limitedStore.admissibleMaxPower.push(mainPart[3]);
                    break;
                }
                //more power filter
                case 4 : {
                    limitedStore.admissibleMinPower.push(mainPart[3]);
                    break;
                }
                //exact power filter
                case 5 : {
                    limitedStore.admissiblePower.push(mainPart[3]);
                    break;
                }
                //type power filter 
                //types = blocker (6), evolution (7), tapped (8), untapped (9), spell (11)
                case 6 :
                case 7 :
                case 8 :
                case 9 :
                case 11 : {
                    limitedStore.admissibleMaxPower.push(mainPart[3]);
                    break;
                }
                //random
                case 10 : {
                    break;
                }
            }

            //set cards limit
            limitedStore.limit = mainPart[2];

            //set admissible zones and players
            let zones = mainPart[4].split(/[-]+/);
            zones.forEach((zone) => {
                limitedStore.admissibleZone.push(this.getZoneFullName(zone.substring(0,2)))
                let encodedPlayer = zone.substring(2);
                let admissiblePlayers = this.getPlayer(encodedPlayer);
                admissiblePlayers.forEach((player) => {
                    if(!limitedStore.admissiblePlayer.includes(player)) {
                        limitedStore.admissiblePlayer.push(player);
                    }
                })

            });

            let secondPart = parts[1];
            console.log("Second part = " + secondPart);

            //set action
            limitedStore.action = secondPart;
            
        })
    },

    getZoneFullName(encodedZone) {
        switch(encodedZone) {
            case "MN" : {
                return "manaZone";
            }
            case "BZ" : {
                return "battleZone";
            }
            case "SD" : {
                return "shields";
            }
            case "HD" : {
                return "hand";
            }
            case "GV" : {
                return "graveyard";
            }
            //TODO
            case "DK" : {
                return "deck";
            }
        }
    },

    getPlayer(encodedPlayer) {
        switch(encodedPlayer) {
            case "0" : {
                return ["player1"];
            }
            case "1" : {
                return ["player2"];
            }
            case "2" : {
                return ["player1", "player2"];
            }
        }
    }

};

export default decoder;