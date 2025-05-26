import { Message, MessageRole } from './types/chat';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

if (!OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key');
}

export async function generateChatCompletion(messages: Message[]) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}

export async function generateEmailTemplate(
  subject: string,
  tone: 'formal' | 'casual' | 'friendly',
  points: string[]
) {
  const prompt = `
    Write a professional email with the following details:
    Subject: ${subject}
    Tone: ${tone}
    Key points to include:
    ${points.map(point => `- ${point}`).join('\n')}
    
    Please format the email appropriately and make it sound natural.
  `;

  try {
    const response = await generateChatCompletion([
      {
        id: 'system',
        role: 'system' as MessageRole,
        content: 'You are a professional email writing assistant.',
        created_at: new Date().toISOString(),
      },
      {
        id: 'user',
        role: 'user' as MessageRole,
        content: prompt,
        created_at: new Date().toISOString(),
      },
    ]);

    return response;
  } catch (error) {
    console.error('Error generating email template:', error);
    throw error;
  }
}

export async function analyzeData(data: string) {
  const prompt = `
    Please analyze the following data and provide insights:
    ${data}
    
    Please provide:
    1. Key findings
    2. Trends
    3. Recommendations
  `;

  try {
    const response = await generateChatCompletion([
      {
        id: 'system',
        role: 'system' as MessageRole,
        content: 'You are a data analysis expert.',
        created_at: new Date().toISOString(),
      },
      {
        id: 'user',
        role: 'user' as MessageRole,
        content: prompt,
        created_at: new Date().toISOString(),
      },
    ]);

    return response;
  } catch (error) {
    console.error('Error analyzing data:', error);
    throw error;
  }
} 