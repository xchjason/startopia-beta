import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const saveUser = mutation({
  args: { name: v.string(), email: v.string(), auth0UserId: v.string() },
  handler: async (ctx, { name, email, auth0UserId }) => {
    // Predicate function provided to .filter()
    const existingUser = await ctx.db.query("users")
      .filter(q => q.eq(q.field("auth0UserId"), auth0UserId))
      .first();
      
    if (!existingUser) {
      return await ctx.db.insert("users", { name, email, auth0UserId });
    } else {
      return existingUser;
    }
  },
});
