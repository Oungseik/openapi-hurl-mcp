import type { TextContent } from "fastmcp";
import { ApiStore } from "../../openapi/store";

export const retrieveSecuritySchema = async ({
	specs_name,
	security_name,
}: {
	specs_name: string;
	security_name: string;
}) => {
	const api = ApiStore.get(specs_name);

	if (!api) {
		return {
			text: `No API spec found with name: ${specs_name}`,
			type: "text",
		} satisfies TextContent;
	}

	// Check in components.securitySchemes first (OpenAPI 3.x)
	if (api.schema?.components?.securitySchemes?.[security_name]) {
		return {
			text: JSON.stringify(
				api.schema.components.securitySchemes[security_name],
				null,
				2,
			),
			type: "text",
		} satisfies TextContent;
	}

	// Then check in securityDefinitions (for OpenAPI 2.0/Swagger)
	if (api.schema?.securityDefinitions?.[security_name]) {
		return {
			text: JSON.stringify(
				api.schema.securityDefinitions[security_name],
				null,
				2,
			),
			type: "text",
		} satisfies TextContent;
	}

	return {
		text: `No security scheme found with name: ${security_name} in spec: ${specs_name}`,
		type: "text",
	} satisfies TextContent;
};
