import { defineStore } from "pinia";

export const useImageStore = defineStore({
    id: 'image',
    state: () => ({
        
        cardImages: {},

    }),
    actions : {
        addCardImage(key, image) {
            console.log(key);
            console.log(image);
            this.cardImages[key] = this.createBlobFromImage(image);
        },
        
        createBlobFromImage(image) {
            let imgBlob;
            imgBlob = new Blob([this._base64ToArrayBuffer(image)]);
            let urlCreator = URL;
            let imgUrl = urlCreator.createObjectURL(imgBlob);
            return imgUrl;
        },

        _base64ToArrayBuffer(base64) {
            var binary_string = atob(base64);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes.buffer;
        }
    }
})