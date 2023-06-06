export type ArrayType<T extends (unknown[] | readonly unknown[])> = T extends (infer U)[] ? U : never;
