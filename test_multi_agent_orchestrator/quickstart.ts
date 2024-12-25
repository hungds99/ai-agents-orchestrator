import { MultiAgentOrchestrator, OpenAIAgent, OpenAIClassifier } from 'multi-agent-orchestrator';

const openaiClassifier = new OpenAIClassifier({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const orchestrator = new MultiAgentOrchestrator({
  classifier: openaiClassifier,
  config: {
    LOG_AGENT_CHAT: true,
    LOG_CLASSIFIER_CHAT: true,
    LOG_CLASSIFIER_RAW_OUTPUT: false,
    LOG_CLASSIFIER_OUTPUT: true,
    LOG_EXECUTION_TIMES: true,
  },
});

const techAgent = new OpenAIAgent({
  name: 'Tech Agent',
  description:
    'Specializes in technology areas including software development, hardware, AI, cybersecurity, blockchain, cloud computing, emerging tech innovations, and pricing/costs related to technology products and services.',
  apiKey: process.env.OPENAI_API_KEY || '',
  model: 'gpt-4',
  streaming: true,
});
orchestrator.addAgent(techAgent);

const healthAgent = new OpenAIAgent({
  name: 'Health Agent',
  description:
    'Focuses on health and medical topics such as general wellness, nutrition, diseases, treatments, mental health, fitness, healthcare systems, and medical terminology or concepts.',
  apiKey: process.env.OPENAI_API_KEY || '',
  model: 'gpt-4',
  streaming: true,
});

orchestrator.addAgent(healthAgent);

const userId = 'quickstart-user';
const sessionId = 'quickstart-session';
const query = 'What are the latest trends in AI?';
console.log(`\nUser Query: ${query}`);

async function main() {
  try {
    const response = await orchestrator.routeRequest(query, userId, sessionId);
    console.log('\n** RESPONSE ** \n');
    console.log(`> Agent ID: ${response.metadata.agentId}`);
    console.log(`> Agent Name: ${response.metadata.agentName}`);
    console.log(`> User Input: ${response.metadata.userInput}`);
    console.log(`> User ID: ${response.metadata.userId}`);
    console.log(`> Session ID: ${response.metadata.sessionId}`);
    console.log('> Additional Parameters:', response.metadata.additionalParams);
    console.log('\n> Response: ');
    // Stream the content
    for await (const chunk of response.output) {
      if (typeof chunk === 'string') {
        process.stdout.write(chunk);
      } else {
        console.error('Received unexpected chunk type:', typeof chunk);
      }
    }
    console.log();
  } catch (error) {
    console.error('An error occurred:', error);
    // Here you could also add more specific error handling if needed
  }
}

main();
