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