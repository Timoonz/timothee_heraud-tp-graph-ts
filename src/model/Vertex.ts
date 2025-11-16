import Coordinate from "./Coordinate";
import { Edge } from "./Edge";

/**
 * A vertex in a graph with an id and a location
 */
export class Vertex {
    /**
     * identifier of the vertex (debug purpose)
     */
    id: string;
    /**
     * location of the vertex
     */
    coordinate: Coordinate;

	//0.4 Vertices indexation
	_inEdges: Edge[] = [];
	_outEdges: Edge[] = [];
}
