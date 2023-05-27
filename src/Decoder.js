import { useLimitedStore } from "./stores/limitedStore";
import { useMatchStore } from "./stores/matchStore";

var decoder = {

    /* ability - string consisting of 5 parts separated by "_"
    *  type - choose, get, ...
    *  filter - 0 (no filter), 1 (realm filter), 2 (class filter), ...
    *  number of cards - 0, 1, ...
    *  extra attribute - power (for filter = 3, 4, 5), realm (for filter = 1), ...
    *  zone + player indicator - MNx (x = 0 for current player, x = 1 for opponent, x = 2 for both players)
    */
    decodeAbility(ability, service) {

        let limitedStore = useLimitedStore();
        let matchStore = useMatchStore();

        console.log("Ability = " + ability);

        //separate encoded ability into steps
        //a step represent what a player may do
        //it may be followed be another step, that represents a different action
        let steps = ability.split(/[*]+/);

        //iterate over steps, and separate each step into parts
        //a step consists of 2+ parts
        steps.forEach((step) => {
            console.log("Step = " + step);

            if (step.startsWith("OP:")) {
                limitedStore.tempSwitchToOpponentTurn = true;
                step = step.substring(step.indexOf(":") + 1);
            }

            //simple moving ability, no user action needed
            //TODO - should be removed
            if(step.startsWith("MT")) {
                switch(step) {
                    case "MTM" : {
                        //matchStore.moveCard(cardIndex, cardZone, "mana", cardPlayer, false, service);
                        break;
                    }
                }
            }
            else if (step.startsWith("DRAW")) {
                limitedStore.admissibleDraw = true;
                limitedStore.limit = step[5];
                //TODO - decrement the limit number after each "Draw Card" click
            }
            //no user action needed, so entering the limited state is not necessary
            else if (step.startsWith("GET")) {

                //iterate over parts
                let parts = step.split(/[ ]+/);

                //decode main action
                let mainPart = parts[0].split(/[_]+/);
                console.log("Main part = " + parts[0]);

                console.log("Type of selection = " + mainPart[1]);

                //get zones and player
                let zones = mainPart[4].split(/[-]+/);
                let player = "";
                zones.forEach((zone) => {
                    console.log("zone = " + zone);
                    let encodedPlayer = zone.substring(2);
                    player = this.getPlayer(encodedPlayer, service);
                    console.log("player = " + player);
                });

                //get cards in zones
                let cardsInZones = [];
                zones.forEach((zone) => {
                    let zoneName = this.getZoneFullName(zone.substring(0, 2));
                    player.forEach((playerIndicator) => {
                        let tempCards = matchStore.getCardsInZoneForPlayerWithIndex(zoneName, playerIndicator);
                        //console.log("Temp cards = " + tempCards);
                        cardsInZones = cardsInZones.concat(tempCards);
                    });
                });

                // console.log("Cards before filter:");
                // console.log(cardsInZones);
                // cardsInZones.forEach((card) => {
                //     console.log(card);
                // })


                //get all cards from ability-set zone with ability-set filter
                switch (mainPart[1]) {
                    //no filter
                    case "0": {
                        break;
                    }
                    //realm filter
                    case "1": {
                        let realms = mainPart[3].split(/[/]+/);
                        //get all cards with this realm
                        cardsInZones.forEach((card) => {
                            let cardDetails = card.split(/[_]+/);
                            if (!realms.includes(matchStore.getCardFromZone(cardDetails[0], cardDetails[1], cardDetails[2]).realm)) {
                                cardsInZones.splice(cardsInZones.indexOf(card), 1);
                            }
                        })
                        break;
                    }
                    //class filter
                    case "2": {
                        let classes = mainPart[3].split(/[-]+/);
                        //get all cards with this class
                        cardsInZones.forEach((card) => {
                            let cardDetails = card.split(/[_]+/);
                            if (!classes.includes(matchStore.getCardFromZone(cardDetails[0], cardDetails[1], cardDetails[2]).cardClass)) {
                                cardsInZones.splice(cardsInZones.indexOf(card), 1);
                            }
                        })
                        break;
                    }
                    //less power filter
                    case "3": {
                        //using attacking card's power level
                        //TODO
                        if (mainPart[3] === "X") {
                            mainPart[3] = "2000"; //dummy value
                        }
                        //get all cards with this power level lower than this
                        cardsInZones.forEach((card) => {
                            let cardDetails = card.split(/[_]+/);
                            if (matchStore.getCardFromZone(cardDetails[0], cardDetails[1], cardDetails[2]).power >= mainPart[3]) {
                                cardsInZones.splice(cardsInZones.indexOf(card), 1);
                            }
                        })
                        break;
                    }
                    //more power filter
                    case "4": {
                        //using attacking card's power level
                        //TODO
                        if (mainPart[3] === "X") {
                            mainPart[3] = "2000"; //dummy value
                        }
                        //get all cards with this power level higher than this
                        cardsInZones.forEach((card) => {
                            let cardDetails = card.split(/[_]+/);
                            if (matchStore.getCardFromZone(cardDetails[0], cardDetails[1], cardDetails[2]).power <= mainPart[3]) {
                                cardsInZones.splice(cardsInZones.indexOf(card), 1);
                            }
                        })
                        break;
                    }
                    //exact power filter
                    case "5": {
                        //using attacking card's power level
                        //TODO
                        if (mainPart[3] === "X") {
                            mainPart[3] = "2000"; //dummy value
                        }
                        //get all cards with this same power level as this
                        cardsInZones.forEach((card) => {
                            let cardDetails = card.split(/[_]+/);
                            if (matchStore.getCardFromZone(cardDetails[0], cardDetails[1], cardDetails[2]).power !== mainPart[3]) {
                                cardsInZones.splice(cardsInZones.indexOf(card), 1);
                            }
                        })
                        break;
                    }
                    //type power filter 
                    //types = blocker (6), evolution (7), tapped (8), untapped (9), spell (11)
                    case "6":
                    case "7":
                    case "8":
                    case "9":
                    case "11": {
                        //get all cards with this property
                        //TODO (check block_property, ...)
                        break;
                    }
                    //random
                    case "10": {
                        cardsInZones[0] = cardsInZones[Math.floor(Math.random() * cardsInZones.length)];
                        cardsInZones = cardsInZones.slice(0, 1);
                        break;
                    }
                    case "12": {
                        //top of deck
                        cardsInZones = cardsInZones.slice(0, 1);
                        break;
                    }
                }

                console.log("Cards in zones:");
                console.log(cardsInZones);
                // cardsInZones.forEach((card) => {
                //     console.log(card);
                // })

                let secondPart = parts[1];
                console.log("Second part = " + secondPart);

                //what is happening with these cards? (they will be moved in another zone)
                switch (secondPart) {
                    case "DES": {
                        //move to graveyard
                        cardsInZones.forEach((card) => {
                            let cardDetails = card.split(/[_]+/);
                            //inform server should be true
                            matchStore.moveCard(cardDetails[2], cardDetails[1], "graveyard", cardDetails[0], false, service);
                        })
                        break;
                    }
                    case "MTH": {
                        //move to hand
                        cardsInZones.forEach((card) => {
                            let cardDetails = card.split(/[_]+/);
                            //inform server should be true
                            matchStore.moveCard(cardDetails[2], cardDetails[1], "hand", cardDetails[0], false, service);
                        })
                        break;
                    }
                    case "MTM": {
                        //move to mana
                        cardsInZones.forEach((card) => {
                            let cardDetails = card.split(/[_]+/);
                            //inform server should be true
                            matchStore.moveCard(cardDetails[2], cardDetails[1], "mana", cardDetails[0], false, service);
                        })
                        break;
                    }
                    case "MTS": {
                        //move to shields
                        cardsInZones.forEach((card) => {
                            let cardDetails = card.split(/[_]+/);
                            //inform server should be true
                            matchStore.moveCard(cardDetails[2], cardDetails[1], "shields", cardDetails[0], false, service);
                        })
                        break;
                    }
                }
                limitedStore.resetAdimissibleFields();
                //check if there are more abilities in the ability queue
                if (limitedStore.abilities.length > 0) {
                    limitedStore.sendAbilityToDecodeFromQueueOfAbilities(service);
                }
                else {
                    //return to the last main-turn state
                    console.log("MainTurn = " + limitedStore.mainTurn);
                    if((limitedStore.mainTurn === "player1Turn" && service.state.matches("player1TurnLimited")) ||
                        (limitedStore.mainTurn === "player2Turn" && service.state.matches("player2TurnLimited"))) 
                    {
                        service.send("YOUR_TURN");
                    }
                    else if((limitedStore.mainTurn === "player1Turn" && service.state.matches("player2TurnLimited")) ||
                        (limitedStore.mainTurn === "player2Turn" && service.state.matches("player1TurnLimited"))) {
                        service.send("OPP_TURN");
                    }
                }

            }
            //counter filter, the result number will be used for drawing an amount of cards / selecting cards for another ability
            else if (step.startsWith("CNT")) {
                //TODO
            }
            //some abilities are activated only if a condition is met
            else if (step.startsWith("IF")) {
                //TODO
            }
            else {
                //iterate over parts
                //most of the time, first part will represent the main action (choosing cards :) )
                let parts = step.split(/[ ]+/);

                //decode main action
                let mainPart = parts[0].split(/[_]+/);
                console.log("Main part = " + parts[0]);

                console.log("Type of selection = " + mainPart[1]);
                //set admissible filter
                switch (mainPart[1]) {
                    //no filter
                    case "0": {
                        break;
                    }
                    //realm filter
                    case "1": {
                        let realms = mainPart[3].split(/[/]+/);
                        realms.forEach((realm) => { console.log("Realm filter added = " + realm); limitedStore.admissibleRealm.push(realm) });
                        break;
                    }
                    //class filter
                    case "2": {
                        let classes = mainPart[3].split(/[-]+/);
                        classes.forEach((clas) => { limitedStore.admissibleClass.push(clas) });
                        break;
                    }
                    //less power filter
                    case "3": {
                        //using attacking card's power level
                        //TODO
                        if (mainPart[3] === "X") {
                            mainPart[3] = "2000"; //dummy value
                        }
                        limitedStore.admissibleMaxPower.push(mainPart[3]);
                        break;
                    }
                    //more power filter
                    case "4": {
                        //using attacking card's power level
                        //TODO
                        if (mainPart[3] === "X") {
                            mainPart[3] = "2000"; //dummy value
                        }
                        limitedStore.admissibleMinPower.push(mainPart[3]);
                        break;
                    }
                    //exact power filter
                    case "5": {
                        //using attacking card's power level
                        //TODO
                        if (mainPart[3] === "X") {
                            mainPart[3] = "2000"; //dummy value
                        }
                        limitedStore.admissiblePower.push(mainPart[3]);
                        break;
                    }
                    //type power filter 
                    //types = blocker (6), evolution (7), tapped (8), untapped (9), spell (11)
                    case "6":
                    case "7":
                    case "8":
                    case "9":
                    case "11": {
                        limitedStore.admissibleMaxPower.push(mainPart[3]);
                        break;
                    }
                    //random
                    case "10": {
                        break;
                    }
                }

                //set cards limit
                limitedStore.limit = mainPart[2];

                //set admissible zones and players
                let zones = mainPart[4].split(/[-]+/);
                zones.forEach((zone) => {
                    limitedStore.admissibleZone.push(this.getZoneFullName(zone.substring(0, 2)))
                    let encodedPlayer = zone.substring(2);
                    let admissiblePlayers = this.getPlayer(encodedPlayer, service);
                    admissiblePlayers.forEach((player) => {
                        if (!limitedStore.admissiblePlayer.includes(player)) {
                            limitedStore.admissiblePlayer.push(player);
                        }
                    })
                });

                let secondPart = parts[1];
                console.log("Second part = " + secondPart);

                //set action
                limitedStore.action = secondPart;

                //check if there is any card with the adimissible properties
                //if not, don't switch to limited state and reset limited filters
                let admissibleCardsCounter = 0;
                let noFilterUsed = true;
                limitedStore.admissiblePlayer.forEach((player) => {
                    limitedStore.admissibleZone.forEach((zone) => {
                        //get cards in zone for player
                        matchStore.getCardsInZoneForPlayer(zone, player).forEach((card) => {
                            if(limitedStore.admissibleRealm.length > 0) {
                                limitedStore.admissibleRealm.forEach((realm) => {
                                    if(realm === card.realm) {
                                        admissibleCardsCounter++;
                                    }
                                })
                                noFilterUsed = false;
                            }
                            if(limitedStore.admissibleClass.length > 0) {
                                limitedStore.admissibleClass.forEach((clas) => {
                                    if(clas === card.getCardClass()) {
                                        admissibleCardsCounter++;
                                    }
                                })
                                noFilterUsed = false;
                            }
                            if(limitedStore.admissibleMaxPower !== null) {
                                if(card.getPower() < limitedStore.admissibleMaxPower) {
                                    admissibleCardsCounter++;
                                }
                                noFilterUsed = false;
                            }
                            if(limitedStore.admissibleMinPower !== null) {
                                if(card.getPower() > limitedStore.admissibleMaxPower) {
                                    admissibleCardsCounter++;
                                }
                                noFilterUsed = false;
                            }
                            if(limitedStore.admissiblePower !== null) {
                                if(card.getPower() == limitedStore.admissibleMaxPower) {
                                    admissibleCardsCounter++;
                                }
                                noFilterUsed = false;
                            }
                            if(limitedStore.admissibleType.length > 0) {
                                limitedStore.admissibleType.forEach((type) => {
                                    //TODO
                                })
                                noFilterUsed = false;
                            }

                            if(noFilterUsed === true) {
                                admissibleCardsCounter++;
                            }
                        })
                    })
                })
                if(admissibleCardsCounter >= limitedStore.limit) {
                    //continue
                }
                else {
                    if ((limitedStore.mainTurn === "player1Turn" && service.state.matches("player1TurnLimited")) ||
                        (limitedStore.mainTurn === "player2Turn" && service.state.matches("player2TurnLimited"))) {
                        service.send("YOUR_TURN");
                    }
                    else if ((limitedStore.mainTurn === "player1Turn" && service.state.matches("player2TurnLimited")) ||
                        (limitedStore.mainTurn === "player2Turn" && service.state.matches("player1TurnLimited"))) {
                        service.send("END_TURN");
                    }
                    limitedStore.resetAdimissibleFields();
                }
            }
        })
    },



    getZoneFullName(encodedZone) {
        switch (encodedZone) {
            case "MN": {
                return "manaZone";
            }
            case "BZ": {
                return "battleZone";
            }
            case "SD": {
                return "shields";
            }
            case "HD": {
                return "hand";
            }
            case "GV": {
                return "graveyard";
            }
            //TODO
            case "DK": {
                return "deck";
            }
        }
    },

    getPlayer(encodedPlayer, service) {
        switch (encodedPlayer) {
            case "0": {
                if (service.state.matches("player1TurnLimited")) {
                    return ["player1"];
                }
                else if (service.state.matches("player2TurnLimited")) {
                    return ["player2"];
                }
            }
            case "1": {
                if (service.state.matches("player1TurnLimited")) {
                    return ["player2"];
                }
                else if (service.state.matches("player2TurnLimited")) {
                    return ["player1"];
                }
            }
            case "2": {
                return ["player1", "player2"];
            }
            default : {
                return [];
            }
        }
    }

};

export default decoder;