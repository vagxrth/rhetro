import { v } from "convex/values";
import { mutation } from "./_generated/server";
 
export const generateUploadURL = mutation({
  args: {

  },
  handler: async (ctx, args) => {
    return await ctx.storage.generateUploadUrl();
  },
});