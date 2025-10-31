import type { TextContent } from "fastmcp";
import { ApiStore } from "../../openapi/store";

export const retrieveRouteHandler = async ({
	specs_name,
	path,
	method,
}: {
	specs_name: string;
	path: string;
	method: string;
}) => {
	const api = ApiStore.get(specs_name);

	if (!api) {
		return {
			text: `No API spec found with name: ${specs_name}`,
			type: "text",
		} satisfies TextContent;
	}

	const paths = api.schema?.paths;
	if (!paths) {
		return {
			text: `No paths found in spec: ${specs_name}`,
			type: "text",
		} satisfies TextContent;
	}

	// Normalize the method to lowercase to match the OpenAPI structure
	const normalizedMethod = method.toLowerCase() as
		| "get"
		| "put"
		| "post"
		| "delete"
		| "options"
		| "head"
		| "patch";

	// Find the path in the API specification
	const pathItem = paths[path];
	if (!pathItem) {
		return {
			text: `Path '${path}' not found in spec: ${specs_name}`,
			type: "text",
		} satisfies TextContent;
	}

	// Get the operation for the specified method
	const operation = pathItem[normalizedMethod];
	if (!operation) {
		return {
			text: `Method '${method}' not found for path '${path}' in spec: ${specs_name}`,
			type: "text",
		} satisfies TextContent;
	}

	// Construct detailed endpoint information
	const endpointInfo: any = {
		path: path,
		method: method.toUpperCase(),
		summary: operation.summary || undefined,
		description: operation.description || undefined,
		parameters: operation.parameters || [],
		requestBody: operation.requestBody || undefined,
		responses: operation.responses || {},
		security: operation.security || undefined,
		tags: operation.tags || undefined,
		deprecated: operation.deprecated || false,
	};

	// Clean up undefined values for cleaner output
	const cleanEndpointInfo: any = {};
	for (const [key, value] of Object.entries(endpointInfo)) {
		if (value !== undefined) {
			cleanEndpointInfo[key] = value;
		}
	}

	return {
		text: JSON.stringify(cleanEndpointInfo, null, 2),
		type: "text",
	} satisfies TextContent;
};
