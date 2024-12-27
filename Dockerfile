FROM langchain/langgraphjs-api:20



ADD . /deps/ai-agents-orchestrator

RUN cd /deps/ai-agents-orchestrator && npm ci

ENV LANGSERVE_GRAPHS='{"agent": "./langgraph-start/index.ts:graph"}'

WORKDIR /deps/ai-agents-orchestrator

RUN (test ! -f /api/langgraph_api/js/build.mts && echo "Prebuild script not found, skipping") || tsx /api/langgraph_api/js/build.mts