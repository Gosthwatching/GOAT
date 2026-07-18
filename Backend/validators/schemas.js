import { z } from "zod";

export const registerSchema = z.object({
  nom: z.string().trim().min(1),
  prenom: z.string().trim().min(1),
  password: z.string().min(8),
  photoProfil: z.string().trim().max(2048).optional().nullable(),
});

export const loginSchema = z.object({
  nom: z.string().trim().min(1),
  prenom: z.string().trim().min(1),
  password: z.string().min(1),
});

export const createEventSchema = z.object({
  nom: z.string().trim().min(1),
  lieu: z.string().trim().min(1),
  date: z.string().datetime(),
  expiration: z.string().datetime().optional().nullable(),
});

export const sendMessageSchema = z.object({
  text: z.string().trim().min(1).max(2000),
});