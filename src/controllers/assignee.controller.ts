import dottenv from "dotenv";
import { defineTool } from "../utils/defineTool";
import AssigneeService from "../services/assignee.service";

dottenv.config();
const apiToken = process.env.CLICKUP_API_TOKEN;
const workspaceId = process.env.CLICKUP_WORKSPACE_ID;

if (!apiToken || !workspaceId) {
  console.error(
    "Please set CLICKUP_API_TOKEN and CLICKUP_WORKSPACE_ID environment variables"
  );
  process.exit(1);
}

const assigneeService = new AssigneeService(apiToken, workspaceId);

const getListAssigneesTool = defineTool((z) => ({
  name: "get_list_assignees",
  description: "Get all members (potential assignees) of a list",
  inputSchema: {
    list_id: z.string().describe("ClickUp list ID"),
  },
  handler: async (input) => {
    const { list_id } = input;
    const response = await assigneeService.getListMembers(list_id);
    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  },
}));

export { getListAssigneesTool };
