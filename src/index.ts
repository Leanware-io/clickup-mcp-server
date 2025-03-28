#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  authenticateTool,
  getTaskByCustomIdTool,
  getTaskTool,
  createTaskTool,
  updateTaskTool,
  updateTaskByCustomIdTool,
} from "./controllers/clickup-controller";

const tools = [
  authenticateTool,
  getTaskByCustomIdTool,
  getTaskTool,
  createTaskTool,
  updateTaskTool,
  updateTaskByCustomIdTool,
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
