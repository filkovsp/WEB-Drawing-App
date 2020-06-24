import {LayerComposer} from './LayerComposer.js';
import {Stage} from './Stage.js';

export default class StageBuilder {
    constructor() {

    }

    static build(root) {
        let layers = LayerComposer.compose(root);
        let stage = new Stage(layers);
        return stage;
    }

}

export {StageBuilder};