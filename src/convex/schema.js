import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ideas: defineTable({
    user_id: v.string(),
    title: v.string(),
    description: v.string(), //brief description of the service or product
    problem: v.string(),
    solution: v.string(),
    category: v.string(),
    score_id: v.optional(v.union(v.id("scores"), v.string())),
    plan_id: v.optional(v.union(v.id("plans"), v.string())),
    competitors: v.optional(v.string()),
    risk: v.optional(v.string()),
    consumers: v.optional(v.string()),
  }),
  scores: defineTable({
    idea_id: v.id("ideas"),
    overall_score: v.number(),
    criteria_scores: v.object({
      innovation: v.number(),
      innovation_explanation: v.string(), // explanation for innovation score
      market_fit: v.number(),
      market_fit_explanation: v.string(), // explanation for market fit score
      feasibility: v.number(),
      feasibility_explanation: v.string(), // explanation for feasibility score
      scalability: v.number(),
      scalability_explanation: v.string(), // explanation for scalability score
      profitability: v.number(),
      profitability_explanation: v.string(), // explanation for profitability score
    }),
  }),
  plans: defineTable({
    idea_id: v.id("ideas"),
    tech: v.string(),
    talent: v.string(),
    finance: v.string(),
    legal: v.string(),
  }),
  users: defineTable({
    auth0UserId: v.string(),
    name: v.string(),
    email: v.string(),
    saved_ideas: v.optional(v.array(v.string())),
  }),
});