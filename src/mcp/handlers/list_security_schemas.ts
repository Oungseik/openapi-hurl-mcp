import type { TextContent } from "fastmcp";
import { ApiStore } from "../../openapi/store";

export const listSecuritySchemasHandler = async ({
	specs_name,
}: {
	specs_name: string;
}) => {
	const api = ApiStore.get(specs_name);

	if (!api) {
		return {
			text: `No API spec found with name: ${specs_name}`,
			type: "text",
		} satisfies TextContent;
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
		} satisfies TextContent;
	}

	return {
		text: JSON.stringify(result, null, 2),
		type: "text",
	} satisfies TextContent;
};
