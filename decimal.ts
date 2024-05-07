import { Decimal } from "npm:decimal.js";

Decimal.set({
	precision: 100,
	toExpNeg: -100,
	toExpPos: 100,
});

// all in miles
const earth_orbit_radius = new Decimal(93000000);
const earth_orbit_circumference = earth_orbit_radius.mul(2).mul(Math.PI);

console.log(earth_orbit_circumference.toNumber());

const light_second = new Decimal(186282);
const light_minute = light_second.mul(60);
const light_year = light_second.mul(60).mul(60).mul(24).mul(365);

console.log(light_year.toNumber());

console.log(earth_orbit_circumference.div(light_minute).toNumber());
