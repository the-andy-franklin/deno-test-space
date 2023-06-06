import { isNullish } from "./isNullish.ts";
import type { Nullish } from "../types/Nullish.ts";
import type { WidenLiteral } from "../types/WidenLiteral.ts";

export function getFrom<T extends Record<PropertyKey, unknown>>(
	obj: T | Nullish,
	key: WidenLiteral<keyof T> | Nullish,
): T[keyof T] | undefined {
	if (isNullish(obj)) return;
	if (isNullish(key)) return;

	if (key in obj) return obj[key];
}

if (import.meta.main) {
	const obj = { a: 1, b: 2 };
	const str = "c";

	const a = obj["a"];
	const b = obj["b"];
	const c = getFrom(obj, str);
	// const d = obj[str]
}
