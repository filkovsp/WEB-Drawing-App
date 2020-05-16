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
     * coordinates = {start: {x, y}, end: {x, y}};
     */
    getPropsFromCoordinates({start, end}) {
        alert("implement this method in Child class");
    }

    draw() {
        alert("Choose the Shape!");
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
     * @param {Object} pops Object containing properties {x, y, r}
     */
    draw(layer, pops) {
        layer.context.strokeStyle = this.color;
        layer.context.beginPath();
        layer.context.arc(pops.x, pops.y, pops.r, 0, 2*Math.PI);
        layer.context.stroke();           
    }

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