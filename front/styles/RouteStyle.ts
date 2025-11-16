import { Circle, Fill, Stroke, Style } from 'ol/style.js';

export class RouteStyle extends Style {
    constructor() {
        super({
            stroke: new Stroke({
                color: 'red',
                width: 5,
            }),
        });
    }
}
