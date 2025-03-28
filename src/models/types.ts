import z from "zod";
import {
  ClickUpTaskSchema,
  ClickUpUserSchema,
  ClickUpCustomFieldSchema,
  ClickUpDocSchema,
  ClickUpDocPageSchema,
} from "./schema";

export type ClickUpUser = z.infer<typeof ClickUpUserSchema>;
export type ClickUpTask = z.infer<typeof ClickUpTaskSchema>;
export type ClickUpCustomField = z.infer<typeof ClickUpCustomFieldSchema>;
export type ClickUpDoc = z.infer<typeof ClickUpDocSchema>;
export type ClickUpDocPage = z.infer<typeof ClickUpDocPageSchema>;

export interface GetListTasksParams {
  archived?: boolean;
  page?: number;
  subtasks?: boolean;
  include_closed?: boolean;
}

export interface CreateTaskParams {
  name: string;
  description?: string;
  markdown_description?: string; // Task description in markdown format
  list_id: string;
  priority?: number; // 1 (Urgent), 2 (High), 3 (Normal), 4 (Low)
  due_date?: number; // Unix timestamp in milliseconds
  tags?: string[]; // Array of tag names
  time_estimate?: number; // Time estimate in milliseconds
  assignees?: number[]; // Array of user IDs to assign to the task
  custom_fields?: Array<{
    id: string;
    value: string | number | boolean | any[] | Record<string, any>;
  }>; // Custom fields to set on task creation
  parent?: string; // Parent task ID to create this task as a subtask
}

export interface UpdateTaskParams {
  name?: string;
  description?: string;
  markdown_description?: string; // Task description in markdown format
  priority?: number; // 1 (Urgent), 2 (High), 3 (Normal), 4 (Low)
  due_date?: number; // Unix timestamp in milliseconds
  tags?: string[]; // Array of tag names
  time_estimate?: number; // Time estimate in milliseconds
  assignees?: {
    add?: number[]; // Array of user IDs to add to the task
    rem?: number[]; // Array of user IDs to remove from the task
  };
  parent?: string; // Parent task ID to move this task as a subtask
}

export interface SearchDocsParams {
  parent_type: string; // Type of parent (e.g., "workspace", "folder", "list")
  parent_id: string; // ID of the parent
}

export interface CreateDocParams {
  title: string;
  parent: {
    id: string;
    type: number; // 4 for Space, 5 for Folder, 6 for List, 7 for Everything, 12 for Workspace
  };
  visibility?: string; // "PRIVATE" by default
  create_page?: boolean; // false by default
}

export interface CreatePageParams {
  title: string;
  parent_id: string;
  content?: string;
}

export interface EditPageParams {
  title?: string;
  content?: string;
}
