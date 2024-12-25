import { BaseMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { RunnableConfig } from '@langchain/core/runnables';
import { Annotation, END, messagesStateReducer, START, StateGraph } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';

const messagesStateAnnotation = Annotation<BaseMessage[]>({
  // `messagesStateReducer` function defines how `messages` state key should be updated
  // (in this case it appends new messages to the list and overwrites messages with the same ID)
  reducer: messagesStateReducer,
});

const StateAnnotation = Annotation.Root({
  messages: messagesStateAnnotation,
  input: Annotation<string>,
});

// Define the function that calls the model
async function callModel(state: typeof StateAnnotation.State) {
  console.info('Call Model: ', state);
  const openAIModel = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-3.5-turbo',
    streaming: true,
  });

  const systemMessage = new SystemMessage({
    content: 'You are a helpful assistant.',
  });

  state.messages = state.messages || [];

  const messages = [systemMessage, ...state.messages];

  const response = await openAIModel.invoke(messages, {});

  // We return a list, because this will get added to the existing list
  return { messages: [response] };
}

// Modify user input into human messages format
function giveMeJoke(state: typeof StateAnnotation.State, config?: RunnableConfig) {
  console.info('Format Input: ', state, config);
  const promptInput = `${state.input}. Tell me a joke? that list 10 jokes.`;
  return { messages: [new HumanMessage(promptInput)] };
}

// Check if the input contains a format command
function routingFunction(state: typeof StateAnnotation.State) {
  console.info('Routing Function: ', state);
  if (state.input?.includes('format:')) {
    return 'callJoke';
  }
  return 'next';
}

export const stateGraph = new StateGraph(StateAnnotation)
  .addNode('giveMeJoke', giveMeJoke)
  .addNode('callModel', callModel)
  .addConditionalEdges(START, routingFunction, {
    callJoke: 'giveMeJoke',
    next: 'callModel',
  })
  .addEdge('giveMeJoke', 'callModel')
  .addEdge('callModel', END);

// export const graph = workflow.compile();

// graph.name = 'langgraph-start';
