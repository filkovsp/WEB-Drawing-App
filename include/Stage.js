/**
 * Stage class is just a container for three layers of the Drawing scene.
 * The layers are:
 *   - main layer - this is the pace where the finale drawing comes to
 *   - model layer - temporary place, where we see a shape while we construct it.
 *     after necessary shape is chosen and 1st clict at the drawing canvas made, 
 *     we start "modelling" our shape. we drug mouse over the canvase, watch the sape changing its size, 
 *     and choose the size we want to give for the shape.
 *   - trace layer - decorating layer, just to make fancy cross horizontal and vertical lines, crossing at the mouse pointer.
 */
class Stage {
    constructor(main, model, trace) {
        this.main = new Layer(main);
        this.model = new Layer(model);
        this.trace = new Layer(trace);
        this.layers = new Array();
        this.init();
    }

    init() {
        // initial offset value
        this.offset = {x: 0, y: 0};

        // default layers:
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
     * Remuves the drawing layer by its Id.
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
        this.offset = {x: 0, y: 0};
    }
        
    /**
     * Full reset of that stage.
     */
    clearAndReset() {
        this.main.clearAndReset();
        this.model.clearAndReset();
        this.init();
    }

    zoomIn(event) {
        this.main.zoomIn(event);
    }

    zoomOut(event) {
        this.main.zoomOut(event);
    }

    /**
     * Drags the whole scene towards the +x and +y position.
     * @param {Number} x Pixels to shift the stage along the x axis
     * @param {Number} y Pixels to shift the stage along the y axis
     */
    drag(x, y) {
        this.offset.x += x;
        this.offset.y += y;
        /**
         * TODO:
         * apply sdragging to all layers except tracing and modelling ones.
         */
        this.main.drag(this.offset.x, this.offset.y);
        $("input[name='ox']").val(this.offset.x);
        $("input[name='oy']").val(this.offset.y);
    }
}
