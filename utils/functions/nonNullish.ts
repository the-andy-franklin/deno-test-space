import { NonNullish } from "../types/NonNullish.ts";

export function nonNullish<T>(value: T): value is NonNullish<T> {
	return value != null;
}
