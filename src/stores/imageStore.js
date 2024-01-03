import { defineStore } from "pinia";

export const useImageStore = defineStore({
    id: 'image',
    state: () => ({
        
        cardImages: {},

    }),
    actions : {
        addCardImage(key, image) {
            if(this.cardImages[key] === undefined) {
                this.cardImages[key] = this.createBlobFromImage(image);
            }
        },
        
        createBlobFromImage(image) {
            let imgBlob;
            imgBlob = new Blob([this._base64ToArrayBuffer(image)]);
            return URL.createObjectURL(imgBlob);
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