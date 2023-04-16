import {createMachine, assign, interpret} from 'xstate';

const matchMachine = createMachine({
    id: 'match',
    initial: 'player1Turn',
    context: {
        canSendToMana: null,
        
        // limited turn attributes
        // basic functionalities: see hand cards, send card to mana/battlezone, draw card
        basicFunctionalitiesBlocked: null,
        // most of the times, while in the limited state, the current player can only choose a specific number of cards
        // these cards will be moved from their zone to another
        // this attribute will be set through a store action
        limitedStateSelectedCardsIndex: null
    },

    states: {
        player1Turn: {
            on: {
                END_TURN: {
                    target: 'player2Turn'
                },
                OPP_TURN_LIMITED: {
                  target: 'player2TurnLimited'
                },
                YOUR_TURN_LIMITED: {
                  target: 'player1TurnLimited'
                }
            }
        },
        player2Turn: {
            on : {
                END_TURN: {
                    target: 'player1Turn'
                },
                OPP_TURN_LIMITED: {
                  target: 'player1TurnLimited'
                },
                YOUR_TURN_LIMITED: {
                  target: 'player2TurnLimited'
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
        setCanSendToMana: assign({canSendToMana: (context, event) => event.value})

    }
    
})

export default matchMachine;