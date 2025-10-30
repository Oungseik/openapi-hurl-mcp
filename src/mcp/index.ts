import { FastMCP } from "fastmcp";
import z from "zod";
import { loadSource, parse } from "../openapi/loader";
import { ApiStore } from "../openapi/store";

export const server = new FastMCP({
	name: "My Server",
	version: "1.0.0",
});

server.addTool({
	name: "openapi_hurl:schema:add",
	description: "Load openapi schema from JSON or YAML.",
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
