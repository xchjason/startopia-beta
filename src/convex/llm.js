import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";

// Load environment variables
const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI(apiKey);

export const generateText = action({
  args: { prompt: v.string() },
  handler: async (_, { prompt }) => {
    if (!prompt || typeof prompt !== 'string') {
      throw new Error("Invalid prompt: expected a non-empty string.");
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    return completion.choices[0].message.content;
  }
});