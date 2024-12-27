// import { stateGraph } from './state-graph';
// export const graph = stateGraph.compile();

// import { mapReduceGraph } from './map-reduce';
// export const graph = mapReduceGraph.compile();

// import { useCommandGraph } from './use-command';
// export const graph = useCommandGraph.compile();

import { MemorySaver } from '@langchain/langgraph';
import { persistenceStateGraph } from './persistence';

const memory = new MemorySaver();

export const graph = persistenceStateGraph.compile({
  checkpointer: memory,
});

graph.name = 'langgraph-start';
