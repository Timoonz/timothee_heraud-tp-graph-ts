import { LineString } from "geojson";
import { Vertex } from "./Vertex";
import length from "@turf/length";
import { lineString } from "@turf/turf";

/**
 * An edge with its source and target
 */
export class Edge {
    id: string;
    private _source: Vertex;
    private _target: Vertex;
    public geometry: LineString;

    constructor(source: Vertex, target: Vertex){
        this._source = source;
        source._outEdges.push(this);
        this._target = target;
        target._inEdges.push(this);
    }

    getLength(): number {
        return length(lineString(this.getGeometry().coordinates));
    }

    getGeometry(): LineString {
        return this.geometry || 
        {
            type: "LineString",
            coordinates: [
                this._source.coordinate,
                this._target.coordinate
            ]
        }
    }

    getSource(){
        return this._source;
    }

    getTarget(){
        return this._target;
    }

    //0.3 geometry setter
    setGeometry(geometry: LineString){
        this.geometry = geometry;
    }

}
