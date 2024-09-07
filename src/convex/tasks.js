import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Read all tasks
export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

// Create a new task
export const create = mutation({
  args: { text: v.string(), isCompleted: v.boolean() },
  handler: async (ctx, { text, isCompleted }) => {
    const task = { text, isCompleted };
    return await ctx.db.insert("tasks", task);
  },
});

// Update a task by ID
export const update = mutation({
  args: { id: v.id("tasks"), text: v.string(), isCompleted: v.boolean() },
  handler: async (ctx, { id, text, isCompleted }) => {
    return await ctx.db.replace(id, { text, isCompleted });
  },
});

// Delete a task by ID
export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, { id }) => {
    return await ctx.db.delete(id);
  },
});