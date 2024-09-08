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
    user_id: v.string(), // Ensure user_id is included in the args
    title: v.string(),
    description: v.string(),
    problem: v.string(),
    solution: v.string(),
    category: v.string(),
    score_id: v.optional(v.string()),
    plan_id: v.optional(v.string())
  },
  handler: async (ctx, { ideaId, user_id, title, description, problem, solution, category, score_id = "", plan_id = "" }) => {
    // Fetch the idea from the database
    const idea = await ctx.db.get(ideaId);

    // Check if the user_id matches the user_id of the idea
    if (idea.user_id !== user_id) {
      throw new Error("Unauthorized: You can only update your own ideas.");
    }

    // Proceed with the update
    return await ctx.db.replace(ideaId, {
      user_id, // Ensure user_id is included in the update
      title,
      description,
      problem,
      solution,
      category,
      score_id,
      plan_id
    });
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