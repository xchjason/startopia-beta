import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mutation to create a new idea
export const createIdea = mutation({
  args: {
    user_id: v.string(),
    title: v.string(),
    description: v.string(),
    problem: v.string(),
    solution: v.string(),
    category: v.string(),
    score_id: v.optional(v.string()),
    plan_id: v.optional(v.string())
  },
  handler: async (ctx, { user_id, title, description, problem, solution, category, score_id = "", plan_id = "" }) => {
    const idea = {
      user_id,
      title,
      description,
      problem,
      solution,
      category,
      score_id,
      plan_id
    };

    return await ctx.db.insert("ideas", idea);
  }
});

// Mutation to update an existing idea
export const updateIdea = mutation({
  args: {
    ideaId: v.id("ideas"),
    user_id: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    problem: v.optional(v.string()),
    solution: v.optional(v.string()),
    category: v.optional(v.string()),
    score_id: v.optional(v.string()),
    plan_id: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const { ideaId, user_id, ...updates } = args;

    // Fetch the idea from the database
    const idea = await ctx.db.get(ideaId);

    // Check if the user_id matches the user_id of the idea
    if (idea.user_id !== user_id) {
      throw new Error("Unauthorized: You can only update your own ideas.");
    }

    // Remove undefined values from updates
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    // Proceed with the update
    return await ctx.db.patch(ideaId, filteredUpdates);
  }
});

// Mutation to delete an idea
export const deleteIdea = mutation({
  args: { ideaId: v.id("ideas") },
  handler: async (ctx, { ideaId }) => {
    return await ctx.db.delete(ideaId);
  }
});

// Query to get all ideas for a specific user
export const getIdeasByUser = query({
  args: { user_id: v.string() },
  handler: async (ctx, { user_id }) => {

    const ideas = await ctx.db.query("ideas").filter(q => q.eq(q.field("user_id"), user_id)).collect();
    
    return ideas;
  }
});

// Query to get a specific idea by its ID
export const getIdeaById = query({
  args: { ideaId: v.id("ideas") },
  handler: async (ctx, { ideaId }) => {
    return await ctx.db.get(ideaId);
  }
});

export const getAllIdeas = query({
  handler: async (ctx) => {
    const ideas = await ctx.db.query("ideas").collect();
    console.log(`All ideas: ${JSON.stringify(ideas)}`);
    return ideas;
  }
});

export const createScore = mutation({
  args: {
    idea_id: v.id("ideas"),
    overall_score: v.number(),
    criteria_scores: v.object({
      innovation: v.number(),
      innovation_explanation: v.string(),
      market_fit: v.number(),
      market_fit_explanation: v.string(),
      feasibility: v.number(),
      feasibility_explanation: v.string(),
      scalability: v.number(),
      scalability_explanation: v.string(),
      profitability: v.number(),
      profitability_explanation: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const scoreId = await ctx.db.insert("scores", args);
    
    // Update the idea with the new score_id
    await ctx.db.patch(args.idea_id, { score_id: scoreId });
    
    return scoreId;
  },
});

// Mutation to create a new plan
export const createPlan = mutation({
  args: {
    idea_id: v.id("ideas"),
    tech: v.string(),
    talent: v.string(),
    finance: v.string(),
    legal: v.string(),
  },
  handler: async (ctx, args) => {
    const planId = await ctx.db.insert("plans", args);
    
    // Update the idea with the new plan_id
    await ctx.db.patch(args.idea_id, { plan_id: planId });
    
    return planId;
  },
});