import { ClickUpCustomField } from "../models/types";

const BASE_URL = "https://api.clickup.com/api/v2";

export class CustomFieldService {
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

  async getListCustomFields(
    listId: string
  ): Promise<{ fields: ClickUpCustomField[] }> {
    return this.request<{ fields: ClickUpCustomField[] }>(
      `/list/${listId}/field`
    );
  }

  async setCustomFieldValue(
    taskId: string,
    customFieldId: string,
    value: any
  ): Promise<{ field: ClickUpCustomField }> {
    return this.request<{ field: ClickUpCustomField }>(
      `/task/${taskId}/field/${customFieldId}`,
      {
        method: "POST",
        body: JSON.stringify({ value }),
      }
    );
  }
}

export default CustomFieldService;
