import { FastMCP } from "fastmcp";
import z from "zod";
import { loadSource, parse } from "../openapi/loader";
import { ApiStore } from "../openapi/store";

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
	execute: async ({ name, source }) => {
		const data = await loadSource(source);
		const api = await parse({ data, source: source });

		if (!api || Array.isArray(api)) {
			return { text: `Invalid OpenAPI Schema from ${source}`, type: "text" };
		}

		ApiStore.set(name, api);
		return { text: "Successfully loaded the API schema", type: "text" };
	},
});

server.addTool({
	name: "openapi_hurl:specifications:list",
	description:
		"List the specifications loaded in the store and ready to inspect",
	execute: async () => {
		return {
			text: JSON.stringify([...ApiStore.keys()]),
			type: "text",
		};
	},
});

server.addTool({
	name: "openapi_hurl:schemas:list",
	description: "Get all schemas names from the specified OpenAPI spec",
	parameters: z.object({
		specs_name: z.string().describe("Name of the API spec to get schemas from"),
	}),
	execute: async ({ specs_name }) => {
		const api = ApiStore.get(specs_name);

		if (!api) {
			return {
				text: `No API spec found with name: ${specs_name}`,
				type: "text",
			};
		}

		const schemas: Record<string, unknown> = api.schema?.components.schemas;
		return {
			text: JSON.stringify(Object.keys(schemas)),
			type: "text",
		};
	},
});

server.addTool({
	name: "openapi_hurl:schemas:get",
	description:
		"Get the details of a specific schema from the specified OpenAPI spec",
	parameters: z.object({
		specs_name: z.string().describe("Name of the API spec to get schema from"),
		schema_name: z.string().describe("Name of the schema to retrieve"),
	}),
	execute: async ({ specs_name, schema_name }) => {
		const api = ApiStore.get(specs_name);

		if (!api) {
			return {
				text: `No API spec found with name: ${specs_name}`,
				type: "text",
			};
		}

		const schemas: Record<string, unknown> = api.schema?.components.schemas;
		if (!schemas || !schemas[schema_name]) {
			return {
				text: `No schema found with name: ${schema_name} in spec: ${specs_name}`,
				type: "text",
			};
		}

		return {
			text: JSON.stringify(schemas[schema_name], null, 2),
			type: "text",
		};
	},
});

server.addTool({
	name: "openapi_hurl:security:list",
	description: "Get all security schemes and definitions from the specified OpenAPI spec",
	parameters: z.object({
		specs_name: z.string().describe("Name of the API spec to get security information from"),
	}),
	execute: async ({ specs_name }) => {
		const api = ApiStore.get(specs_name);

		if (!api) {
			return {
				text: `No API spec found with name: ${specs_name}`,
				type: "text",
			};
		}

		const result: Record<string, unknown> = {};
		
		// Add top-level security requirements
		if (api.schema?.security) {
			result.security = api.schema.security;
		}
		
		// Add security schemes from components
		if (api.schema?.components?.securitySchemes) {
			result.securitySchemes = api.schema.components.securitySchemes;
		}
		
		// For older OpenAPI/Swagger versions, also check securityDefinitions
		if (api.schema?.securityDefinitions) {
			result.securityDefinitions = api.schema.securityDefinitions;
		}
		
		if (Object.keys(result).length === 0) {
			return {
				text: `No security information found in spec: ${specs_name}`,
				type: "text",
			};
		}

		return {
			text: JSON.stringify(result, null, 2),
			type: "text",
		};
	},
});

server.addTool({
	name: "openapi_hurl:security:get",
	description: "Get the details of a specific security scheme from the specified OpenAPI spec",
	parameters: z.object({
		specs_name: z.string().describe("Name of the API spec to get security scheme from"),
		security_name: z.string().describe("Name of the security scheme to retrieve"),
	}),
	execute: async ({ specs_name, security_name }) => {
		const api = ApiStore.get(specs_name);

		if (!api) {
			return {
				text: `No API spec found with name: ${specs_name}`,
				type: "text",
			};
		}

		// Check in components.securitySchemes first (OpenAPI 3.x)
		if (api.schema?.components?.securitySchemes?.[security_name]) {
			return {
				text: JSON.stringify(api.schema.components.securitySchemes[security_name], null, 2),
				type: "text",
			};
		}
		
		// Then check in securityDefinitions (for OpenAPI 2.0/Swagger)
		if (api.schema?.securityDefinitions?.[security_name]) {
			return {
				text: JSON.stringify(api.schema.securityDefinitions[security_name], null, 2),
				type: "text",
			};
		}

		return {
			text: `No security scheme found with name: ${security_name} in spec: ${specs_name}`,
			type: "text",
		};
	},
});
