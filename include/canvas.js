/**
 * Canvas documentation:
 * https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
 * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
 */
class Canvas {
    constructor(canvas) {
        this.view = canvas;
        this.context = canvas.getContext('2d');
    }

    clear(props) {
        if (typeof(props) === "object" && ["x", "y", "w", "h"].every(key => props.hasOwnProperty(key))) {
            this.context.clearRect(props.x, props.y, props.w, props.h);
        } else {
            this.context.clearRect(0, 0, this.view.width, this.view.height);
        }
    }

    draw(shape, props) {
        shape.draw(this, props);
    }
}