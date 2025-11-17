import { Vertex } from "../model/Vertex";
import { Graph } from "../model/Graph";
import { Edge } from "../model/Edge";
import { RouteNotFound } from "../errors/RouteNotFound";
import PathNode from "../model/PathNode";
import PathTree from "../model/PathTree";

/**
 * Find routes using Dijkstra's algorithm.
 * 
 * @see https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
 */
export class RoutingService {

    //0.9 
    public pathTree: PathTree;

    constructor(
        private graph: Graph
    ) {;
    }

    /**
     * Find a route between an origin and a destination
     */
    findRoute(origin: Vertex, destination: Vertex): Edge[] {
        // prepare graph for the visit
        this.initGraph(origin);

        // visit all vertices
        let current: Vertex | null;
        while ((current = this.findNextVertex()) != null) {
            this.visit(current);
            // until the destination is reached...
            if (this.pathTree.isReached(destination) && this.pathTree.getNode(destination).cost != Number.POSITIVE_INFINITY) {
                return this.pathTree.getPath(destination);
            }
        }

        throw new RouteNotFound(`no route found from '${origin.id}' to '${destination.id}'`);
    }

    /**
     * Prepare the graph to find a route from an origin.
     */
    initGraph(origin: Vertex) {
        this.pathTree = new PathTree(origin);
    }

    /**
     * Explores out edges for a given vertex and try to reach vertex with a better cost.
     */
    private visit(vertex: Vertex) {
        const node_vertex = this.pathTree.getNode(vertex);
        for (const outEdge of this.graph.getOutEdges(vertex)) {
            const reachedVertex = outEdge.getTarget();
            /*
             * Test if reachedVertex is reached with a better cost.
             * (Note that the cost is POSITIVE_INFINITY for unreached vertex)
             * UPDATE 0.9: we create a new PathNode if reachedVertex waas not already reached:
             * thus building the PathTree visits by visits
             */
            const node_reachedVertex = this.pathTree.getOrCreateNode(reachedVertex);
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
        // iterating only on the reached vertices
        for (const vertex of this.pathTree.getReachedVertices()) {
            const node = this.pathTree.getNode(vertex);
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


}
