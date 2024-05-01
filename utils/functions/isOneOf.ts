import type { Primitive } from "../types/Primitive.ts";

export function isOneOf<T extends Primitive, U extends T[]>(value: T, ...values: U): value is U[number] {
	return values.includes(value);
}

// Example usage:
if (import.meta.main) {
	const thing = (() => {
		const random = Math.random();
		if (random < 0.25) return "A";
		if (random < 0.50) return "B";
		if (random < 0.75) return "C";
		if (random < 1.00) return "D";
	})();

	if (isOneOf(thing, "A", "B")) {
		thing; // "A" | "B"
	} else {
		thing; // "C" | D | undefined
	}
}
