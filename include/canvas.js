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

    clear() {
        this.context.clearRect(0, 0, this.view.width, this.view.height);
    }

    draw(shape, props) {
        shape.draw(this, props);
    }
}