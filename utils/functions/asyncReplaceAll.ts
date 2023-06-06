// deno-fmt-ignore-file
export async function asyncReplaceAll(
	target: string,
	predicate: string | RegExp,
	replacer: (match: string, ...groups: string[]) => Promise<string> | string,
): Promise<string> {
  if (predicate instanceof RegExp && !predicate.global) {
    const error = new Error("Predicate must have the global flag");
    Error.captureStackTrace(error, asyncReplaceAll);
    throw error;
  }

	if (typeof predicate === "string") predicate = new RegExp(predicate, "g");
	const matches = [...target.matchAll(predicate)];

	const replacements = await Promise.all(
		matches.map(async (match) => ({
			match: match[0],
			index: match.index,
			replacement: await replacer(match[0], ...match.slice(1)),
		})),
	);

	let result = "";
	let lastIndex = 0;
	replacements.forEach(({ match, index, replacement }) => {
		result += target.substring(lastIndex, index) + replacement;
		lastIndex = index + match.length;
	});
	result += target.substring(lastIndex);

	return result;
}

// Example usage:
if (import.meta.main) {
	const { delay } = await import("./delay.ts");

	const str = "The {{quick}} {{brown}} {{fox}} {{jumps}} {{over}} the {{lazy}} {{dog}}";

	const replaced = await asyncReplaceAll(str, /{{(.*?)}}/, async (match, group) => {
		await delay(1000);

		if (group.length === 3) return group.toUpperCase().replace(/(\w)/g, "$1.");
		if (group === "quick") return "dumb";
		if (group === "brown") return "blue";
		if (group === "jumps") return "farts";
		if (group === "over") return "on";
		if (group === "lazy") return "sleepy";

		return group;
	});

	console.log(replaced);
}
