import Fraction from "npm:fraction.js";
import { flow } from "fp-ts/function.ts";
import { left, match, right } from "fp-ts/Either.ts";
import { Try } from "./utils/functions/try.ts";

const { log, error } = console;
const toFraction = (x: number) => new Fraction(x).toFraction();

const inverseWithMessage = flow(
	(x: number, y: number = 1) => {
		if (x === 0) return left("can't divide by 0");
		return right(toFraction(y / x));
	},
	match(
		(e) => error(e),
		(x) => log(x),
	),
);

inverseWithMessage(1);

function betterInverseWithMessage(x: number, y = 1) {
	const result = Try(() => {
		if (x === 0) throw new Error("can't divide by 0");
		return toFraction(y / x);
	});

	if (result.failure) error(result.error);
	else log(result.data);
}

betterInverseWithMessage(1);
