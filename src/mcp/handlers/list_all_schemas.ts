import type { TextContent } from "fastmcp";
import { ApiStore } from "../../openapi/store";

export const listSchemasHandler = async ({
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

	const schemas: Record<string, unknown> = api.schema?.components.schemas;
	return {
		text: JSON.stringify(Object.keys(schemas)),
		type: "text",
	} satisfies TextContent;
};
