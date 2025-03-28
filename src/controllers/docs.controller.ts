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
      .describe("Type of parent (SPACE, FOLDER, LIST, EVERYTHING, WORKSPACE)"),
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
    name: z.string().describe("The name of the new Doc"),
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
      .describe("Doc visibility (PUBLIC or PRIVATE), PRIVATE by default"),
    create_page: z
      .boolean()
      .optional()
      .describe("Whether to create a initial page (false by default)"),
  },
  handler: async (input) => {
    const docParams: CreateDocParams = {
      name: input.name,
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
    doc_id: z.string().describe("ClickUp doc ID"),
    page_id: z.string().describe("ClickUp page ID"),
  },
  handler: async (input) => {
    const response = await docsService.getPage(input.doc_id, input.page_id);
    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  },
}));

const createPageTool = defineTool((z) => ({
  name: "clickup_create_page",
  description: "Create a new page in a ClickUp doc",
  inputSchema: {
    doc_id: z.string().describe("ClickUp doc ID"),
    name: z.string().describe("Page name"),
    parent_page_id: z
      .string()
      .optional()
      .describe("Parent page ID (null for root page)"),
    sub_title: z.string().optional().describe("Page subtitle"),
    content: z.string().describe("Page content in markdown format"),
  },
  handler: async (input) => {
    const pageParams: CreatePageParams = {
      docId: input.doc_id,
      name: input.name,
      parent_page_id: input.parent_page_id,
      sub_title: input.sub_title,
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
    doc_id: z.string().describe("ClickUp doc ID"),
    page_id: z.string().describe("ClickUp page ID"),
    name: z.string().optional().describe("Page name"),
    sub_title: z.string().optional().describe("Page subtitle"),
    content: z.string().optional().describe("Page content in markdown format"),
    content_edit_mode: z
      .string()
      .optional()
      .describe(
        "Content edit mode (replace, append, prepend), default is replace"
      ),
  },
  handler: async (input) => {
    const pageParams: EditPageParams = {
      docId: input.doc_id,
      pageId: input.page_id,
      name: input.name,
      sub_title: input.sub_title,
      content: input.content,
      content_edit_mode: input.content_edit_mode,
    };
    const response = await docsService.editPage(pageParams);
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
