import {
  ClickUpDoc,
  ClickUpDocPage,
  CreateDocParams,
  CreatePageParams,
  EditPageParams,
  SearchDocsParams,
} from "../models/types";

const BASE_URL = "https://api.clickup.com/api/v2";

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
      `/team/${this.workspaceId}/doc?parent_type=${parent_type}&parent_id=${parent_id}`
    );
  }

  async createDoc(params: CreateDocParams): Promise<ClickUpDoc> {
    const docData = {
      title: params.title,
      parent: params.parent,
      visibility: params.visibility || "PRIVATE",
      create_page:
        params.create_page !== undefined ? params.create_page : false,
    };

    return this.request<ClickUpDoc>(`/team/${this.workspaceId}/doc`, {
      method: "POST",
      body: JSON.stringify(docData),
    });
  }

  async getDocPages(docId: string): Promise<{ pages: ClickUpDocPage[] }> {
    return this.request<{ pages: ClickUpDocPage[] }>(`/doc/${docId}/page`);
  }

  async getPage(pageId: string): Promise<ClickUpDocPage> {
    return this.request<ClickUpDocPage>(`/page/${pageId}`);
  }

  async createPage(params: CreatePageParams): Promise<ClickUpDocPage> {
    const { parent_id, title, content } = params;
    const pageData = {
      title,
      content,
    };

    return this.request<ClickUpDocPage>(`/doc/${parent_id}/page`, {
      method: "POST",
      body: JSON.stringify(pageData),
    });
  }

  async editPage(
    pageId: string,
    params: EditPageParams
  ): Promise<ClickUpDocPage> {
    return this.request<ClickUpDocPage>(`/page/${pageId}`, {
      method: "PUT",
      body: JSON.stringify(params),
    });
  }
}

export default DocsService;
