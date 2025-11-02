# Hurl OpenAPI MCP (Model Context Protocol) Server

A powerful Model Context Protocol (MCP) server that provides tools for working with OpenAPI specifications and Hurl documentation. This server enables AI models and tools to interact with OpenAPI schemas and generate Hurl test files based on API specifications.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Available Tools](#available-tools)
- [License](#license)

## Overview

This project is an MCP (Model Context Protocol) server built with Bun that bridges OpenAPI specifications with Hurl (HTTP scripting language), allowing for automated API testing, documentation generation, and schema inspection. It enables AI tools to dynamically load, inspect, and work with OpenAPI schemas to generate appropriate Hurl test scripts.

## Features

- **OpenAPI Specification Management**: Load, store, and retrieve OpenAPI schemas from local files or URLs
- **API Schema Inspection**: List and retrieve detailed information about API schemas, routes, parameters, and security schemes
- **Hurl Documentation Access**: Retrieve Hurl documentation for learning and reference
- **Route Inspection**: List and retrieve detailed information about API endpoints, including request and response schemas
- **Security Scheme Information**: Access security definitions from OpenAPI specs
- **Request/Response Schema Retrieval**: Get specific schema information for API endpoints
- **MCP Compliance**: Full Model Context Protocol implementation for AI integration

## Installation

### Prerequisites
- [Bun](https://bun.sh) v1.3.0 or higher

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd hurl-openapi-mcp
```

2. Install dependencies:
```bash
bun install
```

## Usage

To use directly with bun without compilation.

```json
{
  "mcpServers": {
    "openapi-hurl": {
      "command": "bun",
      "args": [
        "run",
        "/home/oung/Projects/bun/hurl-openapi-mcp/src/index.ts"
      ]
    }
  },
}
```

For better testing experience, you can use [hurl-test-planner](./hurl-test-planner.md) custom agent or you can tweak it on your own.

Or build with `bun run build`, and use the output from `build/index.js`. Default target is `bun`. You can change it to `node` by manually edit the [package.json](./package.json).
The server runs over stdio by default. You can connect it to any MCP-compatible client.

## Available Tools

The server provides the following MCP tools:

### OpenAPI Specification Management
- `openapi_hurl:specifications:add` - Load OpenAPI specifications from JSON or YAML files (local or remote)
- `openapi_hurl:specifications:list` - List all loaded OpenAPI specifications

### Schema Operations
- `openapi_hurl:schemas:list` - Get all schema names from a specified OpenAPI spec
- `openapi_hurl:schemas:retrieve` - Retrieve details of a specific schema from an OpenAPI spec

### Security Operations
- `openapi_hurl:security:list` - Get all security schemes from a specified OpenAPI spec
- `openapi_hurl:security:retrieve` - Retrieve details of a specific security scheme

### Route Operations
- `openapi_hurl:routes:list` - List all available routes with their HTTP methods from a specified OpenAPI spec
- `openapi_hurl:routes:retrieve` - Retrieve detailed information about a specific route/endpoint

### Request/Response Schema Operations
- `openapi_hurl:requests:retrieve` - Retrieve the request schema for a specific endpoint from an OpenAPI 3.x specification
- `openapi_hurl:responses:retrieve` - Retrieve the response schema for a specific endpoint from an OpenAPI 3.x specification

### Hurl Documentation
- `openapi_hurl:hurl_document:retrieve` - Retrieve Hurl documentation sections including:
  - `hurl_file`: Hurl file structure and syntax
  - `entry`: Entry definitions
  - `request`: Request structure
  - `response`: Response structure
  - `capturing_response`: Response capturing techniques
  - `asserting_response`: Response assertions
  - `filters`: Available filters
  - `grammar`: Grammar reference


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -am 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For support, please open an issue in the repository.
