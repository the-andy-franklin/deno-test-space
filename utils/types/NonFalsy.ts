export type NonFalsy<T> = Exclude<T, false | "" | 0 | 0n | null | undefined>;
