class MouseTracker {
    constructor () {
        this.current = {x: 0, y: 0};
        this.previous = {x: 0, y: 0};
        this.moveDelta = {x: 0, y: 0};
        this.mouseDown = false;
        this.start = {x: 0, y: 0};
        this.end = {x: 0, y: 0};
        this.which = 0;
        this.clickCount = 0;
        this.type = null;
    }
    get x () { return this.current.x; }
    get y () { return this.current.y; }
    get button () {
        switch (this.which) {
            case 0:
                return "None";
            case 1:
                return "left";
            case 2:
                return "middle";
            case 3:
                return "right";
            default:
                break;
        }
    }
    click () { this.clickCount +=1; }
    resetClickCount() {this.clickCount = 0; this.mouseDown = false;}

    track (event) {
        this.type = event.type;
        switch (event.type) {
            case "mousemove":
                this.previous = Object.assign({}, this.current);
                this.current.x = event.clientX - event.target.parentElement.offsetLeft;
                this.current.y = event.clientY - event.target.parentElement.offsetTop;    
                this.moveDelta = {
                    x: this.current.x - this.previous.x, 
                    y: this.current.y - this.previous.y
                };
                break;
            case "mouseover":
            case "mouseout":
                if(this.mouseDown) {
                    this.mouseDown = false;
                    this.end = Object.assign({}, this.current); // consider this.previous;
                } 
                break;
            case "mousedown":
                    this.which = event.which;
                    this.mouseDown = true; 
                break
            case "mouseup":
                    this.which = 0;
                    this.mouseDown = false;
                break;
            case "click":
                this.which = event.which;
                if (this.clickCount == 0) {
                    this.start = Object.assign({}, this.current);
                } else if (this.clickCount == 1) {
                    this.end = Object.assign({}, this.current);
                }
                this.click();
                break;
            case "mousewheel":
                break;
            default:
                break;
        }
    }

}
