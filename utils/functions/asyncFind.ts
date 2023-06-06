import { getFulfilledPromises } from "./getFulfilledPromises.ts";

export async function asyncFind<T>(
	array: T[],
	predicate: (arg: T) => Promise<unknown>,
): Promise<T | undefined> {
	const results = await getFulfilledPromises(
		array.map(async (item) => ({
			result: Boolean(await predicate(item)),
			item,
		})),
	);

	for (const { result, item } of results) if (result) return item;
}

// Example usage:
if (import.meta.main) {
	const { delay } = await import("./delay.ts");

	const thing: { [key: string]: string } = {
		1: "one",
		2: "two",
		3: "three",
		4: "four",
		5: "five",
	};

	const three = await asyncFind(Object.entries(thing), async ([key]) => {
		await delay(1000);
		return key === "3";
	});

	console.log(three);
}
