# ClickUp MCP Integration

A Model Context Protocol server that provides seamless integration with ClickUp, allowing Large Language Models to interact with your ClickUp workspace tasks and data.

## Available Tools

This MCP server provides the following tools for interacting with ClickUp:

### Task Management

- **`clickup_create_task`**: Creates a new task in your ClickUp workspace
- **`clickup_get_task`**: Retrieves detailed information about a specific task using its ID
- **`clickup_get_task_by_custom_id`**: Retrieves task information using a custom ID
- **`clickup_update_task`**: Updates an existing task by its ID
- **`clickup_update_task_by_custom_id`**: Updates an existing task by its custom ID
- **`get_list_tasks`**: Gets all tasks from a list with optional filtering

### Document Management

- **`clickup_search_docs`**: Searches for docs in a specific parent
- **`clickup_create_doc`**: Creates a new doc in ClickUp
- **`clickup_get_doc_pages`**: Gets all pages from a ClickUp doc
- **`clickup_get_page`**: Gets a specific page from a ClickUp doc
- **`clickup_create_page`**: Creates a new page in a ClickUp doc
- **`clickup_edit_page`**: Edits an existing page in a ClickUp doc

### Custom Fields

- **`clickup_get_list_custom_fields`**: Gets all accessible custom fields for a list
- **`clickup_set_custom_field_value`**: Sets a value for a custom field on a task
- **`clickup_set_custom_field_value_by_custom_id`**: Sets a custom field value using the task's custom ID

### Assignees

- **`get_list_assignees`**: Gets all members (potential assignees) of a list

### Workspace Structure

- **`get_spaces`**: Gets all spaces in the workspace
- **`get_folders`**: Gets all folders in a space
- **`get_lists`**: Gets all lists in a folder
- **`create_list`**: Creates a new list in a folder

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
