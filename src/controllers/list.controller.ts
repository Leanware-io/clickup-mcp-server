import dottenv from "dotenv";
import { defineTool } from "../utils/defineTool";
import ListService from "../services/list.service";

dottenv.config();
const apiToken = process.env.CLICKUP_API_TOKEN;
const workspaceId = process.env.CLICKUP_WORKSPACE_ID;

if (!apiToken || !workspaceId) {
  console.error(
    "Please set CLICKUP_API_TOKEN and CLICKUP_WORKSPACE_ID environment variables"
  );
  process.exit(1);
}

const listService = new ListService(apiToken, workspaceId);

const getListsTool = defineTool((z) => ({
  name: "get_lists",
  description: "Get all lists in a folder",
  inputSchema: {
    folder_id: z.string().describe("ClickUp folder ID"),
  },
  handler: async (input) => {
    const { folder_id } = input;
    const response = await listService.getLists(folder_id);
    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  },
}));

const createListTool = defineTool((z) => ({
  name: "create_list",
  description: "Create a new list in a folder",
  inputSchema: {
    folder_id: z.string().describe("ClickUp folder ID"),
    name: z.string().describe("List name"),
  },
  handler: async (input) => {
    const { folder_id, name } = input;
    const response = await listService.createList(folder_id, {
      name,
    });
    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  },
}));

export { getListsTool, createListTool };
