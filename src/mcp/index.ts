import { FastMCP } from "fastmcp";
import z from "zod";
import { addSpecsHandler } from "./handlers/add_specs";
import { listSchemasHandler } from "./handlers/list_all_schemas";
import { listRoutesHandler } from "./handlers/list_routes";
import { listSecuritySchemasHandler } from "./handlers/list_security_schemas";
import { listSpecs } from "./handlers/list_specs";
import { retrieveRequestSchemaHandler } from "./handlers/retrieve_request_schema";
import { retrieveResponseSchemaHandler } from "./handlers/retrieve_response_schema";
import { retrieveRouteHandler } from "./handlers/retrieve_route";
import { retrieveSchemaHandler } from "./handlers/retrieve_schema";
import { retrieveSecuritySchema } from "./handlers/retrieve_security_schema";

export const server = new FastMCP({
	name: "My Server",
	version: "1.0.0",
});

server.addTool({
	name: "openapi_hurl:specifications:add",
	description: "Load OpenAPI specifications from JSON or YAML.",
	parameters: z.object({
		source: z.string().describe("Path or URL of the file"),
		name: z
			.string()
			.describe("Unique name of the api schema to store in the API hash map"),
	}),
	execute: addSpecsHandler,
});

server.addTool({
	name: "openapi_hurl:specifications:list",
	description:
		"List the specifications loaded in the store and ready to inspect",
	execute: listSpecs,
});

server.addTool({
	name: "openapi_hurl:schemas:list",
	description: "Get all schemas names from the specified OpenAPI spec",
	parameters: z.object({
		specs_name: z.string().describe("Name of the API spec to get schemas from"),
	}),
	execute: listSchemasHandler,
});

server.addTool({
	name: "openapi_hurl:schemas:retrieve",
	description:
		"Retrieve the details of a specific schema from the specified OpenAPI spec",
	parameters: z.object({
		specs_name: z.string().describe("Name of the API spec to get schema from"),
		schema_name: z.string().describe("Name of the schema to retrieve"),
	}),
	execute: retrieveSchemaHandler,
});

server.addTool({
	name: "openapi_hurl:security:list",
	description:
		"Get all security schemes and definitions from the specified OpenAPI spec",
	parameters: z.object({
		specs_name: z
			.string()
			.describe("Name of the API spec to get security information from"),
	}),
	execute: listSecuritySchemasHandler,
});

server.addTool({
	name: "openapi_hurl:security:retrieve",
	description:
		"Retrieve the details of a specific security scheme from the specified OpenAPI spec",
	parameters: z.object({
		specs_name: z
			.string()
			.describe("Name of the API spec to retrieve security scheme from"),
		security_name: z
			.string()
			.describe("Name of the security scheme to retrieve"),
	}),
	execute: retrieveSecuritySchema,
});

server.addTool({
	name: "openapi_hurl:routes:list",
	description:
		"List all available routes with their HTTP methods from the specified OpenAPI spec",
	parameters: z.object({
		specs_name: z
			.string()
			.describe("Name of the API spec to get the list of routes from"),
	}),
	execute: listRoutesHandler,
});

server.addTool({
	name: "openapi_hurl:routes:retrieve",
	description:
		"Retrieve detailed information about a specific route/endpoint from the specified OpenAPI spec",
	parameters: z.object({
		specs_name: z
			.string()
			.describe("Name of the API spec to get the route from"),
		path: z
			.string()
			.describe("Path of the route to retrieve (e.g., /users, /pets/{petId})"),
		method: z
			.string()
			.describe("HTTP method of the route (GET, POST, PUT, DELETE, etc.)"),
	}),
	execute: retrieveRouteHandler,
});

server.addTool({
	name: "openapi_hurl:requests:retrieve",
	description:
		"Retrieve the request schema for a specific endpoint from an OpenAPI 3.x specification",
	parameters: z.object({
		specs_name: z.string().describe("Name of the API spec to retrieve from"),
		path: z
			.string()
			.describe("Path of the endpoint (e.g., /users, /pets/{petId})"),
		method: z
			.enum(["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"])
			.describe("HTTP method of the endpoint"),
	}),
	execute: retrieveRequestSchemaHandler,
});

server.addTool({
	name: "openapi_hurl:responses:retrieve",
	description:
		"Retrieve the response schema for a specific endpoint from an OpenAPI 3.x specification",
	parameters: z.object({
		specs_name: z.string().describe("Name of the API spec to retrieve from"),
		path: z
			.string()
			.describe("Path of the endpoint (e.g., /users, /pets/{petId})"),
		method: z
			.enum([
				"GET",
				"POST",
				"PUT",
				"PATCH",
				"DELETE",
				"HEAD",
				"OPTIONS",
				"TRACE",
			])
			.describe("HTTP method of the endpoint"),
	}),
	execute: retrieveResponseSchemaHandler,
});
