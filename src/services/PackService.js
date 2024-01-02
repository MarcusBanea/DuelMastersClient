import Api from "./Api";

export default {
    getAllPacks() {
        return Api().get('/pack/getAllPacks');
    }
    
}