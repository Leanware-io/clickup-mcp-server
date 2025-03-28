import dottenv from "dotenv";
import { defineTool } from "../utils/defineTool";
import DocsService from "../services/docs.service";
import {
  SearchDocsParams,
  CreateDocParams,
  CreatePageParams,
  EditPageParams,
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

const docsService = new DocsService(apiToken, workspaceId);

const searchDocsTool = defineTool((z) => ({
  name: "clickup_search_docs",
  description: "Search for docs in a specific parent",
  inputSchema: {
    parent_type: z
      .string()
      .describe("Type of parent (workspace, folder, list)"),
    parent_id: z.string().describe("ID of the parent"),
  },
  handler: async (input) => {
    const params: SearchDocsParams = {
      parent_type: input.parent_type,
      parent_id: input.parent_id,
    };
    const response = await docsService.searchDocs(params);
    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  },
}));

const createDocTool = defineTool((z) => ({
  name: "clickup_create_doc",
  description: "Create a new doc in ClickUp",
  inputSchema: {
    title: z.string().describe("Doc title"),
    parent: z
      .object({
        id: z.string().describe("Parent ID"),
        type: z
          .number()
          .describe(
            "Parent type: 4 for Space, 5 for Folder, 6 for List, 7 for Everything, 12 for Workspace"
          ),
      })
      .describe("Parent object"),
    visibility: z
      .string()
      .optional()
      .describe("Doc visibility (PRIVATE by default)"),
    create_page: z
      .boolean()
      .optional()
      .describe("Whether to create a page (false by default)"),
  },
  handler: async (input) => {
    const docParams: CreateDocParams = {
      title: input.title,
      parent: input.parent,
      visibility: input.visibility,
      create_page: input.create_page,
    };
    const response = await docsService.createDoc(docParams);
    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  },
}));

const getDocPagesTool = defineTool((z) => ({
  name: "clickup_get_doc_pages",
  description: "Get pages from a ClickUp doc",
  inputSchema: {
    doc_id: z.string().describe("ClickUp doc ID"),
  },
  handler: async (input) => {
    const response = await docsService.getDocPages(input.doc_id);
    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  },
}));

const getPageTool = defineTool((z) => ({
  name: "clickup_get_page",
  description: "Get a page from a ClickUp doc",
  inputSchema: {
    page_id: z.string().describe("ClickUp page ID"),
  },
  handler: async (input) => {
    const response = await docsService.getPage(input.page_id);
    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  },
}));

const createPageTool = defineTool((z) => ({
  name: "clickup_create_page",
  description: "Create a new page in a ClickUp doc",
  inputSchema: {
    parent_id: z.string().describe("Parent doc ID"),
    title: z.string().describe("Page title"),
    content: z.string().optional().describe("Page content"),
  },
  handler: async (input) => {
    const pageParams: CreatePageParams = {
      parent_id: input.parent_id,
      title: input.title,
      content: input.content,
    };
    const response = await docsService.createPage(pageParams);
    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  },
}));

const editPageTool = defineTool((z) => ({
  name: "clickup_edit_page",
  description: "Edit a page in a ClickUp doc",
  inputSchema: {
    page_id: z.string().describe("ClickUp page ID"),
    title: z.string().optional().describe("Page title"),
    content: z.string().optional().describe("Page content"),
  },
  handler: async (input) => {
    const { page_id, ...updateData } = input;
    const pageParams: EditPageParams = {
      title: updateData.title,
      content: updateData.content,
    };
    const response = await docsService.editPage(page_id, pageParams);
    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  },
}));

export {
  searchDocsTool,
  createDocTool,
  getDocPagesTool,
  getPageTool,
  createPageTool,
  editPageTool,
};
