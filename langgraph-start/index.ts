// import { stateGraph } from './state-graph';
// export const graph = stateGraph.compile();

// import { mapReduceGraph } from './map-reduce';
// export const graph = mapReduceGraph.compile();

// import { useCommandGraph } from './use-command';
// export const graph = useCommandGraph.compile();

import { persistenceStateGraph } from './persistence';
export const graph = persistenceStateGraph.compile();

graph.name = 'langgraph-start';
