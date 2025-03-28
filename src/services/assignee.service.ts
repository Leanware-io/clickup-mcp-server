import { ClickUpUser } from "../models/types";

const BASE_URL = "https://api.clickup.com/api/v2";

export class AssigneeService {
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

  async getListMembers(listId: string) {
    // Using the endpoint from https://developer.clickup.com/reference/getlistmembers
    return this.request<{ members: ClickUpUser[] }>(`/list/${listId}/member`);
  }
}

export default AssigneeService;
