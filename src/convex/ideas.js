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
    plan_id: v.optional(v.string()),
    competitors: v.optional(v.string()),
  },
  handler: async (ctx, { user_id, title, description, problem, solution, category, score_id = "", plan_id = "", competitors = "" }) => {
    const idea = {
      user_id,
      title,
      description,
      problem,
      solution,
      category,
      score_id,
      plan_id,
      competitors,
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
    score_id: v.optional(v.union(v.string(), v.null())),
    plan_id: v.optional(v.union(v.string(), v.null())),
    competitors: v.optional(v.union(v.string(), v.null())),
    risk: v.optional(v.union(v.string(), v.null())),
    consumers: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const { ideaId, user_id, ...updates } = args;

    const idea = await ctx.db.get(ideaId);

    if (idea.user_id !== user_id) {
      throw new Error("Unauthorized: You can only update your own ideas.");
    }

    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    return await ctx.db.patch(ideaId, filteredUpdates);
  }
});

// New mutation to reset an idea
export const resetIdea = mutation({
  args: {
    ideaId: v.id("ideas"),
    user_id: v.string(),
  },
  handler: async (ctx, { ideaId, user_id }) => {
    const idea = await ctx.db.get(ideaId);

    if (!idea) {
      throw new Error("Idea not found");
    }

    if (idea.user_id !== user_id) {
      throw new Error("Unauthorized: You can only reset your own ideas.");
    }

    // Remove related data from scores table
    if (idea.score_id) {
      await ctx.db.delete(idea.score_id);
    }

    // Remove related data from plans table
    if (idea.plan_id) {
      await ctx.db.delete(idea.plan_id);
    }

    // Update the idea, removing all related fields
    await ctx.db.patch(ideaId, {
      score_id: undefined,
      plan_id: undefined,
      competitors: undefined,
      risk: undefined,
      consumers: undefined,
    });

    return ideaId;
  },
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
    const ideas = await ctx.db.query("ideas")
      .filter(q => q.eq(q.field("user_id"), user_id))
      .collect();
    
    return ideas.map(idea => {
      if (idea.competitors) {
        idea.competitors = JSON.parse(idea.competitors);
      }
      return idea;
    });
  }
});

// Query to get a specific idea by its ID
export const getIdeaById = query({
  args: { ideaId: v.id("ideas") },
  handler: async (ctx, { ideaId }) => {
    const idea = await ctx.db.get(ideaId);
    if (idea && idea.competitors) {
      idea.competitors = JSON.parse(idea.competitors);
    }
    return idea;
  }
});

// Query to get all ideas
export const getAllIdeas = query({
  handler: async (ctx) => {
    const ideas = await ctx.db.query("ideas").collect();
    return ideas.map(idea => {
      if (idea.competitors) {
        idea.competitors = JSON.parse(idea.competitors);
      }
      return idea;
    });
  }
});

// Mutation to create or update a score
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
    const existingScore = await ctx.db.query("scores")
      .filter(q => q.eq(q.field("idea_id"), args.idea_id))
      .first();

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

      await ctx.db.patch(args.idea_id, { score_id: scoreId });

      return scoreId;
    }
  },
});

// Mutation to create or update a plan
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
    const existingPlan = await ctx.db.query("plans")
      .filter(q => q.eq(q.field("idea_id"), args.idea_id))
      .first();

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

      await ctx.db.patch(args.idea_id, { plan_id: planId });

      return planId;
    }
  },
});

// Query to get evaluation for a specific idea
export const getEvaluation = query({
  args: { ideaId: v.id("ideas") },
  handler: async (ctx, { ideaId }) => {
    const idea = await ctx.db.get(ideaId);
    if (!idea || !idea.score_id) return null;
    return await ctx.db.get(idea.score_id);
  }
});

// Query to get plan for a specific idea
export const getPlan = query({
  args: { ideaId: v.id("ideas") },
  handler: async (ctx, { ideaId }) => {
    const idea = await ctx.db.get(ideaId);
    if (!idea || !idea.plan_id) return null;
    return await ctx.db.get(idea.plan_id);
  }
});

// Mutation to update competitors for an idea
export const updateCompetitors = mutation({
  args: {
    ideaId: v.id("ideas"),
    competitors: v.array(v.object({
      name: v.string(),
      VisionCompleteness: v.number(),
      ExecutionAbility: v.number(),
      isMainIdea: v.boolean()
    }))
  },
  handler: async (ctx, { ideaId, competitors }) => {
    return await ctx.db.patch(ideaId, { competitors: JSON.stringify(competitors) });
  },
});

// Query to get competitors for a specific idea
export const getCompetitors = query({
  args: { ideaId: v.id("ideas") },
  handler: async (ctx, { ideaId }) => {
    const idea = await ctx.db.get(ideaId);
    return idea?.competitors ? JSON.parse(idea.competitors) : [];
  },
});

export const getRisks = query({
  args: { ideaId: v.id("ideas") },
  handler: async (ctx, args) => {
    const idea = await ctx.db.get(args.ideaId);
    return idea?.risk ? JSON.parse(idea.risk) : null;
  },
});

export const updateRisks = mutation({
  args: { 
    ideaId: v.id("ideas"),
    risks: v.array(v.object({
      factor: v.string(),
      impact: v.number(),
      likelihood: v.number(),
      mitigation: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.ideaId, { risk: JSON.stringify(args.risks) });
  },
});

export const getConsumers = query({
  args: { ideaId: v.id("ideas") },
  handler: async (ctx, args) => {
    const idea = await ctx.db.get(args.ideaId);
    return idea?.consumers ? JSON.parse(idea.consumers) : null;
  },
});

export const updateConsumers = mutation({
  args: { 
    ideaId: v.id("ideas"),
    consumers: v.array(v.object({
      name: v.string(),
      percentage: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.ideaId, { consumers: JSON.stringify(args.consumers) });
  },
});