import { Edge } from "./Edge";
import { Graph } from "./Graph";
import PathNode from "./PathNode";
import { Vertex } from "./Vertex";


export default class PathTree{

    public nodes: Map<Vertex, PathNode>;
    private graph:Graph;

    constructor(graph: Graph, origin: Vertex){
        this.graph = graph;
        this.nodes = new Map();

        for (let vertex of this.graph.vertices) {
            const node = new PathNode();
            node.cost = origin == vertex ? 0.0 : Number.POSITIVE_INFINITY;
            node.reachingEdge = null; 
            node.visited = false;
            this.nodes.set(vertex, node);
        }
    }

    public getPath(destination: Vertex): Edge[]{
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

    public getNode(vertex: Vertex){
        return this.nodes.get(vertex);
    }

}