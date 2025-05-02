import { z } from "zod";
export const signupInput = z.object({
  email: z.string().min(3, "email must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
});
export type SignupInput = z.infer<typeof signupInput>;

export const signinInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type SigninInput = z.infer<typeof signinInput>;
export const createBlogInput = z.object({
  title: z.string(),
  content: z.string(),
});
export type CreateBlogInput = z.infer<typeof createBlogInput>;

export const updateBlogInput = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
});
export type UpdateBlogInput = z.infer<typeof updateBlogInput>;
