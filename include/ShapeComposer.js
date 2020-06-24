import * as Shape from "./Shape.js";

export default class ShapeComposer {
    constructor() {

    }

    static compose() {
        let shapes = new Map()
            .set("tracer", new Shape.Trace())
            .set("circle", new Shape.Circle())
            .set("rectangle", new Shape.Rectangle())
            .set("ellipse", new Shape.Ellipse());
        
        return shapes;
    }
}

export {ShapeComposer};