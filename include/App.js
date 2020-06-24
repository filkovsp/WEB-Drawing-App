import {StageBuilder} from "./StageBuilder.js";
import {ShapeComposer} from "./ShapeComposer.js";
/**
 * This must be a Singleton class.
 */
export default class App {
    static #instance;
    #id;
    #stage;
    #shape;

    constructor() {
        if(!App.#instance) {
            App.#instance = this;
        }
        this.#id = App.uuid();

        return App.#instance;
    }

    get id() { return this.#id; }
    get stage() { return this.#stage; }
    
    init(stageRoot) {
        this.#stage = StageBuilder.build(stageRoot);
        this.#shape = ShapeComposer.compose();
    }


    shape(key) {
        return (this.#shape.has(key)) ? 
            this.#shape.get(key) : null;
    }

    layer(key) {
        return (this.#stage.layers.has(key)) ? 
            this.#stage.layers.get(key) : null;
    }

    getInstance() {
        return App.#instance;
    }

    static uuid() {
        /**
         * THis thing has been taken from here:
         * https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php
         */
        let dt = new Date().getTime();
        return 'xxxxxxxx-xxxx-yxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt/16);
            return (c == 'x' ? r : (r&0x3|0x8)).toString(16);
        });
    }
}

const instance = new App();
Object.freeze(instance);

export {instance as App};