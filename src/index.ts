#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  getTaskByCustomIdTool,
  getTaskTool,
  createTaskTool,
  updateTaskTool,
  updateTaskByCustomIdTool,
} from "./controllers/task.controller";
import {
  searchDocsTool,
  createDocTool,
  getDocPagesTool,
  getPageTool,
  createPageTool,
  editPageTool,
} from "./controllers/docs.controller";
import { getSpacesTool } from "./controllers/space.controller";
import { getFoldersTool } from "./controllers/folder.controller";
import { getListsTool, createListTool } from "./controllers/list.controller";
import {
  getListCustomFieldsTool,
  setCustomFieldValueTool,
  setCustomFieldValueByCustomIdTool,
} from "./controllers/custom-field.controller";
import { getListAssigneesTool } from "./controllers/assignee.controller";

const tools = [
  // Task tools
  getTaskByCustomIdTool,
  getTaskTool,
  createTaskTool,
  updateTaskTool,
  updateTaskByCustomIdTool,

  // Space tools
  getSpacesTool,

  // Folder tools
  getFoldersTool,

  // List tools
  getListsTool,
  createListTool,

  // Custom Field tools
  getListCustomFieldsTool,
  setCustomFieldValueTool,
  setCustomFieldValueByCustomIdTool,

  // Assignee tools
  getListAssigneesTool,

  // Docs tools
  searchDocsTool,
  createDocTool,
  getDocPagesTool,
  getPageTool,
  createPageTool,
  editPageTool,
];

async function main() {
  console.error("Starting ClickUp MCP Server...");

  const apiToken = process.env.CLICKUP_API_TOKEN;
  const workspaceId = process.env.CLICKUP_WORKSPACE_ID;

  if (!apiToken || !workspaceId) {
    console.error(
      "Please set CLICKUP_API_TOKEN and CLICKUP_WORKSPACE_ID environment variables"
    );
    process.exit(1);
  }

  const server = new McpServer(
    {
      name: "ClickUp MCP Server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  tools.forEach((tool) => {
    server.tool(tool.name, tool.description, tool.inputSchema, tool.handler);
  });

  const transport = new StdioServerTransport();
  console.error("Connecting server to transport...");
  await server.connect(transport);

  console.error("ClickUp MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
