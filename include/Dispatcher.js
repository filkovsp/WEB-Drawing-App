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
import {MouseTracker} from "./MouseTracker.js";
import {Subject} from "./Observer.js";

export default class Dispatcher extends Subject {
    #app;

    constructor(app) {
        super();
        this.#app = app;
        this.init();
    }

    /**
     * This is an internal method, not supposed to be called from outside, for now.
     */
    init() {
        this.mouseTracker = new MouseTracker();
    }

    /**
     * This is the only method that should be used from outside, by the client of this class.
     * The rest of methods in Dispatcher are for internal use only.
     * @param {Object} event 
     * @param {Object} props 
     */
    dispatch(event, props) {
        event.preventDefault();
        this.mouseTracker.track(event);
        this.trace();

        /**
         * TODO:
         * consider implementing the logic below with Observer and/or Command patterns.
         */
        if (event.type == "click" && this.mouseTracker.button == "left" && !props.shape) {
            this.mouseTracker.resetClickCount();
            alert("Pick a Shape from the tool bar!");
            // Optional return.
            return false;
        } else if (event.type == "click" && this.mouseTracker.button == "left") {
            if (this.mouseTracker.clickCount == 2) {
                props.start = this.mouseTracker.start;
                props.end = this.mouseTracker.end;
                
                this.#app.layer("model").clear();
                this.#app.layer("main").draw(props);
                this.mouseTracker.resetClickCount();
            }
        } else if (event.type == "mousemove" && this.mouseTracker.clickCount > 0 && !this.mouseTracker.mouseDown) {
            props.start = this.mouseTracker.start;
            props.end = this.mouseTracker.current;

            this.#app.layer("model").clear();
            this.#app.layer("model").sketch(props);
        } else if (event.type == "mousemove" && this.mouseTracker.button == "middle") {
            if (this.mouseTracker.mouseDown) {
                this.#app.stage.drag(
                    this.mouseTracker.moveDelta.x,
                    this.mouseTracker.moveDelta.y
                );
            }
        } else if (event.type === "keyup" && event.key === "Escape") {
            this.#app.layer("model").clear();
            this.mouseTracker.resetClickCount();
        } else if (event.type == "mousewheel" && !this.mouseTracker.mouseDown) {
            if (event.originalEvent.wheelDeltaY > 0) {
                this.#app.stage.zoomIn(this.mouseTracker);
            } else {
                this.#app.stage.zoomOut(this.mouseTracker);
            }
        } else if (event.type == "mouseout") {
            this.#app.layer("trace").clear();
        }
        
        // Optional return. Just to let the client know that method has worked fine.
        return true;
    }

    /**
     * This is an internal method, not supposed to be called from outside, for now.
     */
    trace() {
        this.notifyAll({
            x: Math.round(this.mouseTracker.x - this.#app.stage.offset.x),
            y: Math.round(this.mouseTracker.y - this.#app.stage.offset.y)
        });

        this.#app.layer("trace").clear();
        this.#app.layer("trace").sketch({
            shape: "tracer",
            color: "rgb(150, 0, 0)",
            start: this.mouseTracker.current
        });
        
        // Optional return. Just to let the client know that method has worked fine.
        return true;
    }
}

export {Dispatcher};