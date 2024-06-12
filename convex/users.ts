import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const createUser = internalMutation({
    args: {
        clerkId: v.string(),
        email: v.string(),
        imageURL: v.string(),
        name: v.string(),
    }, handler: async (ctx, args) => {
        await ctx.db.insert('users', {
            clerkId: args.clerkId,
            email: args.email,
            imageURL: args.imageURL,
            name: args.name,
        });
    }
})