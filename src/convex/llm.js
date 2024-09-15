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

      Please provide scores (0-10) and explanations for the following criteria
      (be critical and don't be afraid to give scores lower than 5):
      1. Innovation
      2. Market Fit
      3. Feasibility
      4. Scalability
       5. Profitability`;

      const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-mini-2024-07-18",
        messages: [
          { role: "system", content: "You are an expert startup evaluator. Provide detailed, objective evaluations." },
          { role: "user", content: prompt },
        ],
        response_format: zodResponseFormat(ScoreSchema, "evaluation"),
      });

      const { evaluation } = completion.choices[0].message.parsed;
      
      // Calculate the overall score as the average of the 5 criteria scores
      const criteriaScores = Object.values(evaluation.criteria_scores).filter(score => typeof score === 'number');
      const overallScore = criteriaScores.reduce((sum, score) => sum + score, 0) / criteriaScores.length;

      // Add the idea_id and calculated overall_score to the score object
      return {
        idea_id: args.idea_id,
        evaluation: {
          ...evaluation,
          overall_score: Number(overallScore.toFixed(1)), // Round to 2 decimal places
        },
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
      4. Legal: Highlight important legal considerations and steps.
      
      Ensure each aspect is explained in a single, well-formed paragraph without bullet points or line breaks.`;
  
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

  const CompetitorSchema = z.object({
    name: z.string(),
    VisionCompleteness: z.number().int(),
    ExecutionAbility: z.number().int(),
    isMainIdea: z.boolean()
  });
  
  const CompetitorsArraySchema = z.object({
    competitors: z.array(CompetitorSchema)
  });
  
  export const generateCompetitors = action({
    args: { 
      title: v.string(),
      category: v.string(),
      description: v.string(),
      problem: v.string(),
      solution: v.string(),
    },
    handler: async (_, args) => {
      const prompt = `Generate a competitive analysis including the main startup idea and 4 real-life competitors:
  
      Main Startup Idea:
      Title: ${args.title}
      Category: ${args.category}
      Description: ${args.description}
      Problem: ${args.problem}
      Solution: ${args.solution}
  
      For the main idea and each competitor, provide:
      1. The name (use "${args.title}" for the main idea, real company names for competitors)
      2. An Visision Completeness score (1-10, where 10 is the most complete vision, don't be afraid to give lower scores)
      3. A Execution Ability score (1-10, where 10 is the highest execution ability, don't be afraid to give lower scores)
      4. Whether it's the main idea (true) or a competitor (false)
  
      Ensure the competitors are diverse in their approach and market position. 
      Double check the competitors are companies that do exisit in real life.
      Be critical in scoring (some companies must get scores lower than 4 for vision completeness and execution ability for differentiation).`;
  
      const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-mini-2024-07-18",
        messages: [
          { role: "system", content: "You are an expert in market analysis. Provide an objective competitive analysis including the main idea and real competitors." },
          { role: "user", content: prompt },
        ],
        response_format: zodResponseFormat(CompetitorsArraySchema, "competitors"),
      });
  
      const { competitors } = completion.choices[0].message.parsed;
  
      // Ensure the main idea is included and marked correctly
      const mainIdeaIncluded = competitors.some(comp => comp.isMainIdea);
      if (!mainIdeaIncluded) {
        throw new Error("The main idea was not included in the generated competitors.");
      }
  
      return competitors;
    },
  });

  const RiskFactorSchema = z.object({
    factor: z.string(),
    impact: z.number().int(),
    likelihood: z.number().int(),
    mitigation: z.string(),
  });
  
  const RiskAssessmentSchema = z.object({
    risks: z.array(RiskFactorSchema)
  });
  
  export const generateRiskAssessment = action({
    args: { 
      title: v.string(),
      category: v.string(),
      description: v.string(),
      problem: v.string(),
      solution: v.string(),
    },
    handler: async (_, args) => {
      const prompt = `Generate a risk assessment for the following startup idea:
      Title: ${args.title}
      Category: ${args.category}
      Description: ${args.description}
      Problem: ${args.problem}
      Solution: ${args.solution}
  
      Please provide 3 key risk factors. For each risk factor, include:
      1. A specifc risk factor name (not large picture risk factors like market risk, but more specific)
      2. Impact score (1-3, where 3 is highest impact)
      3. Likelihood score (1-3, where 3 is most likely)
      4. A brief yet non-generic mitigation strategy
  
      Ensure the risks are diverse and cover different aspects of the business (e.g., market, technical, financial, operational, legal).
      Ensure each risk factors have different impact scores`;
  
      const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-mini-2024-07-18",
        messages: [
          { role: "system", content: "You are an expert in startup risk assessment. Provide a detailed, objective risk analysis." },
          { role: "user", content: prompt },
        ],
        response_format: zodResponseFormat(RiskAssessmentSchema, "risks"),
      });
  
      const { risks } = completion.choices[0].message.parsed;
      return risks;
    },
  });

  const ConsumerSegmentSchema = z.object({
    name: z.string(),
    percentage: z.number()
  });
  
  const ConsumerSegmentAnalysisSchema = z.object({
    segments: z.array(ConsumerSegmentSchema)
  });
  
  export const generateConsumerSegments = action({
    args: { 
      title: v.string(),
      category: v.string(),
      description: v.string(),
      problem: v.string(),
      solution: v.string(),
    },
    handler: async (_, args) => {
      const prompt = `Generate a consumer segment analysis for the following startup idea:
      Title: ${args.title}
      Category: ${args.category}
      Description: ${args.description}
      Problem: ${args.problem}
      Solution: ${args.solution}
  
      Please provide the top 4 consumer segments for this idea. For each segment, include:
      1. The consumer segment name
      2. The percentage of the total market this segment represents (ensure all percentages add up to 100%)
  
      Ensure the segments are distinct and relevant to the startup idea.`;
  
      const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-mini-2024-07-18",
        messages: [
          { role: "system", content: "You are an expert in market analysis and consumer segmentation. Provide a detailed, objective consumer segment analysis." },
          { role: "user", content: prompt },
        ],
        response_format: zodResponseFormat(ConsumerSegmentAnalysisSchema, "segments"),
      });
  
      const { segments } = completion.choices[0].message.parsed;
      return segments;
    },
  });