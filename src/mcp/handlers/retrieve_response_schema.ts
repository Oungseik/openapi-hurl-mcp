import type { TextContent } from "fastmcp";
import { ApiStore } from "../../openapi/store";

export const retrieveResponseSchemaHandler = async ({
	specs_name,
	path,
	method,
}: {
	specs_name: string;
	path: string;
	method: string;
}) => {
	const spec = ApiStore.get(specs_name);

	if (!spec) {
		return {
			text: `No API spec found with name: ${specs_name}`,
			type: "text",
		} satisfies TextContent;
	}

	const normalizedMethod = method.toLowerCase() as
		| "get"
		| "put"
		| "post"
		| "delete"
		| "options"
		| "head"
		| "patch";

	// Find the path in the spec
	if (!spec.schema?.paths || !spec.schema.paths[path]) {
		return {
			text: `Path '${path}' not found in spec: ${specs_name}`,
			type: "text",
		} satisfies TextContent;
	}

	const pathItem = spec.schema.paths[path];
	const operation = pathItem?.[normalizedMethod];

	if (!operation) {
		return {
			text: `Method '${method}' not found for path '${path}' in spec: ${specs_name}`,
			type: "text",
		} satisfies TextContent;
	}

	// Extract response schemas
	const responses = operation.responses;
	if (!responses) {
		return {
			text: `No responses defined for ${method} ${path} in ${specs_name}`,
			type: "text",
		} satisfies TextContent;
	}

	return {
		text: JSON.stringify(
			{
				path,
				method: method.toUpperCase(),
				responses,
				description: `Response schemas for ${method} ${path}`,
			},
			null,
			2,
		),
		type: "text",
	} satisfies TextContent;
};

