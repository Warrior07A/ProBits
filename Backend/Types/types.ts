import z from "zod";

export const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  role : z.enum(['student' , 'teacher']).optional()
});

export const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
