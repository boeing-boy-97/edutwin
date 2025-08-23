import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export async function generateText(prompt: string): Promise<string> {
  if(!process.env.OPENAI_API_KEY){ return `FAKE_AI_RESPONSE: ${prompt.slice(0,140)}...`; }
  const res = await client.chat.completions.create({ model: 'gpt-4o-mini', messages:[{role:'system',content:'Educational assistant.'},{role:'user',content:prompt}], temperature:0.4 });
  return res.choices?.[0]?.message?.content || '';
}
