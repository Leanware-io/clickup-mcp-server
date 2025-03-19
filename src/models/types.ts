import z from "zod";
import { ClickUpTaskSchema, ClickUpUserSchema } from "./schema";

export type ClickUpUser = z.infer<typeof ClickUpUserSchema>;
export type ClickUpTask = z.infer<typeof ClickUpTaskSchema>;

export interface CreateTaskParams {
  name: string;
  description?: string;
  markdown_description?: string; // Task description in markdown format
  list_id: string;
  priority?: number; // 1 (Urgent), 2 (High), 3 (Normal), 4 (Low)
  due_date?: number; // Unix timestamp in milliseconds
  tags?: string[]; // Array of tag names
  time_estimate?: number; // Time estimate in milliseconds
}
