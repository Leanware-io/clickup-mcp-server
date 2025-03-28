import dottenv from "dotenv";
import { defineTool } from "../utils/defineTool";
import CustomFieldService from "../services/custom-field.service";

dottenv.config();
const apiToken = process.env.CLICKUP_API_TOKEN;
const workspaceId = process.env.CLICKUP_WORKSPACE_ID;

if (!apiToken || !workspaceId) {
  console.error(
    "Please set CLICKUP_API_TOKEN and CLICKUP_WORKSPACE_ID environment variables"
  );
  process.exit(1);
}

const customFieldService = new CustomFieldService(apiToken, workspaceId);

const getListCustomFieldsTool = defineTool((z) => ({
  name: "clickup_get_list_custom_fields",
  description: "Get all accessible custom fields for a list",
  inputSchema: {
    list_id: z.string().describe("ClickUp list ID"),
  },
  handler: async (input) => {
    const { list_id } = input;
    const response = await customFieldService.getListCustomFields(list_id);
    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  },
}));

const setCustomFieldValueTool = defineTool((z) => ({
  name: "clickup_set_custom_field_value",
  description: "Set a value for a custom field on a task",
  inputSchema: {
    task_id: z.string().describe("ClickUp task ID"),
    custom_field_id: z.string().describe("Custom field ID"),
    value: z
      .union([
        z.string(),
        z.number(),
        z.boolean(),
        z.array(z.unknown()),
        z.record(z.unknown()),
      ])
      .describe(
        "Value to set for the custom field. Type depends on the custom field type."
      ),
  },
  handler: async (input) => {
    const { task_id, custom_field_id, value } = input;
    const response = await customFieldService.setCustomFieldValue(
      task_id,
      custom_field_id,
      value
    );
    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  },
}));

export { getListCustomFieldsTool, setCustomFieldValueTool };
