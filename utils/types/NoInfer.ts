// deno-lint-ignore no-explicit-any
export type NoInfer<T> = [T][T extends any ? 0 : never];
