import express, { Express, Request, Response } from "express";

import { BdtopoLoader } from './io/BdtopoLoader';
import { FileStore } from './io/FileStore';
import { Graph } from "./model/Graph";
import { Edge } from "./model/Edge";
import { Vertex } from "./model/Vertex";
import {RoutingService} from './routing/RoutingService';
import path from "path";
import { RouteNotFound } from "./errors/RouteNotFound";

const app: Express = express();
const port = process.env.PORT || 3000;

const DEFAULT_RESOURCE_NAME = 'bdtopo-loray';

const fileStore = new FileStore();
const bdtopoLoader = new BdtopoLoader();

const graphs: Map<string, Graph> = new Map();
console.log("loading bdtopo-loray...");
bdtopoLoader.loadGraphFromFile(fileStore.getAbsolutePath('bdtopo-loray/troncon_de_route.geojson')).then((graph) => {
  console.log("bdtopo-loray loaded");
  graphs[DEFAULT_RESOURCE_NAME] = graph;
});

/*
 * display "public" folder (built from "front")
 */
app.use(express.static(path.resolve(__dirname,'../public')));

/*
 * Get vertices as a GeoJSON collection
 */
app.get("/api/vertices", (req: Request, res: Response) => {
  console.log(`GET /api/vertices...`);

  const resourceName = DEFAULT_RESOURCE_NAME;
  // convert vertices to a GeoJSON FeatureCollection
  const features = graphs[resourceName].vertices.map((vertex: Vertex) => {
    return {
      type: "Feature",
      properties: {
        id: vertex.id
      },
      geometry: {
        type: "Point",
        coordinates: vertex.coordinate
      }
    }
  });
  return res.json({
    type: "FeatureCollection",
    features: features
  });
});


/*
 * Get edges as a GeoJSON collection
 */
app.get("/api/edges", (req: Request, res: Response) => {
  console.log(`GET /api/vertices...`);

  const resourceName = DEFAULT_RESOURCE_NAME;
  // convert edges to a GeoJSON FeatureCollection
  const features = graphs[resourceName].edges.map((edge: Edge) => {
    return {
      type: "Feature",
      properties: {
        id: edge.id,
        cost: edge.getLength()
      },
      geometry: edge.getGeometry()
    }
  });
  return res.json({
    type: "FeatureCollection",
    features: features
  });
});


/*
 * Find a path returning a route as a GeoJSON collection.
 */
app.get("/api/route", (req: Request, res: Response) => {
  const resourceName = DEFAULT_RESOURCE_NAME;
  const graph : Graph = graphs[resourceName];

  // TODO validate params
  const origin = req.query.origin as string;
  const destination = req.query.destination as string;

  console.log(`GET /api/route?origin=${origin}&destination=${destination} ...`);

  const routing = new RoutingService(graph);
  try {
    // console.log(graph.findVertexById(origin));
    // console.log(graph.findVertexById(destination));
    const route = routing.findRoute(
      graph.findVertexById(origin),
      graph.findVertexById(destination)
    );

    const features = route.map((edge: Edge) => {
      return {
        type: "Feature",
        properties: {
          id: edge.id,
          cost: edge.getLength()
        },
        geometry: edge.getGeometry()
      }
    });
    return res.json({
      type: "FeatureCollection",
      features: features
    });
  }catch(e){
    if ( e instanceof RouteNotFound ){
      res.status(404).json({
        type: "RouteNotFound",
        message: `No route found from ${origin} to ${destination}`
      })
    }else{
      res.status(500).json({
        type: "SystemError",
        message: "An system error occurs..."
      })
    }
  }
});


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});