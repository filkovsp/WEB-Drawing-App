/**
 * Canvas documentation:
 * https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
 * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
 */
class Layer {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.zoomStep = 0.2;
        this.shapes = Array();
        this.offset = {x:0, y:0};
        this.zoomFactor = 1;
        this.zoomStep = 0.2;
    }

    /**
     * Draw the shape at coordinastes as provided - this is exact location at the canvas.
     * Returns properties with offset applied to (x, y) position.s
     * @param {Shape} shape 
     * @param {Object} props 
     */
     sketch(shape, props) {
        return shape.draw(this, props);
    }

    /**
     * Draw a new shape on the canvas, and it into the list of "registered shapes",
     * with current offset applied to its (x, y) coordinates.
     * @param {Shape} shape Shape to draw
     * @param {Object} props 
     */
    draw(shape, props) {
        props.offset = {x: this.offset.x, y: this.offset.y};
        props = this.sketch(shape, props);
        this.shapes.push({shape: shape.clone(), props: props});
    }

    /**
     * Draw all shapes that are in the list. With offset shift applied to (x, y) coordinates.
     */
    drawAll() {
        this.shapes.forEach(el => {
            let props = Object.assign({}, el.props);
            props.offset = {x: 0, y: 0}; // <-- potential, bug. TODO: check how can we get rid of it.
            props.x += this.offset.x;
            props.y += this.offset.y;
            el.shape.draw(this, props);
        }, this);
    }

    /**
     * Clears all visible area.
     * visible area is a "phisical" canvas 
     * being projected on to context
     * and scaled to the scale factor.
     */
    clear(keepShapes) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (keepShapes === false) {
            this.shapes = new Array();
        }
    }
    /**
     * Full reset of that drawing area and context.
     */
    clearAndReset() {
        this.offset = {x:0, y:0};
        this.clear(false);
        this.context.resetTransform();
    }

    /**
     * Adds a scaling transformation to the canvas units horizontally and/or vertically
     * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/scale
     * @param {number} x Scale factor for x axis
     * @param {number} y Scale factor for y axis
     */
    setScale(x, y) {
        this.context.scale(x, y);
    }
    
    /**
     * Terurns abs(scale factor) for x axis.
     */
    getZoomFactor() {
        // return Math.abs(this.context.getTransform().a);
        return this.zoomFactor;
    }
    
    setZoomFactor(z) {
        /**
         * TMatrix: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getTransform
         * [a, b, c, d, e, f]:
         * a - scale factor for x axis
         * d - scale factor for y axis
         * e - offset for x axis
         * f - offset for y axis
         */

        this.clear(true);
        // this.context.save(); // not sure yet if this needed

        let matrix = this.context.getTransform();
        matrix.a = Math.sign(matrix.a) * z;
        matrix.d = Math.sign(matrix.a) * z;

        /**
         * context.setTransform(matrix) method
         * resets (overrides) the current transformation to the identity matrix
         */
        this.context.setTransform(matrix);
        this.drawAll();
        // this.context.restore(); // not sure yet if this needed
    }

    zoomIn(event) {
        this.zoomFactor += this.zoomStep;
        this.setZoomFactor(this.zoomFactor.toFixed(1));
        return this.zoomFactor.toFixed(1);
    }

    zoomOut(event) {
        // limit min(Zoom Factor) to a single Zoom Step value:
        if (this.zoomFactor > (2 * this.zoomStep)) {
            this.zoomFactor -= this.zoomStep;
            this.setZoomFactor(this.zoomFactor.toFixed(1));
        }
        return this.zoomFactor.toFixed(1);
    }

    /**
     * Moves shapes their new positions 
     * @param {Number} x Position offset by X axis
     * @param {Number} y Position offset by Y axis
     */
    drag(x, y) {
        this.offset.x = x;
        this.offset.y = y;
        
        this.clear(true);
        this.drawAll();
    }
}

