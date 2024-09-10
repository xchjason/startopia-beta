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

// Define the Score schema using Zod
const ScoreSchema = z.object({
    evaluation: z.object({
      overall_score: z.number(),
      criteria_scores: z.object({
        innovation: z.number(),
        innovation_explanation: z.string(),
        market_fit: z.number(),
        market_fit_explanation: z.string(),
        feasibility: z.number(),
        feasibility_explanation: z.string(),
        scalability: z.number(),
        scalability_explanation: z.string(),
        profitability: z.number(),
        profitability_explanation: z.string(),
      }),
    }),
  });
  
  // Define the Plan schema using Zod
  const PlanSchema = z.object({
    plan: z.object({
      tech: z.string(),
      talent: z.string(),
      finance: z.string(),
      legal: z.string(),
    }),
  });
  
  export const evaluateIdea = action({
    args: { 
      idea_id: v.string(),
      title: v.string(),
      description: v.string(),
      problem: v.string(),
      solution: v.string(),
      category: v.string(),
    },
    handler: async (_, args) => {
      const prompt = `Evaluate the following startup idea:
      Title: ${args.title}
      Description: ${args.description}
      Problem: ${args.problem}
      Solution: ${args.solution}
      Category: ${args.category}
  
      Please provide scores (0-10) and explanations for the following criteria:
      1. Innovation
      2. Market Fit
      3. Feasibility
      4. Scalability
      5. Profitability
  
      Also, calculate an overall score as the average of these 5 scores.`;
  
      const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-mini-2024-07-18",
        messages: [
          { role: "system", content: "You are an expert startup evaluator. Provide detailed, objective evaluations." },
          { role: "user", content: prompt },
        ],
        response_format: zodResponseFormat(ScoreSchema, "evaluation"),
      });
  
      const { evaluation } = completion.choices[0].message.parsed;
      
      // Add the idea_id to the score object
      return {
        idea_id: args.idea_id,
        ...evaluation,
      };
    },
  });
  
  export const generatePlan = action({
    args: { 
      idea_id: v.string(),
      title: v.string(),
      description: v.string(),
      problem: v.string(),
      solution: v.string(),
      category: v.string(),
    },
    handler: async (_, args) => {
      const prompt = `Generate a high-level plan for the following startup idea:
      Title: ${args.title}
      Description: ${args.description}
      Problem: ${args.problem}
      Solution: ${args.solution}
      Category: ${args.category}
  
      Please provide plans for the following aspects:
      1. Tech: Outline the key technologies and development steps.
      2. Talent: Describe the key roles and skills needed.
      3. Finance: Provide a basic financial strategy and funding needs.
      4. Legal: Highlight important legal considerations and steps.`;
  
      const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-mini-2024-07-18",
        messages: [
          { role: "system", content: "You are an expert startup planner. Provide concise, actionable plans." },
          { role: "user", content: prompt },
        ],
        response_format: zodResponseFormat(PlanSchema, "plan"),
      });
  
      const { plan } = completion.choices[0].message.parsed;
      
      // Add the idea_id to the plan object
      return {
        idea_id: args.idea_id,
        ...plan,
      };
    },
  });