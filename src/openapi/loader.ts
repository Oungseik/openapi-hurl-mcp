import * as fsAsync from "node:fs/promises";
import * as path from "node:path";
import * as process from "node:process";
import { parse as _parse, dereference, validate } from "@readme/openapi-parser";
import { err, ok } from "./error";

export function loadSource(url: string): Promise<string> {
	return url.startsWith("http://") || url.startsWith("https://")
		? loadFromURL(url)
		: loadFromFile(url);
}

async function loadFromFile(file: string): Promise<string> {
	const isAbsolute = file.startsWith("/");
	const finalPath = isAbsolute ? file : path.resolve(process.cwd(), file);
	return fsAsync.readFile(finalPath, { encoding: "utf8" });
}

async function loadFromURL(url: string): Promise<string> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`HTTP ${response.status}: ${response.statusText}`);
	}
	return response.text();
}

export async function parse(spec: { source: string; data: string }) {
	const validateResult = await validate(spec.data);

	if (!validateResult.valid) {
		return err(validateResult.errors);
	}

	const api = await _parse(spec.data).then(dereference);
	return ok(api);
}
