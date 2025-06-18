import { openai } from '@ai-sdk/openai'; // ← bu paket yüklü olmalı
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { weatherTool } from '../tools/weather-tool';

export const weatherAgent = new Agent({
  name: 'Weather Agent',
instructions: `
  You are a weather assistant that provides detailed and friendly weather reports.
  When replying:
  - Mention the temperature and feels-like temperature
  - Include humidity, wind, UV index, and visibility
  - Give recommendations based on high UV or low visibility
  - Format numbers clearly (e.g. use °C, km/h, meters)
  - Respond in a friendly tone with complete sentences
  - If it's night time (isDay === false), mention it is nighttime.
`,

  model: openai('gpt-4o'), // ya da 'gpt-3.5-turbo' gibi başka bir model
  tools: { weatherTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
});
