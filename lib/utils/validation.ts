/**
 * Zod validation schemas matching backend validations
 */

import { z } from "zod";

export const schemas = {
  // Auth schemas
  loginSchema: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),

  registerSchema: z
    .object({
      email: z.string().email("Invalid email address"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
      confirmPassword: z.string(),
      firstName: z.string().min(2, "First name must be at least 2 characters"),
      lastName: z.string().min(2, "Last name must be at least 2 characters"),
      phone: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }),

  // Event registration
  eventRegistrationSchema: z.object({
    firstName: z.string().min(2, "First name required"),
    lastName: z.string().min(2, "Last name required"),
    email: z.string().email("Invalid email"),
    phone: z.string().optional(),
  }),

  // Prayer submission
  prayerSchema: z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    category: z.string().optional(),
  }),

  // Giving
  givingSchema: z.object({
    amount: z.number().min(1, "Amount must be greater than 0"),
    currency: z.string().default("USD"),
    category: z.string().optional(),
    donor: z
      .object({
        email: z.string().email(),
        firstName: z.string(),
        lastName: z.string(),
      })
      .optional(),
  }),

  // Profile update
  profileUpdateSchema: z.object({
    dateOfBirth: z.string().date().optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
  }),
};

// Export inferred types
export type LoginInput = z.infer<typeof schemas.loginSchema>;
export type RegisterInput = z.infer<typeof schemas.registerSchema>;
export type EventRegistration = z.infer<typeof schemas.eventRegistrationSchema>;
export type Prayer = z.infer<typeof schemas.prayerSchema>;
export type Giving = z.infer<typeof schemas.givingSchema>;
export type ProfileUpdate = z.infer<typeof schemas.profileUpdateSchema>;
