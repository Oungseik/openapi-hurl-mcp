import type { TextContent } from "fastmcp";
import { ApiStore } from "../../openapi/store";

export const listSpecs = async () => {
	return {
		text: JSON.stringify([...ApiStore.keys()]),
		type: "text",
	} satisfies TextContent;
};
