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
     * init() - it an internal method, not supposed to be called from outside, for now.
     */
    init() {
        this.x = 0; 
        this.y = 0;
        this.start = {x: 0, y:0};
        this.end = {x: 0, y: 0};
        this.clickCount = 0;
        this.tracer.setColor("rgb(150, 0, 0)");
    }

    /**
     * dispatch() - is the only method that should be use from outside, by the client of this class.
     * The rest of methods in Dispatcher are for internal use only.
     * @param {*} event 
     * @param {*} shape 
     */
    dispatch(event, shape) {
        this.x = event.clientX - event.target.parentElement.offsetLeft;
        this.y = event.clientY - event.target.parentElement.offsetTop;

        if (event.type == "mousemove") {
            
            this.trace(event);

        } else if (event.type == "click" ) {
            
            if(this.clickCount == 0) {
                this.start.x = event.clientX - event.target.parentElement.offsetLeft;
                this.start.y = event.clientY - event.target.parentElement.offsetTop;
                this.clickCount += 1;
            } else if (this.clickCount == 1) {
                this.end.x = event.clientX - event.target.parentElement.offsetLeft;
                this.end.y = event.clientY - event.target.parentElement.offsetTop;
                this.clickCount = 0;
            }
            
            /**
             * TODO:
             * - process "click" even properly so that "shape modelling" worked as supposed to.
             * 
             * - re-work Shape-classes so that they would receive in props two coordinates {x, y}
             *      for two clicks - start and end of the modelling.
             *      shape must calculated rest of the drawing parameters by itself, 
             *      based on "start" and "end" click-points.
             */
            this.draw(event, shape, this.stage.main);

        }

        return false;
    }
    
    /**
     * draw() - it an internal method, not supposed to be called from outside, for now.
     * @param {*} event 
     * @param {*} shape 
     */
    draw(event, shape, layer) {
        
        switch(shape.constructor.name) {
            case "Circle":
                layer.draw(shape, {x:this.x, y:this.y, r:10});
                break;
            case "Rectangle":
                layer.draw(shape, {x:this.x, y:this.y, w:50, h:50});
                break;
            default:
                alert("Choose the shape!");
                break;
        }

        return null;
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
        
    }
}