import { Nullish } from "./Nullish.ts";

export type NonNullish<T> = Exclude<T, Nullish>;
