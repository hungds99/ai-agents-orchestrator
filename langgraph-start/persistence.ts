import { AIMessage, BaseMessage } from '@langchain/core/messages';
import { RunnableConfig } from '@langchain/core/runnables';
import { tool } from '@langchain/core/tools';
import { Annotation, END, START, StateGraph } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';

const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (state, message) => state.concat(message),
  }),
});

// Tools
const searchTool = tool(
  ({}: { query: string }) => {
    return 'Cold, with a low of 20 degrees';
  },
  {
    name: 'search',
    description: 'Search for the weather',
    schema: z.object({
      query: z.string().describe('Query to search for the weather'),
    }),
  },
);

const tools = [searchTool];
const toolNode = new ToolNode(tools);

const model = new ChatOpenAI({ model: 'gpt-4o' }).bindTools(tools);

const routeMessage = (state: typeof StateAnnotation.State) => {
  console.log('Routing message: ', state.messages);
  const { messages } = state;
  const lastMessage = messages[messages.length - 1] as AIMessage;

  // If the last message was not a tool call, we should end the workflow
  if (!lastMessage.tool_calls?.length) {
    return END;
  }

  // If the last message was a tool call, we should call tools
  return 'tools';
};

const agent = async (state: typeof StateAnnotation.State, config?: RunnableConfig) => {
  const { messages } = state;
  const response = await model.invoke(messages, config);
  return { messages: [response] };
};

export const persistenceStateGraph = new StateGraph(StateAnnotation)
  .addNode('agent', agent)
  .addNode('tools', toolNode)
  .addEdge(START, 'agent')
  .addConditionalEdges('agent', routeMessage)
  .addEdge('tools', 'agent');
