import {createMachine, assign, interpret} from 'xstate';
import { useMatchStore } from '../stores/matchStore';

const matchMachine = createMachine({
    id: 'match',
    initial: 'player1Turn',
    context: {
        isPlayer1HandSelected: false,
        isPlayer2HandSelected: false
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
                  target: 'player1TurnLimited'
                },
                TOGGLE_HAND_VISIBILITY: {
                  actions: [
                    assign({isPlayer1HandSelected: (context) => !(context.isPlayer1HandSelected)})
                  ]
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
                TOGGLE_HAND_VISIBILITY: {
                  actions: [
                    assign({isPlayer2HandSelected: (context) => !(context.isPlayer2HandSelected)})
                  ]
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
            }
        }
    },

    actions: {
      
    }
    
})

export default matchMachine;