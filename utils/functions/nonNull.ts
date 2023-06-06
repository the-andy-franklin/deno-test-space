import type { NonNullish } from "../types/NonNullish.ts";

export function nonNull<T>(value: T): value is NonNullish<T> {
	return value != null;
}
