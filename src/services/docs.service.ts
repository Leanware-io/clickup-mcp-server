import {
  ClickUpDoc,
  ClickUpDocPage,
  CreateDocParams,
  CreatePageParams,
  EditPageParams,
  SearchDocsParams,
} from "../models/types";

const BASE_URL = "https://api.clickup.com/api/v3/workspaces";

export class DocsService {
  private readonly headers: { Authorization: string; "Content-Type": string };
  private readonly workspaceId: string;

  constructor(apiToken: string, workspaceId: string) {
    this.workspaceId = workspaceId;
    this.headers = {
      Authorization: apiToken,
      "Content-Type": "application/json",
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: this.headers,
    });
    return response.json();
  }

  async searchDocs(params: SearchDocsParams): Promise<{ docs: ClickUpDoc[] }> {
    const { parent_type, parent_id } = params;
    return this.request<{ docs: ClickUpDoc[] }>(
      `/${this.workspaceId}/docs?parent_type=${parent_type}&parent_id=${parent_id}`
    );
  }

  async createDoc(params: CreateDocParams): Promise<ClickUpDoc> {
    const docData = {
      name: params.name,
      parent: params.parent,
      visibility: params.visibility || "PRIVATE",
      create_page:
        params.create_page !== undefined ? params.create_page : false,
    };

    return this.request<ClickUpDoc>(`/${this.workspaceId}/docs`, {
      method: "POST",
      body: JSON.stringify(docData),
    });
  }

  async getDocPages(docId: string): Promise<{ pages: ClickUpDocPage[] }> {
    return this.request<{ pages: ClickUpDocPage[] }>(
      `/${this.workspaceId}/docs/${docId}/pageListing`
    );
  }

  async getPage(docId: string, pageId: string): Promise<ClickUpDocPage> {
    return this.request<ClickUpDocPage>(
      `/${this.workspaceId}/docs/${docId}/pages/${pageId}`
    );
  }

  async createPage(params: CreatePageParams): Promise<ClickUpDocPage> {
    const { docId, name, parent_page_id, sub_title, content } = params;
    const pageData = {
      name,
      parent_page_id: parent_page_id || null,
      sub_title: sub_title || null,
      content,
      content_format: "text/md",
    };

    return this.request<ClickUpDocPage>(
      `/${this.workspaceId}/docs/${docId}/pages`,
      {
        method: "POST",
        body: JSON.stringify(pageData),
      }
    );
  }

  async editPage(params: EditPageParams): Promise<ClickUpDocPage> {
    const { docId, pageId, name, sub_title, content, content_edit_mode } =
      params;
    const pageData = {
      name,
      sub_title,
      content,
      content_edit_mode: content_edit_mode || "replace",
      content_format: "text/md",
    };

    return this.request<ClickUpDocPage>(
      `/${this.workspaceId}/docs/${docId}/pages/${pageId}`,
      {
        method: "PUT",
        body: JSON.stringify(pageData),
      }
    );
  }
}

export default DocsService;
