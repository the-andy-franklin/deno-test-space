import type { Nullish } from "../types/Nullish.ts";

export function isNullish(value: unknown): value is Nullish {
	return value == null;
}
