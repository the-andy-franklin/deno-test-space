export async function asyncReplace(
	target: string,
	predicate: string | RegExp,
	replacer: (match: string, ...groups: string[]) => Promise<string>,
): Promise<string> {
	const matches = [...target.matchAll(typeof predicate === "string" ? new RegExp(predicate, "g") : predicate)];

	const replacements = await Promise.all(
		matches.map(async (match) => ({
			match: match[0],
			index: match.index!,
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
	const str = "The {{quick}} {{brown}} {{fox}} {{jumps}} {{over}} the {{lazy}} {{dog}}";

	const replaced = await asyncReplace(str, /{{(.*?)}}/g, async (match, group) => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		if (group.length === 3) return group.toUpperCase();

		if (group === "quick") return "slow";
		if (group === "brown") return "green";
		if (group === "jumps") return "rolls";
		if (group === "over") return "under";
		if (group === "lazy") return "sleepy";

		return group;
	});

	console.log(replaced);
}
