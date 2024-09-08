import { action } from "./_generated/server";
import { v } from "convex/values";
import fetch from 'node-fetch';

// Load environment variables
const apiKey = process.env.OPENAI_API_KEY;

export const generateText = action({
  args: { prompt: v.string() },
  handler: async (_, { prompt }) => {
    if (!prompt || typeof prompt !== 'string') {
      throw new Error("Invalid prompt: expected a non-empty string.");
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4", // Use the appropriate chat model
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error.message}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
});