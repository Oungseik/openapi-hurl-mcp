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

	const servers = api.specification?.servers;

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

	const routes: { http: string; description?: string; summary?: string }[] = [];
	for (const [path, pathItem] of Object.entries(paths)) {
		if (pathItem) {
			const methods: string[] = [];

			for (const method of httpMethods) {
				if (pathItem[method]) {
					methods.push(method);
				}
			}

			const temp: { http: string; description?: string; summary?: string }[] =
				methods.map((method) => ({
					http: `${method.toLocaleUpperCase()} ${path}`,
					description: pathItem[method]?.["description"],
					summary: pathItem[method]?.["summary"],
				}));

			if (methods.length > 0) {
				routes.push(...temp);
			}
		}
	}

	return {
		text: JSON.stringify({ servers, routes }, null, 2),
		type: "text",
	} satisfies TextContent;
};
