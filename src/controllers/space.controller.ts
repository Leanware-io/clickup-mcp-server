import dottenv from "dotenv";
import { defineTool } from "../utils/defineTool";
import SpaceService from "../services/space.service";

dottenv.config();
const apiToken = process.env.CLICKUP_API_TOKEN;
const workspaceId = process.env.CLICKUP_WORKSPACE_ID;

if (!apiToken || !workspaceId) {
  console.error(
    "Please set CLICKUP_API_TOKEN and CLICKUP_WORKSPACE_ID environment variables"
  );
  process.exit(1);
}

const spaceService = new SpaceService(apiToken, workspaceId);

const getSpacesTool = defineTool((z) => ({
  name: "get_spaces",
  description: "Get all spaces in the workspace",
  inputSchema: {},
  handler: async (input) => {
    const response = await spaceService.getSpaces();
    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  },
}));

export { getSpacesTool };
