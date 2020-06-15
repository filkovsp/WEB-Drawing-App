export default class Display {
    constructor() {
        // super();
    }

    update(data) {
        Object.keys(data).forEach(key => {
            if(typeof data[key] == "object") {
                this.update(data[key]);
            } else if (this.hasOwnProperty(key)) {
                this[key].innerText = data[key];
            }
        });
    }

    addKey(key, obj) {
        this[key] = obj;
    }
}

export {Display};