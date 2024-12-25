// import { stateGraph } from './state-graph';
// export const graph = stateGraph.compile();

import { mapReduceGraph } from './map-reduce';
export const graph = mapReduceGraph.compile();

graph.name = 'langgraph-start';
