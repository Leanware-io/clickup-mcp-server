import { ClickUpUser } from "../models/types";

const BASE_URL = "https://api.clickup.com/api/v2";

export class SpaceService {
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

  async authenticate(): Promise<ClickUpUser> {
    return this.request<ClickUpUser>("/user");
  }

  async getSpaces() {
    return this.request<{ spaces: any[] }>(`/team/${this.workspaceId}/space`);
  }
}

export default SpaceService;
