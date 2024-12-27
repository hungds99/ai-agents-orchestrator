// import { stateGraph } from './state-graph';
// export const graph = stateGraph.compile();

// import { mapReduceGraph } from './map-reduce';
// export const graph = mapReduceGraph.compile();

// import { useCommandGraph } from './use-command';
// export const graph = useCommandGraph.compile();

// import { PostgresSaver } from '@langchain/langgraph-checkpoint-postgres';
import { persistenceStateGraph } from './persistence';
// import pg from 'pg';
import { MemorySaver } from '@langchain/langgraph';

// const { Pool } = pg;
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// const postgresMemory = new PostgresSaver(pool);
// postgresMemory.setup();

const memory = new MemorySaver();

export const graph = persistenceStateGraph.compile({
  // checkpointer: postgresMemory,
  // checkpointer: memory,
});

graph.name = 'langgraph-start';
