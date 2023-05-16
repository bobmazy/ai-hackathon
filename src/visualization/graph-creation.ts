import chunks from "../../data/embeddings.json";
import { EmbeddedSourceChunk } from "../../data/common/types";
import { promises as fs } from "fs";
import { create } from "xmlbuilder";
import { cosineSimilarity } from "../cosineSimilarity";
import { Graph, Node, Edge } from "./models/Graph";
import coloredLog from "../../data/common/coloredLog";

const threshold = 0.8;
const dataPath = "./src/visualization/graph.gexf";

function createGraph(chunks: EmbeddedSourceChunk[]): Graph {
  const graph = new Graph();

  chunks.forEach((chunk: EmbeddedSourceChunk) => {
    const title = chunk.title;
    graph.addNode({ id: title, label: title });

    chunks.forEach((otherChunk: EmbeddedSourceChunk) => {
      const otherTitle = otherChunk.title;
      if (title !== otherTitle) {
        const weight = cosineSimilarity(chunk.embedding, otherChunk.embedding);
        if (weight >= threshold) {
          graph.addEdge({
            source: title,
            target: otherTitle,
            weight: weight.toString(),
          });
        }
      }
    });
  });
  return graph;
}

function buildXml(graph: Graph) {
  const gexf = create("gexf", { version: "1.0", encoding: "UTF-8" });
  const graphElem = gexf.ele("graph", {
    defaultedgetype: "undirected",
    mode: "static",
  });

  const nodes = graphElem.ele("nodes");
  graph.nodes.forEach((node: Node) => {
    nodes.ele("node", { label: node.label });
  });

  const edges = graphElem.ele("edges");
  graph.edges.forEach((edge: Edge) => {
    edges.ele("edge", {
      source: edge.source,
      target: edge.target,
      weight: edge.weight,
    });
  });

  return gexf.end({ pretty: true });
}

async function writeDateToGexfFile<T>(outputFilePath: string) {
  try {
    const graph = createGraph(chunks as EmbeddedSourceChunk[]);

    const gexfContent: string = buildXml(graph);

    await fs
      .writeFile(outputFilePath, gexfContent)
      .catch((err) => console.error(err));
  } catch (error) {
    coloredLog("Failed to save data to file", "error", error);
  }
}

writeDateToGexfFile(dataPath);
