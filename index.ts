import { Decimal } from "npm:decimal.js";

Decimal.set({
	precision: 100,
	toExpNeg: -100,
	toExpPos: 100,
});

const point1 = new Decimal("0.0000000000000000000000000000000000000000000000000000000000000000001");
const point2 = new Decimal("0.0000000000000000000000000000000000000000000000000000000000000000002");

const sum = point1.plus(point2);

console.log(
	0.1 + 0.2,
	sum,
);
