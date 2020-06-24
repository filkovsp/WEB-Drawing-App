import {Layer} from './Layer.js';

export default class LayerComposer {
    constructor() {

    }

    static compose(root) {
        let layers = new Map();
        ["main", "model", "trace"].forEach(id => {
            let layer = $( "<canvas/>", {"id": id} )
                .attr("width", root.css("width"))
                .attr("height", root.css("height"));

            layer.appendTo(root.get(0));
            layers.set(id, new Layer(layer.get(0)));
        });

        return layers;
    }
}

export {LayerComposer};