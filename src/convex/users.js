import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const saveUser = mutation({
  args: { 
    name: v.string(), 
    email: v.string(), 
    auth0UserId: v.string(), 
    saved_ideas: v.optional(v.array(v.string())) 
  },
  handler: async (ctx, { name, email, auth0UserId, saved_ideas = [] }) => {
    const existingUser = await ctx.db.query("users")
      .filter(q => q.eq(q.field("auth0UserId"), auth0UserId))
      .first();
      
    if (!existingUser) {
      return await ctx.db.insert("users", { name, email, auth0UserId, saved_ideas });
    } else {
      return existingUser;
    }
  },
});