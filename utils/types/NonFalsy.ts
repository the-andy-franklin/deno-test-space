import { Falsy } from "./Falsy.ts";

export type NonFalsy<T> = Exclude<T, Falsy>;
