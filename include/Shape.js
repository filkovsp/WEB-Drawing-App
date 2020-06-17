/**
 * Shapes documentaion:
 * https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
 * 
 * Also short reference here:
 * https://www.khanacademy.org/computing/computer-programming/programming/drawing-basics/pc/challenge-waving-snowman
 * follow the Documentation tab at the bottom.
 */

/**
 * Shape is an Abstract Class, should not be instanciated directly.
 * But one of the clases below that extend Shape must be used for drawing a particular shape.
 */
export default class AbstractShape {
    constructor() {
        this.color = "rgb(0, 0, 0)";
        this.fillColor = "rgb(0, 0, 0)";
    }
    
    /**
     * Interface to set Shape's line-color property
     * https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors
     * @param {*} color 
     */
    setColor(color) {
        this.color = color;
    }

    /**
     * Interface to set Shape's fill-color property
     * @param {*} color 
     */
    setFillColor(color) {
        this.fillColor = color;
    }

    /**
     * Method that validates
     * whether we receive in props just to points {start: {x, y}, end: {x, y}}
     * or, this is shape-speciwic params for drawing particular shape.
     * I you use this method in CHild class, then make sure you implement also
     * getPropsFromCoordinates() in the same class.
     * @param {*} props 
     */
    validateProps(props) {
        if (!Object.keys(props).includes("offset")) {
            props.offset = {x: 0, y: 0};
        }

        if (!Object.keys(props).includes("zoom")) {
            props.zoom = 1;
        }

        return this.getPropsFromCoordinates(props);
    }

    /**
     * Interface for the Shape's specific method that returns object of properties 
     * required by shape to draw it out of two coordinates at the layer: 
     * starting and ending points.
     * @param {Object} coordinates {start: {x, y}, end: {x, y}}
     */
    getPropsFromCoordinates({start, end}) {
        throw new Error("implement this method in Child class");
    }

    /**
     * Interface to the Shape's Draw mathod.
     * Draws the Shape on the layer with the given coordinates in props
     * @param {Layer} layer
     * @param {Object} props 
     */
    draw(layer, props) {
        throw new Error("Choose the Shape!");
    }

    clone() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }

    /**
     * TODO:
     * Add interface for a method to set line-width:
     * usage: context.lineWidth = 1;
     * refer to the Context-API: 
     * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineWidth
     * 
     */
}

/**************************************************************************
 * Set of concrete classes below 
 * that each reperesents a perticular shape on a layer.
 -------------------------------------------------------------------------*/
class Circle extends AbstractShape {
    constructor() {
        super();
    }    

    /**
     * Draws Circle with center at props{x, y} and radius props{r}
     * @param {Layer} layer The oject, where the shape must be drawn
     * @param {Object} props Object containing properties {x, y, r}
     */
    draw(layer, props) {
        if(!["x", "y", "r"].every(key => Object.keys(props).includes(key))) {
            props = this.validateProps(props);    
        }

        layer.context.strokeStyle = this.color;
        layer.context.beginPath();
        layer.context.arc(props.x, props.y, props.r, 0, 2 * Math.PI);
        layer.context.closePath();
        layer.context.stroke();

        /**
         * once shape is drawn, we don't need 
         * props {offset, zoom} any more.
         */
        delete props.offset;
        delete props.zoom;
        return props;
    }

    /**
     * Shape specific method that returns object of properties required by shape to draw
     * out of two coordinates at the layer: starting and ending points.
     * @param {Object} props {start: {x, y}, end: {x, y}}
     */
    getPropsFromCoordinates (props) {
        if(["start", "end"].every(key => Object.keys(props).includes(key))) {
            props.x = props.start.x;
            props.y = props.start.y;
            props.r = Math.sqrt(
                Math.pow(props.end.x - props.start.x, 2) + 
                Math.pow(props.end.y - props.start.y, 2)
            );

            /**
             * Once we've calculated shape-related params,
             * we don't need props{start, end} any more:
             */
            delete props.start;
            delete props.end;
        }

        /**
         * To valiadate the real shape params, 
         * we also need to subtract the offset:
         */
        props.x = (props.x - props.offset.x) / props.zoom;
        props.y = (props.y - props.offset.y) / props.zoom;
        props.r /= props.zoom;
        return props;
    }
}

class Ellipse extends AbstractShape {
    constructor() {
        super();
    }
    
    /**
     * Draws Ellipse
     * @param {Layer} layer 
     * @param {Object} props Object containing properties {x, y, rX, rY, rA}
     */
    draw(layer, props) {
        if(!["x", "y", "rX", "rY", "rA"].every(property => Object.keys(props).includes(property))) {
            props = this.validateProps(props);    
        }

        layer.context.strokeStyle = this.color;
        layer.context.beginPath();
        layer.context.ellipse(props.x, props.y, props.rX, props.rY, props.rA, 0, 2 * Math.PI);
        layer.context.closePath();
        layer.context.stroke();
        
        // drop default properties.
        delete props.offset;
        delete props.zoom;
        return props;
    }
    /**
     * Shape specific method that returns object of properties required by shape to draw
     * out of two coordinates at the layer: starting and ending points.
     * @param {Object} coordinates {start: {x, y}, end: {x, y}}
     */
    getPropsFromCoordinates(props) {
        if(["start", "end"].every(key => Object.keys(props).includes(key))) {
            /**
             * TODO: rework this functio to make it calculating props more properly.
             */
            let hyp = Math.sqrt(
                Math.pow(props.end.x - props.start.x, 2) + 
                Math.pow(props.end.y - props.start.y, 2)
            );

            let adj = Math.abs(
                props.end.y - props.start.y
            );
            
            props.x = props.start.x;
            props.y = props.start.y;
            props.rX = Math.abs(props.end.x - props.start.x);
            props.rY = Math.abs(props.end.y - props.start.y);
            props.rA = Math.acos(adj/hyp);
            
            delete props.start;
            delete props.end;
        }

        props.x = (props.x - props.offset.x) / props.zoom;
        props.y = (props.y - props.offset.y) / props.zoom;
        props.rX /= props.zoom;
        props.rY /= props.zoom;
        return props;
    }
}

class Rectangle extends AbstractShape {
    constructor() {
        super();
    }

    /**
     * Draws Rectangle, with starting top-left coner at props{x, y}, width and height as props{w, h}
     * @param {Layer} layer layer object, where the shape must be drawn
     * @param {Object} props Object containing properties {x, y, w, h}
     */
    draw(layer, props) {
        /**
         * TODO:
         * consider using context.strokeRect() instead.
         * refer fo Context-API:
         * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeRect
         */
        if(!["x", "y", "w", "h"].every(key => Object.keys(props).includes(key))) {
            props = this.validateProps(props);
        }

        layer.context.strokeStyle = this.color;
        layer.context.beginPath();
        layer.context.moveTo(props.x, props.y);
        layer.context.lineTo(props.x + props.w, props.y);
        layer.context.lineTo(props.x + props.w, props.y + props.h);
        layer.context.lineTo(props.x, props.y + props.h);
        layer.context.lineTo(props.x, props.y);
        layer.context.closePath();
        layer.context.stroke();

        delete props.offset;
        delete props.zoom;
        return props;
    }

    /**
     * Gets object `props` with two fields in it (objects): start{x, y} & end{x, y}
     * Returns object with shape-specific coordinates: {x, y, w, h}
     * @param {Object} props 
     */
    getPropsFromCoordinates(props) {
        if(["start", "end"].every(key => Object.keys(props).includes(key))) {
            props.x = props.start.x;
            props.y = props.start.y;
            props.w = props.end.x - props.start.x;
            props.h = props.end.y - props.start.y;   
            
            delete props.start;
            delete props.end;        
        }

        props.x = (props.x - props.offset.x) / props.zoom;
        props.y = (props.y - props.offset.y) / props.zoom;
        props.w /= props.zoom;
        props.h /= props.zoom;
        return props;
    }
}

// TODO: Take in account Zoom and Offset
class Grid extends AbstractShape {
    constructor() {
        super();
    }
    
    /**
     * Draws grid of coordiantes
     * @param {Layer} layer Canavas to draw at
     * @param {Object} props Reserved container for additiona params
     */
    draw(layer, props) {
        layer.context.strokeStyle = "rgb(200, 200, 230)";
        layer.context.lineWidth = 0.05;
        let step = 50;
        
        // Vertical lines:
        layer.context.beginPath();
        for (let x = step; x < this.canvas.width; x += step) {
            layer.context.moveTo(x, 0);
            layer.context.lineTo(x, this.canvas.height);
            layer.context.stroke();
        }
        // Horizontal lines:
        layer.context.beginPath();
        for (let y = step; y < this.canvas.height; y += step) {
            layer.context.moveTo(0, y);
            layer.context.lineTo(this.canvas.width, y);
            layer.context.stroke();
   
        }
    }
}

class Trace extends AbstractShape {
    constructor() {
        super();
    }
    
    /**
     * Draws vertical and horizontal lines over the whole layer,
     * crossed at position: props{x, y}
     * @param {Layer} layer The object, where the shape must be drawn
     * @param {Object} props Object containing properties {x, y}
     */
    draw(layer, props) {
        if(!["x", "y"].every(key => Object.keys(props).includes(key))) {
            props = this.validateProps(props);
        }
        layer.context.beginPath();
        layer.context.strokeStyle = this.color;
        layer.context.moveTo(props.x, 0);
        layer.context.lineTo(props.x, layer.canvas.height);
        layer.context.moveTo(0, props.y);
        layer.context.lineTo(layer.canvas.width, props.y);
        layer.context.stroke();
        
        // drop default properties.
        delete props.offset;
        delete props.zoom;
        return props;
    }
    
    /**
     * Gets object `props` with two fields in it (objects): start{x, y} & end{x, y}
     * Returns object with shape-specific coordinates: {x, y}
     * @param {Object} props 
     */
    getPropsFromCoordinates(props) {
        if(["start"].every(key => Object.keys(props).includes(key))) {
            props.x = props.start.x;
            props.y = props.start.y;

            delete props.start;
            delete props.end;        
        }
        return props;
    }
}

export {AbstractShape, Circle, Rectangle, Ellipse};
export {Grid, Trace};