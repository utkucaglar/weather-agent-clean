# weather-agent-clean

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.9.0-blue)](https://nodejs.org/) [![License](https://img.shields.io/badge/license-ISC-lightgrey)](LICENSE)

A Mastra-powered AI agent that answers natural-language weather queries by calling the **weather-mcp** REST API and persisting conversation memory.

> **Note:** This agent is designed to work alongside our previous project: [weather-mcp](https://github.com/utkucaglar/weather-mcp).

## Table of Contents

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Scripts](#scripts)
6. [Usage](#usage)
7. [API](#api)
8. [Examples](#examples)
9. [Troubleshooting](#troubleshooting)
10. [Contributing](#contributing)
11. [License](#license)

## Features

- **Natural-Language Queries**: Ask in plain English (or your language) for city weather.
- **Function Calling**: Uses OpenAI function-calling via `@ai-sdk/openai`.
- **Memory Persistence**: Stores conversation context in SQLite via `@mastra/libsql` & `@mastra/memory`.
- **Type-Safe Validation**: Validates tool inputs/outputs with **Zod**.
- **Mastra Utilities**: Built with `@mastra/core` and `@mastra/loggers` for pluggable agent tooling.

## Prerequisites

- **Node.js** ≥ 20.9.0
- **npm** (bundled with Node.js)
- **OpenAI API Key**
- **weather-mcp** service running (see [weather-mcp](https://github.com/utkucaglar/weather-mcp))

## Installation

```bash
git clone https://github.com/utkucaglar/weather-agent-clean.git
cd weather-agent-clean
npm install
```

## Configuration

Create a `.env` file in the project root and add:

```bash
# Your OpenAI credentials
OPENAI_API_KEY=your_openai_api_key_here

# URL of the weather-mcp REST server
WEATHER_API_URL=http://localhost:3000/weather

# (Optional) Path to SQLite DB for memory persistence
MEMORY_DB_PATH=./.data/weather-memory.sqlite
```

## Scripts

- `npm run dev` → Start Mastra in development mode with a playground & REST endpoints.
- `npm run build` → Compile your agent for production deployment.
- `npm run start` → Run the production build.

## Usage

### Development

```bash
npm run dev
```

By default, Mastra will launch a local server at `http://localhost:3000` with:

- Chat Playground (web UI)
- REST Endpoints for any exported agents

### Production

```bash
npm run build
npm run start
```

Your agent will be available at the same port (default 3000) in a lean, production-ready build.

## API

### POST /agent

Send a chat request to the weather agent.

**Request**

- **Content-Type**: `application/json`
- **Body**:

```json
{
  "messages": [
    { "role": "user", "content": "What's the weather in Paris today?" }
  ]
}
```

**Response**

Streams back an LLM response as Server-Sent Events (SSE) or JSON depending on client.

## Examples

### cURL (JSON)

```bash
curl -N -X POST http://localhost:3000/agent \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      { "role": "user", "content": "Do I need an umbrella in London?" }
    ]
  }'
```

### JavaScript (Fetch + EventSource)

```javascript
const res = await fetch('http://localhost:3000/agent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages: [{ role: 'user', content: 'Sunny in Tokyo?' }] })
});

// If SSE:
const reader = res.body.getReader();
while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  process.stdout.write(new TextDecoder().decode(value));
}
```

## Troubleshooting

- **“Missing API Key”**: Ensure `OPENAI_API_KEY` is set in `.env`.
- **“Cannot reach weather API”**: Verify `weather-mcp` is running at `WEATHER_API_URL`.
- **Memory DB Errors**: Check `MEMORY_DB_PATH` permissions or use an absolute path.

## Contributing

1. Fork this repository
2. Create your feature branch (`git checkout -b feat/my-feature`)
3. Commit changes (`git commit -m "Add awesome feature"`)
4. Push to branch (`git push origin feat/my-feature`)
5. Open a Pull Request

## License

ISC License
