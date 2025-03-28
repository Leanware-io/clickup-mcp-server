import { ClickUpUser } from "../models/types";

const BASE_URL = "https://api.clickup.com/api/v2";

export class ListService {
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

  async getLists(folderId: string) {
    return this.request<{ lists: any[] }>(`/folder/${folderId}/list`);
  }

  async createList(
    folderId: string,
    params: {
      name: string;
    }
  ) {
    return this.request(`/folder/${folderId}/list`, {
      method: "POST",
      body: JSON.stringify(params),
    });
  }
}

export default ListService;
