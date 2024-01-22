import Api from "./Api";

export default {
    initializeMatch(player1Id, player2Id) {
        return Api().get('/match/initialize/' + player1Id + '/' + player2Id);
    }
    
}