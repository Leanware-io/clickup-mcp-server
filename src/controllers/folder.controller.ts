import dottenv from "dotenv";
import { defineTool } from "../utils/defineTool";
import FolderService from "../services/folder.service";

dottenv.config();
const apiToken = process.env.CLICKUP_API_TOKEN;
const workspaceId = process.env.CLICKUP_WORKSPACE_ID;

if (!apiToken || !workspaceId) {
  console.error(
    "Please set CLICKUP_API_TOKEN and CLICKUP_WORKSPACE_ID environment variables"
  );
  process.exit(1);
}

const folderService = new FolderService(apiToken, workspaceId);

const getFoldersTool = defineTool((z) => ({
  name: "get_folders",
  description: "Get all folders in a space",
  inputSchema: {
    space_id: z.string().describe("ClickUp space ID"),
  },
  handler: async (input) => {
    const { space_id } = input;
    const response = await folderService.getFolders(space_id);
    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  },
}));

export { getFoldersTool };
