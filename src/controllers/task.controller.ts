import dottenv from "dotenv";
import { defineTool } from "../utils/defineTool";
import TaskService from "../services/task.service";
import {
  CreateTaskParams,
  UpdateTaskParams,
  GetListTasksParams,
} from "../models/types";

dottenv.config();
const apiToken = process.env.CLICKUP_API_TOKEN;
const workspaceId = process.env.CLICKUP_WORKSPACE_ID;

if (!apiToken || !workspaceId) {
  console.error(
    "Please set CLICKUP_API_TOKEN and CLICKUP_WORKSPACE_ID environment variables"
  );
  process.exit(1);
}

const taskService = new TaskService(apiToken, workspaceId);

const getTaskTool = defineTool((z) => ({
  name: "clickup_get_task",
  description: "Get a task by its ID",
  inputSchema: {
    task_id: z.string(),
  },
  handler: async (input) => {
    const { task_id } = input;
    const response = await taskService.getTask(task_id);
    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  },
}));

const getTaskByCustomIdTool = defineTool((z) => ({
  name: "clickup_get_task_by_custom_id",
  description: "Get a task by its custom ID",
  inputSchema: {
    custom_id: z.string(),
  },
  handler: async (input) => {
    const { custom_id } = input;
    const response = await taskService.getTaskByCustomId(custom_id);
    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  },
}));

const createTaskTool = defineTool((z) => ({
  name: "clickup_create_task",
  description: "Create a new task in ClickUp",
  inputSchema: {
    name: z.string().describe("Task name"),
    markdown_description: z
      .string()
      .optional()
      .describe("Task description in markdown format"),
    list_id: z.string().describe("ClickUp list ID"),
    priority: z
      .number()
      .optional()
      .describe("Task priority (1-4): 1=Urgent, 2=High, 3=Normal, 4=Low"),
    due_date: z
      .number()
      .optional()
      .describe("Due date as Unix timestamp in milliseconds"),
    tags: z
      .array(z.string())
      .optional()
      .describe("Array of tag names to add to the task"),
    time_estimate: z
      .number()
      .optional()
      .describe("Time estimate in milliseconds"),
    assignees: z
      .array(z.number())
      .optional()
      .describe("Array of user IDs to assign to the task"),
    custom_fields: z
      .array(
        z.object({
          id: z.string().describe("Custom field ID"),
          value: z
            .union([
              z.string(),
              z.number(),
              z.boolean(),
              z.array(z.unknown()),
              z.record(z.unknown()),
            ])
            .describe("Value for the custom field"),
        })
      )
      .optional()
      .describe("Custom fields to set on task creation"),
  },
  handler: async (input): Promise<any> => {
    const taskParams: CreateTaskParams = {
      name: input.name,
      list_id: input.list_id,
      markdown_description: input.markdown_description,
      priority: input.priority,
      due_date: input.due_date,
      tags: input.tags,
      time_estimate: input.time_estimate,
      assignees: input.assignees,
      custom_fields: input.custom_fields,
    };

    const response = await taskService.createTask(taskParams);
    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  },
}));

const updateTaskTool = defineTool((z) => ({
  name: "clickup_update_task",
  description: "Update a task by its ID",
  inputSchema: {
    task_id: z.string().describe("ClickUp task ID"),
    name: z.string().optional().describe("Task name"),
    markdown_description: z
      .string()
      .optional()
      .describe("Task description in markdown format"),
    priority: z
      .number()
      .optional()
      .describe("Task priority (1-4): 1=Urgent, 2=High, 3=Normal, 4=Low"),
    due_date: z
      .number()
      .optional()
      .describe("Due date as Unix timestamp in milliseconds"),
    tags: z
      .array(z.string())
      .optional()
      .describe("Array of tag names to add to the task"),
    time_estimate: z
      .number()
      .optional()
      .describe("Time estimate in milliseconds"),
    assignees_add: z
      .array(z.number())
      .optional()
      .describe("Array of user IDs to add to the task"),
    assignees_rem: z
      .array(z.number())
      .optional()
      .describe("Array of user IDs to remove from the task"),
  },
  handler: async (input): Promise<any> => {
    const { task_id, ...updateData } = input;
    const taskParams: UpdateTaskParams = {
      name: updateData.name,
      markdown_description: updateData.markdown_description,
      priority: updateData.priority,
      due_date: updateData.due_date,
      tags: updateData.tags,
      time_estimate: updateData.time_estimate,
      assignees_add: updateData.assignees_add,
      assignees_rem: updateData.assignees_rem,
    };

    const response = await taskService.updateTask(task_id, taskParams);
    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  },
}));

const updateTaskByCustomIdTool = defineTool((z) => ({
  name: "clickup_update_task_by_custom_id",
  description: "Update a task by its custom ID",
  inputSchema: {
    custom_id: z.string().describe("ClickUp custom task ID"),
    name: z.string().optional().describe("Task name"),
    markdown_description: z
      .string()
      .optional()
      .describe("Task description in markdown format"),
    priority: z
      .number()
      .optional()
      .describe("Task priority (1-4): 1=Urgent, 2=High, 3=Normal, 4=Low"),
    due_date: z
      .number()
      .optional()
      .describe("Due date as Unix timestamp in milliseconds"),
    tags: z
      .array(z.string())
      .optional()
      .describe("Array of tag names to add to the task"),
    time_estimate: z
      .number()
      .optional()
      .describe("Time estimate in milliseconds"),
    assignees_add: z
      .array(z.number())
      .optional()
      .describe("Array of user IDs to add to the task"),
    assignees_rem: z
      .array(z.number())
      .optional()
      .describe("Array of user IDs to remove from the task"),
  },
  handler: async (input): Promise<any> => {
    const { custom_id, ...updateData } = input;
    const taskParams: UpdateTaskParams = {
      name: updateData.name,
      markdown_description: updateData.markdown_description,
      priority: updateData.priority,
      due_date: updateData.due_date,
      tags: updateData.tags,
      time_estimate: updateData.time_estimate,
      assignees_add: updateData.assignees_add,
      assignees_rem: updateData.assignees_rem,
    };

    const response = await taskService.updateTaskByCustomId(
      custom_id,
      taskParams
    );
    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  },
}));

const getListTasksTool = defineTool((z) => ({
  name: "get_list_tasks",
  description: "Get tasks from a ClickUp list with optional filtering",
  inputSchema: {
    list_id: z.string().describe("ClickUp list ID"),
    archived: z.boolean().optional().describe("Include archived tasks"),
    page: z.number().optional().describe("Page number for pagination"),
    subtasks: z.boolean().optional().describe("Include subtasks"),
    include_closed: z.boolean().optional().describe("Include closed tasks"),
  },
  handler: async (input) => {
    const { list_id, ...params } = input;
    const response = await taskService.getListTasks(
      list_id,
      params as GetListTasksParams
    );
    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  },
}));

export {
  getTaskByCustomIdTool,
  getTaskTool,
  createTaskTool,
  updateTaskTool,
  updateTaskByCustomIdTool,
  getListTasksTool,
};
