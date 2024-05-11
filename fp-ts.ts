import Fraction from "npm:fraction.js";
import { flow, pipe } from "fp-ts/function.ts";
import { left, match, right } from "fp-ts/Either.ts";

const toFraction = (x: number) => new Fraction(x).toFraction();

const inverseWithMessage = flow(
	(x: number) => x === 0 ? left(new Error("can't divide by 0")) : right(1 / x),
	match(
		(e) => console.error(e),
		(x) => console.log(toFraction(x)),
	),
);

inverseWithMessage(0);

pipe(
	20,
	(x) => x * 2,
	(x) => x.toString(),
	console.log,
);
