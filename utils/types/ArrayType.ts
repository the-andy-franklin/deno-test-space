// deno-lint-ignore no-explicit-any
export type ArrayType<T extends any[]> = T extends (infer U)[] ? U : never;
