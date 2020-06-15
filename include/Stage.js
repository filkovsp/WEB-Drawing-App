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
import {Subject} from './Abstraction.js';
import {Layer} from './Layer.js';

export default class Stage extends Subject {
    constructor(main, model, trace) {
        super();
        this.main = new Layer(main);
        this.model = new Layer(model);
        this.trace = new Layer(trace);
        this.init();
    }

    get offset () { 
        return {
            x: this.stageOffset.x + this.zoomOffset.x,
            y: this.stageOffset.y + this.zoomOffset.y
        };
    }

    init() {
        // initial offset value
        this.stageOffset = {x: 0, y: 0};
        this.zoomFactor = 1;
        this.zoomOffset = {x: 0, y: 0}
        this.zoomStep = 0.2;

        // Default layers:
        this.layers = new Array();
        this.addLayer(this.trace);
        this.addLayer(this.model);
        this.addLayer(this.main);

        // tracing and modelling layers must be semi-tranparent:
        this.trace.context.globalAlpha = 0.3;
        this.model.context.globalAlpha = 0.6;
          
        // Decorate line styles for tarcing and modelling layers:
        this.trace.context.setLineDash([1, 3]);
        this.model.context.setLineDash([1, 2]);
    }

    /**
     * Adds a new layer at the end of the list of Layers.
     * @param {Layer} layer 
     */
    addLayer(layer) {
        return this.layers.push(layer) - 1;
    }

    /**
     * Insert a new layer into list of layers at position = Id. 
     * @param {Layer} layer 
     * @param {Number} id 
     */
    insertLayer(layer, id) {
        this.layers.splice(id, 0, layer);
    }

    /**
     * Removes the drawing layer by its Id.
     * @param {Number} id 
     */
    removeLayer(id) {
        // TODO:
        this.layer.splice(id, 1);
    }

    /**
     * Returns the drawing layer by its Id.
     * @param {Number} id index of the layer to get
     */
    getLayer(id) {
        return this.layers[id];
    }

    /**
     * Cleans the visible scene.
     * @param {Boolean} keepShapes do we need to keep shapes in memory?
     */
    clear(keepShapes) {
        this.main.clear(keepShapes);
        this.model.clear();
    }
        
    /**
     * Full reset and clear of the stage.
     */
    clearAndReset() {
        this.main.clearAndReset();
        this.model.clearAndReset();
        this.init();
    }

    zoomIn(event) {
        this.zoomFactor += this.zoomStep;
        let props = {
            x: (event.mousOver) ? event.x - this.stageOffset.x: this.trace.canvas.width / 2,
            y: (event.mousOver) ? event.y - this.stageOffset.y: this.trace.canvas.height / 2,
            zoom: this.zoomFactor.toFixed(1)
        };

        this.zoomOffset.x -= (props.x - this.zoomOffset.x) / (this.zoomFactor - this.zoomStep) * this.zoomStep;
        this.zoomOffset.y -= (props.y - this.zoomOffset.y ) / (this.zoomFactor - this.zoomStep) * this.zoomStep;

        props.zoomOffset = this.zoomOffset;
        
        this.main.setZoomFactor(props);

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
                x: (event.mousOver) ? event.x - this.stageOffset.x: this.trace.canvas.width / 2,
                y: (event.mousOver) ? event.y - this.stageOffset.y: this.trace.canvas.height / 2,
                zoom: this.zoomFactor.toFixed(1)
            };
    
            this.zoomOffset.x += (props.x - this.zoomOffset.x) / (this.zoomFactor + this.zoomStep) * this.zoomStep;
            this.zoomOffset.y += (props.y - this.zoomOffset.y ) / (this.zoomFactor + this.zoomStep) * this.zoomStep;

            props.zoomOffset = this.zoomOffset;

            this.main.setZoomFactor(props);

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

        this.main.drag(this.stageOffset.x, this.stageOffset.y);
        
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
            -1 * (this.stageOffset.x + this.zoomOffset.x) + this.trace.canvas.width * ( 1- this.zoomFactor) / 2, 
            -1 * (this.stageOffset.y + this.zoomOffset.y) + this.trace.canvas.height * ( 1- this.zoomFactor) / 2
        );
    }

}
export {Stage};