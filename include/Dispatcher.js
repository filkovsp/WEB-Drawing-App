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
        // this.shape = new Shape();
        this.tracer = new Trace();
        this.tracer.setColor("rgb(150, 0, 0)");
        
        // Set initial values for the coordinates:
        this.x = 0; 
        this.y = 0;
        this.start = {x: 0, y:0};
        this.end = {x: 0, y: 0};
        this.clickCount = 0;
        this.isMouseDown = false;
    }

    /**
     * This is the only method that should be used from outside, by the client of this class.
     * The rest of methods in Dispatcher are for internal use only.
     * @param {Object} event 
     * @param {Object} shape 
     */
    dispatch(event, shape) {
        event.preventDefault();
        this.x = event.clientX - event.target.parentElement.offsetLeft;
        this.y = event.clientY - event.target.parentElement.offsetTop;
        this.trace();

        /**
         * TODO:
         * implement keypress event handler, for ESC key to cancel shape modelling. https://api.jquery.com/keypress/
         * implement the logic below with Observer pattern.
         */
        if (event.type == "mousedown" && shape.constructor.name == "Shape" && event.which == 1) {
            alert("Pick a Shape from the tool bar!");
            // this.isMouseDown = false;
            return;
        } else if (event.type == "mousedown" && event.which == 1) {
            if (this.clickCount == 0) {
                this.start.x = event.clientX - event.target.parentElement.offsetLeft;
                this.start.y = event.clientY - event.target.parentElement.offsetTop;
                this.clickCount += 1;
            } else if (this.clickCount == 1) {
                this.end.x = event.clientX - event.target.parentElement.offsetLeft;
                this.end.y = event.clientY - event.target.parentElement.offsetTop;
                this.clickCount = 0;

                this.stage.model.clear();
                this.stage.main.draw(shape, {start:this.start, end:this.end} );
            }
        } else if (event.type == "mousedown" && event.which == 2) {
            this.setMouseDown(true);
            this.start = {x: this.x, y: this.y};
        } else if (event.type == "mousemove" && event.which == 0) {
            if(this.clickCount > 0 && !this.isMouseDown) {
                this.stage.model.clear();
                this.stage.model.drawOnce(shape, {start:this.start, end:{x:this.x, y:this.y}} );
            }
        } else if (event.type == "mousemove" && event.which == 2) {
            if (this.isMouseDown) {
                this.stage.drag(this.x - this.start.x, this.y - this.start.y);
            }
        } else if (event.type === "keyup" && event.key === "Escape") {
            this.init();
            this.stage.model.clear();
            return;
        } else if (event.type == "mousewheel" && !this.isMouseDown) {
            // (["mousewheel"].some(e => (e == event.type)))
			
            // Zoom in/out with mouse-wheel:
            if (event.deltaY > 0) {
                // $("input[name='z']").val();
                // this.stage.zoomIn();
            } else {
                // $("input[name='z']").val();
                // this.stage.zoomOut();
            }
        }
    }
            
	setShape(shape) {
		this.shape = shape;
    }
        
	setMouseDown(isMouseDown) {
		this.isMouseDown = isMouseDown;
    }
    
	getMouseDown() {
		return this.isMouseDown;
    }

    /**
     * trace() - it an internal method, not supposed to be called from outside, for now.
     * @param {Object} event Mouse Event object (optional)
     */
    trace() {
        $("input[name='x']").val(this.x - this.stage.offset.x);
        $("input[name='y']").val(this.y - this.stage.offset.y);
        this.stage.trace.clear();
        this.stage.trace.drawOnce(this.tracer, {start: {x: this.x, y: this.y}});
        
        // Optional return. Just to let the client know that method has worked fine.
        return true;
    }
}