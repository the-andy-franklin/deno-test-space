import { asyncReplaceAll } from "./asyncReplaceAll.ts";

// deno-fmt-ignore-file
export async function asyncReplace(
  target: string,
  predicate: string | RegExp,
  replacer: (match: string, ...groups: string[]) => Promise<string> | string,
): Promise<string> {
	if (predicate instanceof RegExp && predicate.global) return asyncReplaceAll(target, predicate, replacer);
	if (typeof predicate === "string") predicate = new RegExp(predicate);

  const match = target.match(predicate);
	if (match?.index == null) return target;

	const replacement = await replacer(match[0], ...match.slice(1));
	return target.slice(0, match.index) + replacement + target.slice(match.index + match[0].length);
}

// Example usage:
if (import.meta.main) {
	const { delay } = await import("./delay.ts");

	const str = "The {{quick}} {{brown}} fox jumps over the lazy dog";

	const replaced = await asyncReplace(str, /{{(.*?)}}/, async (match, group) => {
		await delay(1000);

		return "dumb";
	});

	console.log(replaced);
}
