import { Edge } from "./Edge";

export default class PathNode {
    /**
	 * dijkstra - cost to reach a vertex (Number.POSITIVE_INFINITY if the vertex is not reached)
	 */
	cost: number;
	/**
	 * dijkstra - incoming edge with the best cost
	 */
	reachingEdge: Edge|null;
	/**
	 * dijkstra - indicates if the vertex is visited
	 */
    visited: boolean;

	constructor(cost: number, reachingEdge: Edge|null, visited:boolean){
		this.cost = cost;
		this.reachingEdge = reachingEdge;
		this.visited = visited;
	}
}