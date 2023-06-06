import { Decimal } from "npm:decimal.js";

Decimal.set({
	precision: 100,
	toExpNeg: -100,
	toExpPos: 100,
});

const dist_to_sun = new Decimal(149597870700);

const light_speed = new Decimal(299792458);

const time_in_seconds = dist_to_sun.div(light_speed);
const total_minutes = time_in_seconds.div(60).floor();
const remaining_seconds = time_in_seconds.minus(total_minutes.times(60));

console.log(`${total_minutes.toString()}m ${remaining_seconds.toFixed(2)}s`);
