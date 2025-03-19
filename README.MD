# ClickUp MCP Integration

A Model Context Protocol server that provides seamless integration with ClickUp, allowing Large Language Models to interact with your ClickUp workspace tasks and data.

## Available Tools

This MCP server provides the following tools for interacting with ClickUp:

### `clickup_create_task`

Creates a new task in your ClickUp workspace.

- **Required inputs**:
  - `name` (string): Task name
  - `list_id` (string): ClickUp list ID where the task will be created
- **Optional inputs**:
  - `markdown_description` (string): Task description in markdown format
  - `priority` (number): Task priority (1=Urgent, 2=High, 3=Normal, 4=Low)
  - `due_date` (number): Due date as Unix timestamp in milliseconds
  - `tags` (array of strings): Tag names to add to the task
  - `time_estimate` (number): Time estimate in milliseconds
- **Returns**: Details of the newly created task

### `clickup_get_task`

Retrieves detailed information about a specific task using its ID.

- **Required inputs**:
  - `task_id` (string): The ClickUp task ID
- **Returns**: Complete task details including description, status, assignees, and metadata

### `clickup_get_task_by_custom_id`

Retrieves task information using a custom ID.

- **Required inputs**:
  - `custom_id` (string): The custom ID of the task
- **Returns**: Complete task details including description, status, assignees, and metadata

## Build

Run:

```bash
npm i
npm run build
npm run inspector
```

Docker build:

```bash
docker buildx build -t {your-docker-repository} --platform linux/amd64,linux/arm64 .
docker push {your-docker-repository}
```

## Setup

**1. Obtaining your ClickUp API Token:**

1. Log in to your ClickUp account at [app.clickup.com](https://app.clickup.com)
2. Navigate to your user settings by clicking your profile picture in the bottom-left corner
3. Select "Settings"
4. Click on "Apps" in the left sidebar
5. Under "API Token", click "Generate" if you don't already have a token
6. Copy the generated API token for use in the MCP server configuration

**2. Finding your Workspace ID:**

1. Open ClickUp in your web browser
2. Look at the URL when you're in your workspace
3. The Workspace ID is the numeric value in the URL: `https://app.clickup.com/{workspace_id}/home`
4. Copy this number for use in the MCP server configuration

**3. Install Docker:** https://docs.docker.com/engine/install/

**4a. Setup Cline MCP Server:**

- Open VSCode or Jetbrains IDEs and go to Cline.
- Go to MCP Servers → Installed → Configure MCP Servers.
- Add the following to your `cline_mcp_settings.json` inside the `mcpServers` key:

```json
"clickup": {
  "command": "docker",
  "args": [
    "run",
    "-i",
    "--rm",
    "-e",
    "CLICKUP_API_TOKEN",
    "-e",
    "CLICKUP_WORKSPACE_ID",
    "your-docker-repository"
  ],
  "env": {
    "CLICKUP_API_TOKEN": "your-api-token",
    "CLICKUP_WORKSPACE_ID": "your-workspace-id"
  }
}
```

**4b. Setup Claude Desktop MCP Server:**

- Use any editor to open the configuration file of Claude Desktop.
  - Windows: `C:\Users\YourUsername\AppData\Roaming\Claude\claude_desktop_config.json`
  - Mac: `~/Library/Application\ Support/Claude/claude_desktop_config.json`
- Add the following to your `claude_desktop_config.json` inside the `mcpServers` key:

```json
"clickup": {
  "command": "docker",
  "args": [
    "run",
    "-i",
    "--rm",
    "-e",
    "CLICKUP_API_TOKEN",
    "-e",
    "CLICKUP_WORKSPACE_ID",
    "your-docker-repository"
  ],
  "env": {
    "CLICKUP_API_TOKEN": "your-api-token",
    "CLICKUP_WORKSPACE_ID": "your-workspace-id"
  }
}
```

- Save the configuration file
- Restart Claude Desktop to apply the changes

### Troubleshooting

If you encounter issues with the MCP server:

1. **Authentication Errors**:

   - Verify your API token is correct
   - Ensure the API token has the necessary permissions for the operations you're attempting
   - Check that your workspace ID is correct

2. **Task Access Issues**:

   - Confirm you have access to the tasks you're trying to retrieve
   - Verify the task IDs are correct and exist in your workspace
   - Check if the tasks might be in an archived state

3. **Connection Problems**:

   - Ensure your Docker service is running properly
   - Check your network connection
   - Verify the environment variables are correctly set in your MCP configuration

## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License.
