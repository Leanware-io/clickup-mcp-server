import dottenv from "dotenv";
import { defineTool } from "../utils/defineTool";
import ClickUpService from "../services/clickup-service";
import { CreateTaskParams } from "../models/types";

dottenv.config();
const apiToken = process.env.CLICKUP_API_TOKEN;
const workspaceId = process.env.CLICKUP_WORKSPACE_ID;

if (!apiToken || !workspaceId) {
  console.error(
    "Please set CLICKUP_API_TOKEN and CLICKUP_WORKSPACE_ID environment variables"
  );
  process.exit(1);
}

const clickUpService = new ClickUpService(apiToken, workspaceId);

const authenticateTool = defineTool((z) => ({
  name: "clickup_authenticate",
  description: "Authenticate with ClickUp API using an API token",
  inputSchema: {},
  handler: async (input) => {
    const response = await clickUpService.authenticate();
    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  },
}));

const getTaskTool = defineTool((z) => ({
  name: "clickup_get_task",
  description: "Get a task by its ID",
  inputSchema: {
    task_id: z.string(),
  },
  handler: async (input) => {
    const { task_id } = input;
    const response = await clickUpService.getTask(task_id);
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
    const response = await clickUpService.getTaskByCustomId(custom_id);
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
    };

    const response = await clickUpService.createTask(taskParams);
    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  },
}));

export { authenticateTool, getTaskByCustomIdTool, getTaskTool, createTaskTool };
