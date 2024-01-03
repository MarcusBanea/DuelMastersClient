import Api from "./Api";

export default {
    getAllCards() {
        return Api().get('/card/getCollectionCards');
    },
    getUserCollection(username) {
        return Api().get('/card/getUserCollection/' + username);
    },
    getCardImageByCardId(id) {
        return Api().get('/card/getCardImageByImageId2/' + id);
    },
    getAllCardsInUserCollection(username) {
        return Api().get('/card/getAllCardsInUserCollection/' + username);
    },
    getCardImageByName(name) {
        return Api().get('/card/getCardImageByName/' + name);
    }
}