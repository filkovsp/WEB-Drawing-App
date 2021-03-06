/**
 * Canvas documentation:
 * https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
 * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
 */
import {App} from "./App.js";

export default class Layer {
    #app;
    constructor(canvas) {
        this.#app = App.getInstance();
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.shapes = Array();       
        this.zoomFactor = 1;
        this.offset = {x: 0, y: 0};
    }
    
    /**
     * Draws the shape at coordinastes as provided - this is exact location at the canvas.
     * Returns properties with offset applied to (x, y) position.s
     * @param {Object} props 
     */
    sketch(props) {
        this.#app
            .shape(props.shape)
            .draw(this, props);
    }

    /**
     * Draws a new shape on the canvas, and adds it into the list of "registered shapes",
     * with current offset applied to its (x, y) coordinates by shape.validateProps(props).
     * @param {Object} props 
     */
    draw(props) {
        props.offset = {x: 0, y: 0};
        props.zoom = 1;
        this.sketch(props);
        
        props.offset = this.offset; 
        props.zoom = this.zoomFactor;
        props.id = App.constructor.uuid();
        
        this.#app
            .shape(props.shape)
            .validateProps(props);
        
        this.shapes.push(props);
    }
    
    setZoomFactor(props) {
        this.offset = props.offset;
        this.zoomFactor = props.zoom;

        this.clear(true);
        this.context.save();

        let matrix = this.context.getTransform();
        matrix.a = Math.sign(matrix.a) * props.zoom;
        matrix.d = Math.sign(matrix.a) * props.zoom;
        matrix.e = this.offset.x;
        matrix.f = this.offset.y;
        
        this.context.setTransform(matrix);
        
        this.shapes.forEach(props => {
            this.sketch(props);
        }, this);

        this.context.restore();
    }

    /**
     * Moves shape(s) to their new position(s)
     * @param {Number} x Position offset by X axis
     * @param {Number} y Position offset by Y axis
     */
    drag(x, y) {
        this.offset.x = x;
        this.offset.y = y;
        
        this.clear(true);
        this.context.save();
        
        let matrix = this.context.getTransform();
        matrix.a = Math.sign(matrix.a) * this.zoomFactor;
        matrix.d = Math.sign(matrix.a) * this.zoomFactor;
        matrix.e = this.offset.x;
        matrix.f = this.offset.y;
        
        this.context.setTransform(matrix);
        
        this.shapes.forEach(props => {
            this.sketch(props);
        }, this);

        this.context.restore();
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
        this.zoomFactor = 1;
        this.clear(false);
        this.context.resetTransform();
    }
}

export {Layer}
