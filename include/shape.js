/**
 * Shapes documentaion:
 * https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
 * 
 * Also short reference here:
 * https://www.khanacademy.org/computing/computer-programming/programming/drawing-basics/pc/challenge-waving-snowman
 * follow the Documentation tab at the bottom.
 */
class Shape {
    constructor() {
        this.color = "rgb(0, 0, 0)";
        this.fillColor = "rgb(0, 0, 0)";
    }
    
    /**
     * https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors
     * @param {*} color 
     */
    setColor(color) {
        this.color = color;
    }

    setFillColor(color) {
        this.fillColor = color;
    }

    /**
     * Shape specific method that returns object of properties required by shape to draw
     * out of two coordinates at the canvas: starting and ending points.
     * @param {Object} coordinates {start: {x, y}, end: {x, y}}
     */
    getPropsFromCoordinates({start, end}) {
        throw new Error("implement this method in Child class");
    }

    draw() {
        throw new Error("Choose the Shape!");
    }

    /**
     * TODO:
     * implement interface for a method to set line-width:
     * usage: context.lineWidth = 1;
     * refer to the Context-API: 
     * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineWidth
     * 
     */
}

class Circle extends Shape {
    constructor() {
        super();
    }

    /**
     * Draws Circle with center at props{x, y} and radius props{r}
     * @param {Canvas} layer Canvas object, where the shape must be drawn
     * @param {Object} props Object containing properties {x, y, r}
     */
    draw(layer, props) {
        layer.context.strokeStyle = this.color;
        layer.context.beginPath();
        layer.context.arc(props.x, props.y, props.r, 0, 2*Math.PI);
        layer.context.stroke();           
    }

    /**
     * Shape specific method that returns object of properties required by shape to draw
     * out of two coordinates at the canvas: starting and ending points.
     * @param {Object} coordinates {start: {x, y}, end: {x, y}}
     */
    getPropsFromCoordinates(coordinates) {
        return {
            x:coordinates.start.x, 
            y:coordinates.start.y, 
            r:Math.sqrt(
                Math.pow(coordinates.end.x - coordinates.start.x, 2) + 
                Math.pow(coordinates.end.y - coordinates.start.y, 2)
            )};
    }
}

/**
 * TODO:
 * Add class Ellipse
 * that uses context.ellipse() method
 */
class Ellipse extends Shape {
    constructor() {
        super();
    }
    
    /**
     * Draws Ellipse
     * @param {Canvas} layer 
     * @param {Object} props Object containing properties {x, y, rX, rY, rA}
     */
    draw(layer, props) {
        layer.context.strokeStyle = this.color;
        layer.context.beginPath();
        layer.context.ellipse(props.x, props.y, props.rX, props.rY, props.rA, 0, 2*Math.PI);
        layer.context.stroke();  
    }

    /**
     * Shape specific method that returns object of properties required by shape to draw
     * out of two coordinates at the canvas: starting and ending points.
     * @param {Object} coordinates {start: {x, y}, end: {x, y}}
     */
    getPropsFromCoordinates(coordinates) {
        /**
         * TODO: rework this functio to make it calculating props more properly.
         */
        let hyp = Math.sqrt(
            Math.pow(coordinates.end.x - coordinates.start.x, 2) + 
            Math.pow(coordinates.end.y - coordinates.start.y, 2)
        );

        let adj = Math.abs(
            coordinates.end.y - coordinates.start.y
        );
        
        return {
            x: coordinates.start.x, 
            y: coordinates.start.y, 
            rX: Math.abs(coordinates.end.x - coordinates.start.x),
            rY: Math.abs(coordinates.end.y - coordinates.start.y),
            rA: Math.acos(adj/hyp)
        };
    }
}

class Rectangle extends Shape {
    constructor() {
        super();
    }

    /**
     * Draws Rectangle, with starting top-left coner at props{x, y}, width and height as props{w, h}
     * @param {Canvas} canvas Canvas object, where the shape must be drawn
     * @param {Object} props Object containing properties {x, y, w, h}
     */
    draw(layer, props) {
        /**
         * TODO:
         * consider using context.strokeRect() instead.
         * refer fo Context-API:
         * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeRect
         */
        layer.context.strokeStyle = this.color;
        layer.context.beginPath();
        layer.context.moveTo(props.x, props.y);
        layer.context.lineTo(props.x + props.w, props.y);
        layer.context.lineTo(props.x + props.w, props.y + props.h);
        layer.context.lineTo(props.x, props.y + props.h);
        layer.context.lineTo(props.x, props.y);
        layer.context.stroke();
    }

    /**
     * 
     * @param {Object} coordinates 
     */
    getPropsFromCoordinates(coordinates) {
        return {
            x:coordinates.start.x, 
            y:coordinates.start.y, 
            w:(coordinates.end.x - coordinates.start.x),
            h:(coordinates.end.y - coordinates.start.y)};
    }
}


class Trace extends Shape {
    constructor() {
        super();
    }
    
    /**
     * Draws vertical and horizontal lines over the whole canvas,
     * crossed at position: props{x, y}
     * @param {Canvas} layer Canvas object, where the shape must be drawn
     * @param {Object} props Object containing properties {x, y}
     */
    draw(layer, props) {
        layer.context.beginPath();
        layer.context.strokeStyle = this.color;
        layer.context.moveTo(props.x, 0);
        layer.context.lineTo(props.x, layer.view.height);
        layer.context.moveTo(0, props.y);
        layer.context.lineTo(layer.view.width, props.y);
        layer.context.stroke();
    }
}