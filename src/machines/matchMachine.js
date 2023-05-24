import {createMachine, assign, interpret} from 'xstate';
import { useMatchStore } from '../stores/matchStore';
import { useLimitedStore } from '../stores/limitedStore';

const matchMachine = createMachine({
    id: 'match',
    initial: 'player1Turn',
    context: {
    },

    states: {
        player1Turn: {
            entry: [() => {
              let matchStore = useMatchStore();
              matchStore.addMomentToGamelog("It's player1 turn now!");
            }],
            on: {
                END_TURN: {
                    target: 'player2Turn',
                    actions: () => {let matchStore = useMatchStore(); matchStore.initNewTurn('player1')}
                },
                OPP_TURN_LIMITED: {
                  target: 'player2TurnLimited',
                  actions: () => {
                    let limitedStore = useLimitedStore(); 
                    limitedStore.mainTurn = "player1Turn";
                  }
                },
                YOUR_TURN_LIMITED: {
                  target: 'player1TurnLimited',
                  actions: () => {
                    let limitedStore = useLimitedStore(); 
                    limitedStore.mainTurn = "player1Turn";
                  }
                },
                SHOW_HAND: {
                  target: 'player1Hand'
                },
                SHOW_GRAVEYARD: {
                  target: 'player1Graveyard'
                }
            }
        },
        player2Turn: {
            entry: [() => {let matchStore = useMatchStore(); matchStore.addMomentToGamelog("It's player2 turn now!")}],
            on : {
                END_TURN: {
                    target: 'player1Turn',
                    actions: () => {let matchStore = useMatchStore(); matchStore.initNewTurn('player2');}
                },
                OPP_TURN_LIMITED: {
                  target: 'player1TurnLimited',
                  actions: () => {
                    let limitedStore = useLimitedStore(); 
                    limitedStore.mainTurn = "player2Turn";
                  }
                },
                YOUR_TURN_LIMITED: {
                  target: 'player2TurnLimited',
                  actions: () => {
                    let limitedStore = useLimitedStore(); 
                    limitedStore.mainTurn = "player2Turn";
                  }
                },
                SHOW_HAND: {
                  target: 'player2Hand'
                },
                SHOW_GRAVEYARD: {
                  target: 'player2Graveyard'
                }
            }
        },
        player1TurnLimited : {
            entry: [() => {let matchStore = useMatchStore(); matchStore.addMomentToGamelog("Player1 is in limited state...")}],
            on : {
                END_TURN: {
                  target: 'player2Turn'
                },
                YOUR_TURN: {
                  target: 'player1Turn'
                },
                YOUR_TURN_LIMITED: {
                  target: 'player1TurnLimited'
                },
                OPP_TURN_LIMITED: {
                  target: 'player2TurnLimited'
                },
                SHOW_HAND: {
                  target: 'player1HandLimited'
                },
                SHOW_GRAVEYARD: {
                  target: 'player1GraveyardLimited'
                }
            }
        },
        player2TurnLimited: {
            entry: [() => {let matchStore = useMatchStore(); matchStore.addMomentToGamelog("Player2 is in limited state...")}],
            on : {
                END_TURN: {
                  target: 'player1Turn'
                },
                YOUR_TURN: {
                  target: 'player2Turn'
                },
                YOUR_TURN_LIMITED: {
                  target: 'player2TurnLimited'
                },
                OPP_TURN_LIMITED: {
                  target: 'player1TurnLimited'
                },
                SHOW_HAND: {
                  target: 'player2HandLimited'
                },
                SHOW_GRAVEYARD: {
                  target: 'player2GraveyardLimited'
                }
            }
        },
        player1Hand: {
          on: {
            HIDE_HAND: {
              target: 'player1Turn'
            }
          }
        },
        player1HandLimited: {
          on: {
            HIDE_HAND: {
              target: 'player1TurnLimited'
            }
          }
        },
        player2Hand: {
          on: {
            HIDE_HAND: {
              target: 'player2Turn'
            }
          }
        },
        player2HandLimited: {
          on: {
            HIDE_HAND: {
              target: 'player2TurnLimited'
            }
          }
        },
        player1Graveyard : {
          on : {
            HIDE_GRAVEYARD : {
              target: 'player1Turn'
            }
          }
        },
        player1GraveyardLimited : {
          on : {
            HIDE_GRAVEYARD : {
              target: 'player1TurnLimited'
            }
          }
        },
        player2Graveyard : {
          on : {
            HIDE_GRAVEYARD : {
              target: 'player2Turn'
            }
          }
        },
        player2GraveyardLimited : {
          on : {
            HIDE_GRAVEYARD : {
              target: 'player2TurnLimited'
            }
          }
        }
    },

    actions: {
    }
    
})

export default matchMachine;