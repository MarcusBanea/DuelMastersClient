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
                  target: 'player1Hand'
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
                  target: 'player2Hand'
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
        player2Hand: {
          on: {
            HIDE_HAND: {
              target: 'player2Turn'
            }
          }
        }
    },

    actions: {
    }
    
})

export default matchMachine;