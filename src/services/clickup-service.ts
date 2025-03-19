import { ClickUpTask, ClickUpUser, CreateTaskParams } from "../models/types";

const BASE_URL = "https://api.clickup.com/api/v2";

export class ClickUpService {
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

  async getTask(taskId: string): Promise<ClickUpTask> {
    return this.request<ClickUpTask>(
      `/task/${taskId}?custom_task_ids=false&team_id=${this.workspaceId}&include_subtasks=true&include_markdown_description=true`
    );
  }

  async getTaskByCustomId(customId: string): Promise<ClickUpTask> {
    return this.request<ClickUpTask>(
      `/task/${customId}?custom_task_ids=true&team_id=${this.workspaceId}&include_subtasks=true&include_markdown_description=true`
    );
  }

  async createTask(params: CreateTaskParams): Promise<ClickUpTask> {
    const { list_id, ...taskData } = params;

    return this.request<ClickUpTask>(`/list/${list_id}/task`, {
      method: "POST",
      body: JSON.stringify(taskData),
    });
  }
}

export default ClickUpService;
