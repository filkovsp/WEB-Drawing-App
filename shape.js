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

    getCoordinates({start, end}) {
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

    draw(layer, pops) {
        /**
         * TODO:
         * use ellipse() instead of arc()
         */
        layer.context.strokeStyle = this.color;
        layer.context.beginPath();
        layer.context.arc(pops.x, pops.y, pops.r, 0, 2*Math.PI);
        layer.context.stroke();           
    }
}


class Rectangle extends Shape {
    constructor() {
        super();
    }

    /**
     * Draws Rectangle.
     * takes params:
     * @param {*} canvas : target canvas object, where the shape must be drawn
     * @param {*} props : {x, y, w, h} - object containing coordinates of the starting point {x, y} 
     * and additional width (w) and height (h).
     */
    draw(layer, props) {
        /**
         * TODO:
         * consider using context.strokeRect() instead.
         * refer fo Context-API:
         * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeRect
         */
        layer.context.strokeStyle = this.color;
        layer.context.fillStyle = this.fillColor;
        layer.context.beginPath();
        layer.context.moveTo(props.x, props.y);
        layer.context.lineTo(props.x + props.w, props.y);
        layer.context.lineTo(props.x + props.w, props.y + props.h);
        layer.context.lineTo(props.x, props.y + props.h);
        layer.context.lineTo(props.x, props.y);
        layer.context.stroke();
    }
}


class Trace extends Shape {
    constructor() {
        super();
    }
    
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