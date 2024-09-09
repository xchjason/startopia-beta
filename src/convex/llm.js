import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

// Load environment variables
const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI(apiKey);

// Define the Idea schema using Zod
const IdeaSchema = z.object({
  title: z.string(),
  description: z.string(),
  problem: z.string(),
  solution: z.string(),
  category: z.string(),
});

// Define the array of ideas schema without length constraint
const IdeasArraySchema = z.object({
  ideas: z.array(IdeaSchema)
});

export const generateText = action({
  args: { prompt: v.string() },
  handler: async (_, { prompt }) => {
    if (!prompt || typeof prompt !== 'string') {
      throw new Error("Invalid prompt: expected a non-empty string.");
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [{ role: "user", content: prompt }]
    });

    return completion.choices[0].message.content;
  }
});

// Updated function to generate multiple idea JSONs using structured output
export const generateIdeas = action({
  args: { prompt: v.string(), user_id: v.string() },
  handler: async (_, { prompt, user_id }) => {
    if (!prompt || typeof prompt !== 'string') {
      throw new Error("Invalid prompt: expected a non-empty string.");
    }

    if (!user_id || typeof user_id !== 'string') {
      throw new Error("Invalid user_id: expected a non-empty string.");
    }

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        { role: "system", content: "Generate exactly 3 different startup ideas based on the given statement. Provide these ideas in an array named 'ideas'." },
        { role: "user", content: prompt },
      ],
      response_format: zodResponseFormat(IdeasArraySchema, "ideas"),
    });

    const { ideas } = completion.choices[0].message.parsed;

    // Ensure we have exactly 3 ideas
    if (ideas.length !== 3) {
      throw new Error(`Expected 3 ideas, but received ${ideas.length}`);
    }

    return ideas.map(idea => ({
      user_id: user_id,
      ...idea,
      score_id: "", // Optional field
      plan_id: "",  // Optional field
    }));
  }
});