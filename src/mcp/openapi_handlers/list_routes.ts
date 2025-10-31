import type { TextContent } from "fastmcp";
import { ApiStore } from "../../openapi/store";

export const listRoutesHandler = async ({
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

	const paths = api.schema?.paths;
	if (!paths) {
		return {
			text: `No paths found in spec: ${specs_name}`,
			type: "text",
		} satisfies TextContent;
	}

	const httpMethods = [
		"get",
		"put",
		"post",
		"delete",
		"options",
		"head",
		"patch",
	] as const;

	const routes: string[] = [];
	for (const [path, pathItem] of Object.entries(paths)) {
		if (pathItem) {
			const methods = [];

			for (const method of httpMethods) {
				if (pathItem[method]) {
					methods.push(method.toUpperCase());
				}
			}

			if (methods.length > 0) {
				routes.push(...methods.map((method) => `${method} ${path}`));
			}
		}
	}

	return {
		text: JSON.stringify(routes, null, 2),
		type: "text",
	} satisfies TextContent;
};
