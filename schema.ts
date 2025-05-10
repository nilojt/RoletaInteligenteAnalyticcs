import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("isAdmin").notNull().default(false),
});

export const rounds = pgTable("rounds", {
  id: serial("id").primaryKey(),
  numbers: integer("numbers").array().notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertRoundSchema = createInsertSchema(rounds).pick({
  numbers: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertRound = z.infer<typeof insertRoundSchema>;
export type Round = typeof rounds.$inferSelect;

// Define a roulette number type with properties for display
export interface RouletteNumber {
  number: number;
  color: 'red' | 'black' | 'green';
}

// Prediction result
export interface Prediction {
  numbers: number[];
  timestamp: Date;
}

// Statistics 
export interface RoundStatistics {
  evens: number;
  reds: number;
  maxSequence: number;
}
