import { z } from "zod";

export const ClickUpCustomFieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  type_config: z.unknown(),
  date_created: z.string(),
  hide_from_guests: z.boolean(),
  required: z.boolean(),
  value: z
    .union([
      z.string(),
      z.number(),
      z.null(),
      z.array(z.unknown()),
      z.record(z.unknown()),
    ])
    .optional(),
});

export const ClickUpUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  color: z.string(),
  profilePicture: z.string().url(),
  initials: z.string(),
  week_start_day: z.number(),
  global_font_support: z.string().nullable(),
  timezone: z.string(),
});

export const ClickUpTaskSchema = z.object({
  id: z.string(),
  custom_id: z.string().nullable(),
  custom_item_id: z.number().nullable(),
  name: z.string(),
  text_content: z.string(),
  description: z.string(),
  status: z.object({
    status: z.string(),
    color: z.string(),
    orderindex: z.number(),
    type: z.string(),
  }),
  orderindex: z.string(),
  date_created: z.string(),
  date_updated: z.string(),
  date_closed: z.string().nullable(),
  markdown_description: z.string().nullable(),
  date_done: z.string().nullable(),
  archived: z.boolean(),
  creator: z.object({
    id: z.number(),
    username: z.string(),
    color: z.string(),
    email: z.string(),
    profilePicture: z.string().nullable(),
  }),
  assignees: z.array(
    z.object({
      id: z.number(),
      username: z.string(),
      color: z.string().nullable(),
      initials: z.string(),
      email: z.string(),
      profilePicture: z.string().nullable(),
    })
  ),
  watchers: z.array(
    z.object({
      id: z.number(),
      username: z.string(),
      color: z.string(),
      initials: z.string(),
      email: z.string(),
      profilePicture: z.string().nullable(),
    })
  ),
  checklists: z.array(z.unknown()),
  tags: z.array(
    z.object({
      name: z.string(),
      tag_fg: z.string(),
      tag_bg: z.string(),
      creator: z.number(),
    })
  ),
  parent: z.string().nullable(),
  top_level_parent: z.string().nullable(),
  priority: z.object({
    color: z.string(),
    id: z.string(),
    orderindex: z.string(),
    priority: z.string(),
  }),
  due_date: z.string().nullable(),
  start_date: z.string().nullable(),
  points: z.number().nullable(),
  time_estimate: z.number().nullable(),
  time_spent: z.number(),
  custom_fields: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.string(),
      type_config: z.unknown(),
      date_created: z.string(),
      hide_from_guests: z.boolean(),
      required: z.boolean(),
      value: z.union([z.string(), z.number(), z.null()]).optional(),
    })
  ),
  dependencies: z.array(z.unknown()),
  linked_tasks: z.array(z.unknown()),
  locations: z.array(z.unknown()),
  team_id: z.string(),
  url: z.string(),
  sharing: z.object({
    public: z.boolean(),
    public_share_expires_on: z.string().nullable(),
    public_fields: z.array(z.string()),
    token: z.string().nullable(),
    seo_optimized: z.boolean(),
  }),
  permission_level: z.string(),
  list: z.object({
    id: z.string(),
    name: z.string(),
    access: z.boolean(),
  }),
  project: z.object({
    id: z.string(),
    name: z.string(),
    hidden: z.boolean(),
    access: z.boolean(),
  }),
  folder: z.object({
    id: z.string(),
    name: z.string(),
    hidden: z.boolean(),
    access: z.boolean(),
  }),
  space: z.object({
    id: z.string(),
  }),
  attachments: z.array(z.unknown()),
});
