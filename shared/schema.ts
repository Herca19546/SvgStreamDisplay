import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// SVG data schema
export const svgs = pgTable("svgs", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  width: integer("width"),
  height: integer("height"),
  elementCount: integer("element_count"),
  size: integer("size"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSvgSchema = createInsertSchema(svgs).pick({
  content: true,
  width: true,
  height: true,
  elementCount: true,
  size: true,
});

export const svgContentSchema = z.object({
  content: z.string().min(1).refine(
    (val) => val.trim().startsWith('<svg') && val.trim().endsWith('</svg>'),
    {
      message: 'Content must be a valid SVG (should start with <svg and end with </svg>)'
    }
  )
});

export type InsertSvg = z.infer<typeof insertSvgSchema>;
export type Svg = typeof svgs.$inferSelect;
export type SvgContent = z.infer<typeof svgContentSchema>;
