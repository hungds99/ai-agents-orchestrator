// import { stateGraph } from './state-graph';
// export const graph = stateGraph.compile();

// import { mapReduceGraph } from './map-reduce';
// export const graph = mapReduceGraph.compile();

// import { useCommandGraph } from './use-command';
// export const graph = useCommandGraph.compile();

// import { PostgresSaver } from '@langchain/langgraph-checkpoint-postgres';
// import { persistenceStateGraph } from './persistence';
// import pg from 'pg';
// import { MemorySaver } from '@langchain/langgraph';
// import { subgraphPersistence } from './subgraph-persistnce';

// const { Pool } = pg;
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// const postgresMemory = new PostgresSaver(pool);
// postgresMemory.setup();

// const memory = new MemorySaver();

// export const graph = persistenceStateGraph.compile({
//   // checkpointer: postgresMemory,
//   // checkpointer: memory,
// });

import { subgraphPersistence } from './subgraph-persistence';

export const graph = subgraphPersistence.compile();

graph.name = 'langgraph-start';
