import { isNullish } from "./isNullish.ts";
import type { Nullish } from "../types/Nullish.ts";
import type { WidenLiteral } from "../types/WidenLiteral.ts";

export function getValue<T extends Record<PropertyKey, unknown>>(
	obj: T | Nullish,
	key: WidenLiteral<keyof T> | Nullish,
): T[keyof T] | undefined {
	if (isNullish(obj)) return;
	if (isNullish(key)) return;

	if (key in obj) return obj[key];
}
