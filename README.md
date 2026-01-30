# fabric-hack41


command to run backend : uv run uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload


MCP : 
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest"
      ]
    }
  },
  "powers": {
    "mcpServers": {
      "power-figma-figma": {
        "url": "https://mcp.figma.com/mcp",
        "disabled": false,
        "disabledTools": []
      }
    }
  }
}
