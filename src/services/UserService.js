import Api from "./Api";

export default {
    getUser(username) {
        return Api().get('/user/getUserBasicData/' + username);
    },
    getUserCollection(username) {
        return Api().get('/user/getUserCollection/' + username);
    },
    openPack(username, packType) {
        return Api().get('/user/openPack/' + username + "/" + packType);
    }
}