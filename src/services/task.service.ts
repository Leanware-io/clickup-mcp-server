import {
  ClickUpTask,
  ClickUpUser,
  CreateTaskParams,
  UpdateTaskParams,
  GetListTasksParams,
} from "../models/types";

const BASE_URL = "https://api.clickup.com/api/v2";

export class TaskService {
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

  async updateTask(
    taskId: string,
    params: UpdateTaskParams
  ): Promise<ClickUpTask> {
    return this.request<ClickUpTask>(`/task/${taskId}`, {
      method: "PUT",
      body: JSON.stringify(params),
    });
  }

  async updateTaskByCustomId(
    customId: string,
    params: UpdateTaskParams
  ): Promise<ClickUpTask> {
    return this.request<ClickUpTask>(
      `/task/${customId}?custom_task_ids=true&team_id=${this.workspaceId}`,
      {
        method: "PUT",
        body: JSON.stringify(params),
      }
    );
  }

  async getListTasks(listId: string, params: GetListTasksParams = {}) {
    const queryParams = new URLSearchParams();

    // Add optional query parameters if they exist
    if (params.archived !== undefined)
      queryParams.append("archived", params.archived.toString());
    if (params.page !== undefined)
      queryParams.append("page", params.page.toString());
    if (params.subtasks !== undefined)
      queryParams.append("subtasks", params.subtasks.toString());
    if (params.include_closed !== undefined)
      queryParams.append("include_closed", params.include_closed.toString());

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";

    return this.request<{ tasks: ClickUpTask[] }>(
      `/list/${listId}/task${queryString}`
    );
  }
}

export default TaskService;
