import {createMachine, assign, interpret} from 'xstate';
import { useMatchStore } from '../stores/matchStore';
import { useLimitedStore } from '../stores/limitedStore';

const matchMachine = createMachine({
    id: 'match',
    initial: 'player1Turn',
    context: {

      numberOfCardsToBeSelected: 0,

      //TODO - used when toggle hand visibility, return to last state
      lastState: null

    },

    states: {
        player1Turn: {
            on: {
                END_TURN: {
                    target: 'player2Turn',
                    actions: () => {let matchStore = useMatchStore(); matchStore.initNewTurn('player1')}
                },
                OPP_TURN_LIMITED: {
                  target: 'player2TurnLimited'
                },
                YOUR_TURN_LIMITED: {
                  target: 'player1TurnLimited',
                  actions: () => {let limitedStore = useLimitedStore(); limitedStore.limit = 2; limitedStore.action = "MTH"; limitedStore.admissibleZone.push("battleZone");}
                },
                SHOW_HAND: {
                  target: 'player1Hand'
                }
            }
        },
        player2Turn: {
            on : {
                END_TURN: {
                    target: 'player1Turn',
                    actions: () => {let matchStore = useMatchStore(); matchStore.initNewTurn('player2')}
                },
                OPP_TURN_LIMITED: {
                  target: 'player1TurnLimited'
                },
                YOUR_TURN_LIMITED: {
                  target: 'player2TurnLimited'
                },
                SHOW_HAND: {
                  target: 'player2Hand'
                }
            }
        },
        player1TurnLimited : {
            on : {
                END_TURN: {
                  target: 'player2Turn'
                },
                YOUR_TURN: {
                  target: 'player1Turn'
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
            on : {
                END_TURN: {
                  target: 'player1Turn'
                },
                YOUR_TURN: {
                  target: 'player2Turn'
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