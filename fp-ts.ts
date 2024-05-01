import { flow, pipe } from "fp-ts/function.ts";
import { match, none, Option, some } from "fp-ts/Option.ts";

const inverseWithMessage = flow(
	(x: number): Option<number> => x === 0 ? none : some(1 / x),
	match(
		() => "Cannot divide by zero",
		(x) => `The result is ${x}`,
	),
	console.log,
);

inverseWithMessage(0);

pipe(
	20,
	(x) => x * 2,
	(x) => x.toString(),
	(x) => x.split(""),
	(x) => x.pop(),
	console.log,
);
