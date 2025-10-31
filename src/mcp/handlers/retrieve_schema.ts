import type { TextContent } from "fastmcp";
import { ApiStore } from "../../openapi/store";

type Input = { specs_name: string; schema_name: string };

export const retrieveSchemaHandler = async ({
	specs_name,
	schema_name,
}: Input) => {
	const api = ApiStore.get(specs_name);

	if (!api) {
		return {
			text: `No API spec found with name: ${specs_name}`,
			type: "text",
		} satisfies TextContent;
	}

	const schemas: Record<string, unknown> = api.schema?.components.schemas;
	if (!schemas || !schemas[schema_name]) {
		return {
			text: `No schema found with name: ${schema_name} in spec: ${specs_name}`,
			type: "text",
		} satisfies TextContent;
	}

	return {
		text: JSON.stringify(schemas[schema_name], null, 2),
		type: "text",
	} satisfies TextContent;
};
