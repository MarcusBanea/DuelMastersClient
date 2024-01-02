import Api from "./Api";

export default {
    getAllCards() {
        return Api().get('/card/getCollectionCards');
    },
    getCardImageByCardName(name) {
        return Api().get('/card/getCardImageId/' + name);
    },
    getUserCollection(username) {
        return Api().get('/card/getUserCollection/' + username);
    },
    getCardImageByCardId(id) {
        return Api().get('/card/getCardImageByImageId2/' + id);
    }
}