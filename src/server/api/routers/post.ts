import { z } from "zod";
import { eq } from "drizzle-orm";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "facuCampodonico/server/api/trpc";
import { posts } from "facuCampodonico/server/db/schema";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await ctx.db.insert(posts).values({
        name: input.name,
        createdById: ctx.session.user.id,
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  getAllPosts: publicProcedure.query(async ({ ctx }) => {
    const allPosts = await ctx.db.query.posts.findMany(); // Consulta para obtener todas las publicaciones
    return allPosts;
  }),

  delete: protectedProcedure
  .input(z.number())
  .mutation(async ({ctx, input}) => {
    // simulate a slow db call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const postId = input
    //await ctx.db.delete(tareas).values(tareaABorrar)
    await ctx.db.delete(posts).where(eq(posts.id, postId))
  }),

  edit: protectedProcedure
  .input(z.object({ id: z.number(), name: z.string().min(1) }))
  .mutation(async ({ ctx, input }) => {
    await ctx.db.update(posts).set({ name: input.name }).where(eq(posts.id, input.id));
  }),

});
