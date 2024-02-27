import { NonNullish } from "../types/NonNullish.ts";

export function NonNull<T>(value: T): value is NonNullish<T> {
	return value != null;
}
