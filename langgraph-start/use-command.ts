import { Annotation, Command, START, StateGraph } from '@langchain/langgraph';

const StateAnnotation = Annotation.Root({
  foo: Annotation<string>,
});

const nodeA = async (state: typeof StateAnnotation.State) => {
  console.log('Call node A');

  const nextNode = Math.random() > 0.5 ? 'nodeB' : 'nodeC';

  return new Command({
    update: {
      foo: 'a',
    },
    goto: nextNode,
  });
};

const nodeB = async (state: typeof StateAnnotation.State) => {
  console.log('Call node B');

  return {
    foo: state.foo + ' => b',
  };
};

const nodeC = async (state: typeof StateAnnotation.State) => {
  console.log('Call node C');

  return {
    foo: state.foo + ' => c',
  };
};

export const useCommandGraph = new StateGraph(StateAnnotation)
  .addNode('nodeA', nodeA, {
    ends: ['nodeB', 'nodeC'],
  })
  .addNode('nodeB', nodeB)
  .addNode('nodeC', nodeC)
  .addEdge(START, 'nodeA');
