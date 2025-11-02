import { FastMCP } from "fastmcp";
import z from "zod";
import { retrieveDocsHandler } from "./hurl_handlers/retrieve_docs";
import { addSpecsHandler } from "./openapi_handlers/add_specs";
import { listSchemasHandler } from "./openapi_handlers/list_all_schemas";
import { listRoutesHandler } from "./openapi_handlers/list_routes";
import { listSecuritySchemasHandler } from "./openapi_handlers/list_security_schemas";
import { listSpecs } from "./openapi_handlers/list_specs";
import { retrieveRequestSchemaHandler } from "./openapi_handlers/retrieve_request_schema";
import { retrieveResponseSchemaHandler } from "./openapi_handlers/retrieve_response_schema";
import { retrieveRouteHandler } from "./openapi_handlers/retrieve_route";
import { retrieveSchemaHandler } from "./openapi_handlers/retrieve_schema";
import { retrieveSecuritySchema } from "./openapi_handlers/retrieve_security_schema";

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

server.addTool({
	name: "openapi_hurl:hurl_document:retrieve",
	description: `Retrieve the document of hurl. Title of the documents are 
  - 'sample' which contains various sample of using hurl
  - 'entry' the entry definition
  - 'request' which contains Request describes an HTTP request: a mandatory method and URL, followed by optional headers. Then, options like (retry, delay,  ), query parameters, form parameters, multipart form data, cookies, and basic authentication can be used to configure the HTTP request. Finally, an optional body can be used to configure the HTTP request body
  - 'response' which is Responses can be used to capture values to perform subsequent requests, or add asserts to HTTP responses. Response on requests are optional, a Hurl file can just consist of a sequence of requests. A response describes the expected HTTP response, with mandatory version and status, followed by optional headers, captures, asserts and body. Assertions in the expected HTTP response describe values of the received HTTP response. Captures capture values from the received HTTP response and populate a set of named variables that can be used in the following entries.
  - 'capturing_response' which is the ways to capture the responses in details
  - 'asserting_response' which is the ways to assert the responses in details 
  - 'filters'`,
	parameters: z.object({
		document_title: z
			.enum([
				"entry",
				"request",
				"response",
				"capturing_response",
				"asserting_response",
				"filters",
			])
			.describe("The title of the sections in the HURL documentation."),
	}),
	execute: retrieveDocsHandler,
});
