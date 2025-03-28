import { ClickUpUser } from "../models/types";

const BASE_URL = "https://api.clickup.com/api/v2";

export class FolderService {
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

  async getFolders(spaceId: string) {
    const response = await this.request<{ folders: any[] }>(
      `/space/${spaceId}/folder`
    );

    // Remove the "lists" attribute from each folder to reduce payload size
    if (response.folders && Array.isArray(response.folders)) {
      response.folders = response.folders.map((folder) => {
        const { lists, ...folderWithoutLists } = folder;
        return folderWithoutLists;
      });
    }

    return response;
  }
}

export default FolderService;
