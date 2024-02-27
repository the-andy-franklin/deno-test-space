import { Nullish } from "../types/Nullish.ts";

// deno-lint-ignore no-explicit-any
export function getValue<T extends Record<PropertyKey, any>>(
	obj: T | Nullish,
	key: PropertyKey | Nullish,
): T[keyof T] | undefined {
	if (obj == null) return;
	if (key == null) return;

	if (key in obj) return obj[key];
}
