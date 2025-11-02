import type { TextContent } from "fastmcp";

const doc = {
	sample:
		"https://raw.githubusercontent.com/Orange-OpenSource/hurl/refs/heads/master/docs/samples.md",
	entry:
		"https://raw.githubusercontent.com/Orange-OpenSource/hurl/refs/heads/master/docs/entry.md",
	request:
		"https://raw.githubusercontent.com/Orange-OpenSource/hurl/refs/heads/master/docs/request.md",
	response:
		"https://raw.githubusercontent.com/Orange-OpenSource/hurl/refs/heads/master/docs/response.md",
	capturing_response:
		"https://raw.githubusercontent.com/Orange-OpenSource/hurl/refs/heads/master/docs/capturing-response.md",
	asserting_response:
		"https://raw.githubusercontent.com/Orange-OpenSource/hurl/refs/heads/master/docs/asserting-response.md",
	filters:
		"https://raw.githubusercontent.com/Orange-OpenSource/hurl/refs/heads/master/docs/filters.md",
	templates:
		"https://raw.githubusercontent.com/Orange-OpenSource/hurl/refs/heads/master/docs/templates.md",
} as const;

export type HurlDocumentTitle = keyof typeof doc;

export const retrieveDocsHandler = async ({
	document_title,
}: {
	document_title: HurlDocumentTitle;
}) => {
	const url = doc[document_title];

	let text: string;

	try {
		text = await fetch(url).then((res) => res.text());
	} catch (err) {
		return {
			text: `${err}`,
			type: "text",
		} satisfies TextContent;
	}

	return {
		text,
		type: "text",
	} satisfies TextContent;
};
