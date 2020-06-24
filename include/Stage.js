/**
 * Stage class is just a container for three layers of the Drawing scene.
 * The layers are:
 *   - main layer - this is the pace where the finale drawing comes to
 *   - model layer - temporary place, where we see a shape while we construct it.
 *     after necessary shape is chosen and 1st clict at the drawing canvas made, 
 *     we start "modelling" our shape. we drug mouse over the canvase, watch the sape changing its size, 
 *     and choose the size we want to give for the shape.
 *   - trace layer - decorating layer, just to make fancy cross horizontal and vertical lines, crossing at the mouse pointer.
 * 
 */
import {Subject} from './Observer.js';
import {Layer} from './Layer.js';

export default class Stage extends Subject {
    #layers;

    constructor(layers) {
        super();
        this.#layers = layers;
        this.init();
    }

    get offset () { 
        return {
            x: this.stageOffset.x + this.zoomOffset.x,
            y: this.stageOffset.y + this.zoomOffset.y
        };
    }

    get layers() {return this.#layers; }

    init() {

        // initial offset value
        this.stageOffset = {x: 0, y: 0};
        this.zoomFactor = 1;
        this.zoomOffset = {x: 0, y: 0}
        this.zoomStep = 0.2;

        // tracing and modelling layers must be semi-tranparent:
        this.getLayer("trace").context.globalAlpha = 0.3;
        this.getLayer("model").context.globalAlpha = 0.6;
          
        // Decorate line styles for tarcing and modelling layers:
        this.getLayer("trace").context.setLineDash([1, 3]);
        this.getLayer("model").context.setLineDash([1, 2]);
    }

    /**
     * Adds a new layer at the end of the list of Layers.
     * @param {Layer} layer 
     * @param {uuid} id
     */
    addLayer(layer, id) {
        return this.#layers.set(id, layer);
    }


    /**
     * Removes the drawing layer by its Id.
     * @param {uuid} id 
     */
    removeLayer(id) {
        this.#layers.delete(id);
    }

    /**
     * Returns the drawing layer by its Id.
     * @param {uuid} id index of the layer to get
     */
    getLayer(id) {
        return this.#layers.get(id);
    }

    /**
     * Cleans the visible scene.
     * @param {Boolean} keepShapes do we need to keep shapes in memory?
     */
    clear(keepShapes) {
        /**
         * convert Map into array, filter its recodrs and then convert result back to Map
         */
        new Map(
            [...this.#layers].filter(([k, v]) => !["trace", "model"].includes(k))
        ).forEach((layer, key, map) => {
            layer.clear(keepShapes);
        });
    }
        
    /**
     * Full reset and clear of the stage.
     */
    clearAndReset() {
        new Map(
            [...this.#layers].filter(([k, v]) => !["trace", "model"].includes(k))
        ).forEach((layer, key, map) => {
            layer.clearAndReset();
        });

        this.init();
    }

    zoomIn(event) {
        this.zoomFactor += this.zoomStep;
        let props = {
            x: (event.mousOver) ? event.x - this.stageOffset.x: this.getLayer("trace").canvas.width / 2,
            y: (event.mousOver) ? event.y - this.stageOffset.y: this.getLayer("trace").canvas.height / 2,
            zoom: this.zoomFactor.toFixed(1)
        };

        this.zoomOffset.x -= (props.x - this.zoomOffset.x) / (this.zoomFactor - this.zoomStep) * this.zoomStep;
        this.zoomOffset.y -= (props.y - this.zoomOffset.y ) / (this.zoomFactor - this.zoomStep) * this.zoomStep;

        props.offset = {
            x: this.stageOffset.x + this.zoomOffset.x,
            y: this.stageOffset.y + this.zoomOffset.y
        };
        
        /**
         * Instead of applying new Zoom Factor to only "main" layer 
         * as it used to be in the prev versions, 
         * this.getLayer("main").setZoomFactor(props);
         * 
         * now, we are going to apply it to all layers created by user and main as well.
         */
        
        new Map(
            [...this.#layers].filter(([k, v]) => !["trace", "model"].includes(k))
        ).forEach((layer, key, map) => {
            layer.setZoomFactor(props);
        });

        this.notifyAll({
            offset: {
                x: Math.round(this.stageOffset.x + this.zoomOffset.x),
                y: Math.round(this.stageOffset.y + this.zoomOffset.y)
            }, z : this.zoomFactor.toFixed(1)
        });
    }

    zoomOut(event) {
        if (this.zoomFactor > (2 * this.zoomStep)) {
            this.zoomFactor -= this.zoomStep;
            let props = {
                x: (event.mousOver) ? event.x - this.stageOffset.x: this.getLayer("trace").canvas.width / 2,
                y: (event.mousOver) ? event.y - this.stageOffset.y: this.getLayer("trace").canvas.height / 2,
                zoom: this.zoomFactor.toFixed(1)
            };
    
            this.zoomOffset.x += (props.x - this.zoomOffset.x) / (this.zoomFactor + this.zoomStep) * this.zoomStep;
            this.zoomOffset.y += (props.y - this.zoomOffset.y ) / (this.zoomFactor + this.zoomStep) * this.zoomStep;

            props.offset = {
                x: this.stageOffset.x + this.zoomOffset.x,
                y: this.stageOffset.y + this.zoomOffset.y
            };

            /**
             * Same as Zoom in
             * this.getLayer("main").setZoomFactor(props);
             */
            new Map(
                [...this.#layers].filter(([k, v]) => !["trace", "model"].includes(k))
            ).forEach((layer, key, map) => {
                layer.setZoomFactor(props);
            });

            this.notifyAll({
                offset: {
                    x: Math.round(this.stageOffset.x + this.zoomOffset.x),
                    y: Math.round(this.stageOffset.y + this.zoomOffset.y)
                }, z : this.zoomFactor.toFixed(1)
            });
        }
    }

    /**
     * Drags the whole scene towards the +x and +y position.
     * @param {Number} x Pixels to shift the stage along the x axis
     * @param {Number} y Pixels to shift the stage along the y axis
     */
    drag(x, y) {
        this.stageOffset.x += x;
        this.stageOffset.y += y;

        // same as Zoom above:
        // this.getLayer("main").drag(
        //     this.stageOffset.x + this.zoomOffset.x, 
        //     this.stageOffset.y + this.zoomOffset.y
        // );

        new Map(
            [...this.#layers].filter(([k, v]) => !["trace", "model"].includes(k))
        ).forEach((layer, key, map) => {
            layer.drag(
                this.stageOffset.x + this.zoomOffset.x, 
                this.stageOffset.y + this.zoomOffset.y);
        });
        
        this.notifyAll({
            offset: {
                x: Math.round(this.stageOffset.x + this.zoomOffset.x),
                y: Math.round(this.stageOffset.y + this.zoomOffset.y)
            }, z : this.zoomFactor.toFixed(1)
        });
    }

    /**
     * Centres the whole drawing to the middle of the canvas.
     */
    center() {
        this.drag(
            
            -1 * (this.stageOffset.x + this.zoomOffset.x)
                + this.getLayer("trace").canvas.width * ( 1- this.zoomFactor) / 2, 
            
            -1 * (this.stageOffset.y + this.zoomOffset.y) 
                + this.getLayer("trace").canvas.height * ( 1- this.zoomFactor) / 2
        );
    }

}
export {Stage};