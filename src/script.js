import { Configuration, OpenAIApi } from 'openai';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
delete config.baseOptions.headers['User-Agent']
const openai = new OpenAIApi(config);
