/**
 * Canvas documentation:
 * https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
 * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
 */
class Layer {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.shapes = Array();
        this.offset = {x: 0, y: 0};
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
        
        props.offset = {x: 0, y: 0};
        props.zoom = 1;
        this.sketch(shape, props);
        
        props.offset = this.offset;
        props.zoom = this.zoomFactor;
        props = shape.validateProps(props);
        this.shapes.push({shape: shape.clone(), props: props});
    }

    /**
     * Draw all shapes that are in the list. With offset shift applied to (x, y) coordinates.
     */
    drawAll() {
        this.shapes.forEach(el => {
            let props = Object.assign({}, el.props);
            props.offset = this.offset;
            props.zoom = this.zoomFactor;
            el.shape.draw(this, props);
        }, this);
    }

    getZoomFactor() {
        return this.zoomFactor;
    }
    
    setZoomFactor(props) {
        this.zoomFactor = props.zoom;
        this.clear(true);
        // let matrix = this.context.getTransform();
        // matrix.a = Math.sign(matrix.a) * props.zoom;
        // matrix.d = Math.sign(matrix.a) * props.zoom;
        // this.context.setTransform(matrix);
        this.drawAll();
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
        this.offset = {x: 0, y: 0};
        this.clear(false);
        this.context.resetTransform();
    }
}

