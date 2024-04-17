import { ValueOf } from "../types/ValueOf.ts";

const ExampleEnum = {
	THING_1: "THING_1",
	THING_2: "THING_2",
	THING_3: "THING_3",
} as const;

type ExampleEnum = ValueOf<typeof ExampleEnum>;

let thing: ExampleEnum = ExampleEnum.THING_1;
thing = "THING_2";
