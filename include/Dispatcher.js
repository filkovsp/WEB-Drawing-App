/**
 * Dipatcher class watches the mouse events and "decides" what action must be perfomed based on the event:
 * - move event: 
 *      if we just move mouse over the canvas, we trace its move in "tracing" layer. look into trace() method
 * - click event:
 *      if we make a click: 1st click starts modelling the chosen shape into "model" layer.
 *      by second click we set the shape as complete and draw the same shape with final props 
 *      into the "main" layer and clear out the "model" layer.
 */
class Dispatcher {
    constructor(stage) {
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
         * implement the logic below with Observer and/or Command patterns.
         */
        if (event.type == "click" && shape.constructor.name == "Shape" && this.mouseTracker.button == "left") {
            alert("Pick a Shape from the tool bar!");
            return;
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
                
                this.stage.model.drawOnce(shape, {
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
            this.init();
            this.stage.model.clear();
            return;
        } else if (event.type == "mousewheel" && !this.mouseTracker.mouseDown) {
    
            // TODO: implement Zoom in/out with mouse-wheel:
            if (event.deltaY > 0) {
                // $("input[name='z']").val();
                // this.stage.zoomIn();
            } else {
                // $("input[name='z']").val();
                // this.stage.zoomOut();
            }
        } else if (event.type == "mouseout") {
            this.stage.trace.clear();
        }
    }

    /**
     * This is an internal method, not supposed to be called from outside, for now.
     */
    trace() {
        $("input[name='x']").val(this.mouseTracker.x - this.stage.offset.x);
        $("input[name='y']").val(this.mouseTracker.y - this.stage.offset.y);
        this.stage.trace.clear();
        this.stage.trace.drawOnce(this.tracer, {start: this.mouseTracker.current});
        
        // Optional return. Just to let the client know that method has worked fine.
        return true;
    }
}
