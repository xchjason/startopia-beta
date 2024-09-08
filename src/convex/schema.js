import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    auth0UserId: v.string(),
    name: v.string(),
    email: v.string(),
    saved_ideas: v.optional(v.array(v.string())),
  }),
  ideas: defineTable({
    user_id: v.string(),
    title: v.string(),
    problem: v.string(),
    category: v.string(),
    description: v.string(),
    score_id: v.string(),
    plan_id: v.string(),
    created_at: v.number(),
    updated_at: v.number(),
  }),
  scores: defineTable({
    idea_id: v.string(),
    overall_score: v.number(),
    criteria_scores: v.object({
      innovation: v.number(),
      market_fit: v.number(),
      feasibility: v.number(),
      scalability: v.number(),
      profitability: v.number(),
    }),
    generated_by: v.string(),
    created_at: v.number(),
  }),
  plans: defineTable({
    idea_id: v.string(),
    tech: v.string(),
    talent: v.string(),
    finance: v.string(),
    legal: v.string(),
    created_at: v.number(),
  }),
});