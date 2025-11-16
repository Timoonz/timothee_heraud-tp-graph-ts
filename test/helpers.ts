import { Edge } from "../src/model/Edge";
import { Graph } from "../src/model/Graph";
import { Vertex } from "../src/model/Vertex";

/**
 * Create a sample graph
 */
export function createTestGraph01(): Graph {
	const g = new Graph();

	const a = g.createVertex([0.0, 0.0], "a");

	const b = g.createVertex([1.0, 0.0], "b");

	const c = g.createVertex([2.0, 0.0], "c");

	const d = g.createVertex([1.0, 1.0], "d");

	const ab = g.createEdge(a, b, "ab");

	const bc = g.createEdge(b, c, "bc");

	const ad = g.createEdge(a, d, "ad");

	return g;
}
