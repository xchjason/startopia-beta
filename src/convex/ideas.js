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
    evaluation: v.object({
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
    }),
  },
  handler: async (ctx, args) => {
    const existingScore = await ctx.db.query("scores").filter(q => q.eq(q.field("idea_id"), args.idea_id)).first();

    if (existingScore) {
      await ctx.db.patch(existingScore._id, {
        ...args.evaluation
      });
      return existingScore._id;
    } else {
      const scoreId = await ctx.db.insert("scores", {
        idea_id: args.idea_id,
        ...args.evaluation
      });

      // Update the idea with the new score_id
      await ctx.db.patch(args.idea_id, { score_id: scoreId });

      return scoreId;
    }
  },
});

// Mutation to create a new plan
export const createPlan = mutation({
  args: {
    idea_id: v.id("ideas"),
    plan: v.object({
      tech: v.string(),
      talent: v.string(),
      finance: v.string(),
      legal: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const existingPlan = await ctx.db.query("plans").filter(q => q.eq(q.field("idea_id"), args.idea_id)).first();

    if (existingPlan) {
      await ctx.db.patch(existingPlan._id, {
        ...args.plan
      });
      return existingPlan._id;
    } else {
      const planId = await ctx.db.insert("plans", {
        idea_id: args.idea_id,
        ...args.plan
      });

      // Update the idea with the new plan_id
      await ctx.db.patch(args.idea_id, { plan_id: planId });

      return planId;
    }
  },
});
