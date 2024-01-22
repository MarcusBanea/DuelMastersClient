import { defineStore } from "pinia";
import { useMatchStore } from "@/stores/matchStore";

export const useImageStore = defineStore({
    id: 'image',
    state: () => ({
        cardImages: {},

    }),
    actions : {
        addCardImage(key, image) {
            if(this.cardImages[key] === undefined) {
                // console.log("Adding card image: " + key);
                this.cardImages[key] = this.createBlobFromImage(image.data);

                let matchStore = useMatchStore();
                matchStore.ct++;
            }
            else {
                // console.log("Card image already exists: " + key);
            }
        },

        getImage(key) {
            return this.cardImages[key];
        },
        
        createBlobFromImage(image) {
            let imgBlob;
            imgBlob = new Blob([this._base64ToArrayBuffer(image)]);
            return URL.createObjectURL(imgBlob);
        },

        _base64ToArrayBuffer(base64) {
            try {
                var binary_string = atob(base64);
                var len = binary_string.length;
                var bytes = new Uint8Array(len);
                for (var i = 0; i < len; i++) {
                    bytes[i] = binary_string.charCodeAt(i);
                }
                return bytes.buffer;
            }
            catch(error) {
                console.log(error);
                return null;
            }
        }
    }
})