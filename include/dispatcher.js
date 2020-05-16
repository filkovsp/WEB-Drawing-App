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
        this.tracer = new Trace();
        this.init();
    }

    /**
     * init() - This is an internal method, not supposed to be called from outside, for now.
     */
    init() {
        // Set initial values for the coordinates:
        this.x = 0; 
        this.y = 0;
        this.start = {x: 0, y:0};
        this.end = {x: 0, y: 0};
        this.clickCount = 0;
        // Set tracing line color to red-ish.
        this.tracer.setColor("rgb(150, 0, 0)");
        // Decorate line styles for tarcing and modelling layers:
        this.stage.trace.context.setLineDash([1, 3]);
        this.stage.model.context.setLineDash([1, 2]);
    }

    /**
     * dispatch() - is the only method that should be use from outside, by the client of this class.
     * The rest of methods in Dispatcher are for internal use only.
     * @param {Object} event 
     * @param {Object} shape 
     */
    dispatch(event, shape) {
        this.x = event.clientX - event.target.parentElement.offsetLeft;
        this.y = event.clientY - event.target.parentElement.offsetTop;

        if (event.type == "click" ) {
            
            if(this.clickCount == 0) {
                this.start.x = event.clientX - event.target.parentElement.offsetLeft;
                this.start.y = event.clientY - event.target.parentElement.offsetTop;
                this.clickCount += 1;
            } else if (this.clickCount == 1) {
                this.end.x = event.clientX - event.target.parentElement.offsetLeft;
                this.end.y = event.clientY - event.target.parentElement.offsetTop;
                this.clickCount = 0;

                this.stage.model.clear();
                this.stage.main.draw(shape, shape.getPropsFromCoordinates({start:this.start, end:this.end}));
            }
        } else if (event.type == "mousemove") {
            this.trace(event);
            if(this.clickCount > 0) {
                this.stage.model.clear();
                this.stage.model.draw(shape, shape.getPropsFromCoordinates({start:this.start, end:{x:this.x, y:this.y}}));
            }
        }

        return true;
    }
    
    /**
     * trace() - it an internal method, not supposed to be called from outside, for now.
     * @param {*} event 
     */
    trace(event) {
        $("input[name='x']").val(this.x);
        $("input[name='y']").val(this.y);
        this.stage.trace.clear();
        this.stage.trace.draw(this.tracer, {x: this.x, y: this.y});
        return true;
    }
}