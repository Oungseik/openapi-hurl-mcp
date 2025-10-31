import type { TextContent } from "fastmcp";
import { loadSource, parse } from "../../openapi/loader";
import { ApiStore } from "../../openapi/store";

export const addSpecsHandler = async ({
	name,
	source,
}: {
	name: string;
	source: string;
}) => {
	const data = await loadSource(source);
	const api = await parse({ data, source: source });

	if (!api || Array.isArray(api)) {
		return {
			text: `Invalid OpenAPI Schema from ${source}`,
			type: "text",
		} satisfies TextContent;
	}

	ApiStore.set(name, api);
	return {
		text: "Successfully loaded the API schema",
		type: "text",
	} satisfies TextContent;
};
