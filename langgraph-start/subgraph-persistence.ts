import { StateGraph, Annotation } from '@langchain/langgraph';

// subgraph

const SubgraphStateAnnotation = Annotation.Root({
  foo: Annotation<string>,
  bar: Annotation<string>,
});

const subgraphNode1 = async (state: typeof SubgraphStateAnnotation.State) => {
  return { bar: 'bar' };
};

const subgraphNode2 = async (state: typeof SubgraphStateAnnotation.State) => {
  // note that this node is using a state key ('bar') that is only available in the subgraph
  // and is sending update on the shared state key ('foo')
  return { foo: state.foo + state.bar };
};

const subgraph = new StateGraph(SubgraphStateAnnotation)
  .addNode('subgraphNode1', subgraphNode1)
  .addNode('subgraphNode2', subgraphNode2)
  .addEdge('__start__', 'subgraphNode1')
  .addEdge('subgraphNode1', 'subgraphNode2')
  .compile();

// parent graph
const StateAnnotation = Annotation.Root({
  foo: Annotation<string>,
});

const node1 = async (state: typeof StateAnnotation.State) => {
  return {
    foo: 'hi! ' + state.foo,
  };
};

export const subgraphPersistence = new StateGraph(StateAnnotation)
  .addNode('node1', node1)
  // note that we're adding the compiled subgraph as a node to the parent graph
  .addNode('node2', subgraph)
  .addEdge('__start__', 'node1')
  .addEdge('node1', 'node2');
