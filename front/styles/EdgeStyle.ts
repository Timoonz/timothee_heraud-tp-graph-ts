import { Circle, Fill, Stroke, Style } from 'ol/style.js';

export class EdgeStyle extends Style {
    constructor() {
        super({
            stroke: new Stroke({
                color: 'blue',
                width: 2.0,
            }),
        });
    }
}
