/**
 * Dipatcher class watches the mouse events and "decides" what action must be perfomed based on the event:
 * - move event: 
 *      -- if we just move mouse over the canvas, we trace its move in "tracing" layer. look into trace() method
 *      -- if you've done 1 click and then move the mouse - a sketch of a shape must be modelled as you keep moving mouse.
 *      -- if before moving mouse you've pressed the middle button and keep holding it down - you drag the drawing over the canvas.
 * 
 * - click event:
 *      if we make a click: 1st click starts modelling the chosen shape into "model" layer.
 *      by second click we set the shape as complete and draw the same shape with final props 
 *      into the "main" layer and clear out the "model" layer.
 */
import {Trace} from "./Shape.js";
import {MouseTracker} from "./MouseTracker.js";
import {Subject} from "./Observer.js";

export default class Dispatcher extends Subject{
    constructor(stage) {
        super();
        this.stage = stage;
        this.init();
    }

    /**
     * This is an internal method, not supposed to be called from outside, for now.
     */
    init() {
        this.tracer = new Trace();
        this.tracer.setColor("rgb(150, 0, 0)");
        this.mouseTracker = new MouseTracker();
    }

    /**
     * This is the only method that should be used from outside, by the client of this class.
     * The rest of methods in Dispatcher are for internal use only.
     * @param {Object} event 
     * @param {Object} shape 
     */
    dispatch(event, shape) {
        event.preventDefault();
        this.mouseTracker.track(event);
        this.trace();

        /**
         * TODO:
         * consider implementing the logic below with Observer and/or Command patterns.
         */
        if (event.type == "click" && shape.constructor.name == "AbstractShape" && this.mouseTracker.button == "left") {
            this.mouseTracker.resetClickCount();
            alert("Pick a Shape from the tool bar!");
            // Optional return.
            return false;
        } else if (event.type == "click" && this.mouseTracker.button == "left") {
            if (this.mouseTracker.clickCount == 2) {
                this.stage.model.clear();                
                this.stage.main.draw(shape, {
                    start: this.mouseTracker.start, 
                    end: this.mouseTracker.end
                });
                this.mouseTracker.resetClickCount();
            }
        } else if (event.type == "mousemove" && this.mouseTracker.button != "middle") {
            if(this.mouseTracker.clickCount > 0 && !this.mouseTracker.mouseDown) {
                this.stage.model.clear();
                
                this.stage.model.sketch(shape, {
                    start: this.mouseTracker.start, 
                    end: this.mouseTracker.current
                });
            }
        } else if (event.type == "mousemove" && this.mouseTracker.button == "middle") {
            if (this.mouseTracker.mouseDown) {
                this.stage.drag(
                    this.mouseTracker.moveDelta.x,
                    this.mouseTracker.moveDelta.y
                );
            }
        } else if (event.type === "keyup" && event.key === "Escape") {
            this.stage.model.clear();
            this.mouseTracker.resetClickCount();
        } else if (event.type == "mousewheel" && !this.mouseTracker.mouseDown) {
    
            // TODO: implement Zoom in/out with mouse-wheel:
            if (event.originalEvent.wheelDelta > 0) {
                this.stage.zoomIn(this.mouseTracker)
            } else {
                this.stage.zoomOut(this.mouseTracker)
            }
        } else if (event.type == "mouseout") {
            this.stage.trace.clear();
        }
        
        // Optional return. Just to let the client know that method has worked fine.
        return true;
    }

    /**
     * This is an internal method, not supposed to be called from outside, for now.
     */
    trace() {
        this.notifyAll({
            x: Math.round(this.mouseTracker.x - this.stage.offset.x),
            y: Math.round(this.mouseTracker.y - this.stage.offset.y)
        });

        this.stage.trace.clear();
        this.stage.trace.sketch(this.tracer, {start: this.mouseTracker.current});
        
        // Optional return. Just to let the client know that method has worked fine.
        return true;
    }
}

export {Dispatcher};