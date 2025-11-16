import { Vertex } from "../model/Vertex";
import { Graph } from "../model/Graph";
import { Edge } from "../model/Edge";
import { RouteNotFound } from "../errors/RouteNotFound";
import PathNode from "../model/PathNode";

/**
 * Find routes using Dijkstra's algorithm.
 * 
 * @see https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
 */
export class RoutingService {

    //0.5
    nodes: Map<Vertex, PathNode>;

    constructor(
        private graph: Graph
    ) {
        this.nodes = new Map();
    }

    /**
     * Find a route between an origin and a destination
     */
    findRoute(origin: Vertex, destination: Vertex): Edge[] {
        // prepare graph for the visit
        this.initGraph(origin);

        const origin_node = this.getNode(origin);
        const destination_node = this.getNode(destination);

        // visit all vertices
        let current: Vertex | null;
        while ((current = this.findNextVertex()) != null) {
            this.visit(current);
            // until the destination is reached...
            if (destination_node.cost != Number.POSITIVE_INFINITY) {
                return this.buildRoute(destination);
            }
        }

        throw new RouteNotFound(`no route found from '${origin.id}' to '${destination.id}'`);
    }

    /**
     * Prepare the graph to find a route from an origin.
     */
    initGraph(origin: Vertex) {
        for (let vertex of this.graph.vertices) {
            const node = new PathNode();
            node.cost = origin == vertex ? 0.0 : Number.POSITIVE_INFINITY;
            node.reachingEdge = null; 
            node.visited = false;
            this.nodes.set(vertex, node);
        }
    }

    /**
     * Explores out edges for a given vertex and try to reach vertex with a better cost.
     */
    private visit(vertex: Vertex) {
        const node_vertex = this.getNode(vertex);
        for (const outEdge of this.graph.getOutEdges(vertex)) {
            const reachedVertex = outEdge.getTarget();
            /*
             * Test if reachedVertex is reached with a better cost.
             * (Note that the cost is POSITIVE_INFINITY for unreached vertex)
             */
            const node_reachedVertex = this.getNode(reachedVertex);
            const newCost = node_vertex.cost + outEdge.getLength();
            if (newCost < node_reachedVertex.cost) {
                node_reachedVertex.cost = newCost;
                node_reachedVertex.reachingEdge = outEdge;
            }
        }
        // mark vertex as visited
        node_vertex.visited = true;
    }

    /**
     * Find the next vertex to visit. With Dijkstra's algorithm, 
     * it is the nearest vertex of the origin that is not already visited.
     */
    findNextVertex(): Vertex | null {
        let candidate: Vertex | null = null;
        let candidate_node: PathNode | null = null;
        for (const vertex of this.graph.vertices) {
            const node = this.getNode(vertex);
            // already visited?
            if (node.visited) {
                continue;
            }
            // not reached?
            if (node.cost == Number.POSITIVE_INFINITY) {
                continue;
            }
            // nearest from origin?
            if (candidate == null || node.cost < candidate_node.cost) {
                candidate = vertex;
                candidate_node = node;
            }
        }
        return candidate;
    }

    /**
     * Build route to the reached destination.
     */
    private buildRoute(destination: Vertex): Edge[] {
        const edges: Edge[] = [];
        const node_destination = this.getNode(destination);
        for (
            let current = node_destination.reachingEdge;
            current != null;
            current = this.getNode(current.getSource()).reachingEdge
        ) {
            edges.push(current);
        }

        return edges.reverse();
    }

    //O.5
    getNode(vertex: Vertex){
        return this.nodes.get(vertex);
    }


}
