export type NonFalsy<T> = T extends false | 0 | "" | null | undefined | 0n ? never : T;
