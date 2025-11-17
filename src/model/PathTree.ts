import { Edge } from "./Edge";
import { Graph } from "./Graph";
import PathNode from "./PathNode";
import { Vertex } from "./Vertex";


export default class PathTree{

    public nodes: Map<Vertex, PathNode>;

    constructor(origin: Vertex){
        this.nodes = new Map();
        const node = new PathNode(0.0, null, false);
        this.nodes.set(origin, node);
    }

    //build path to reached destination USED ONLY WHEN DESTINATION FOUND
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

    public isReached(vertex: Vertex): boolean{
        return this.nodes.has(vertex);
    }

    public getOrCreateNode(vertex: Vertex): PathNode {
        if (this.isReached(vertex)){
            return this.getNode(vertex);
        }
        else{
            const node = new PathNode(Number.POSITIVE_INFINITY, null, false);
            this.nodes.set(vertex,node);
            return this.getNode(vertex);
        }
    }

    public getReachedVertices(): Vertex[] {
        return Array.from(this.nodes.keys());
    }
}