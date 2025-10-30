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
