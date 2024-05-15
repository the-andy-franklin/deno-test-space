import { Decimal } from "npm:decimal.js";

Decimal.set({
	precision: 100,
	toExpNeg: -100,
	toExpPos: 100,
});

const earth_orbit_radius = new Decimal(93000000);
const earth_orbit_circumference = earth_orbit_radius.mul(2).mul(Math.PI);

const light_second = new Decimal(186282);
const light_minute = light_second.mul(60);

const [int, dec] = earth_orbit_circumference.div(light_minute).toString().split(".");
const _dec = "0." + dec;
const __dec = new Decimal(_dec).toFraction(10000);

console.log(int + "+" + __dec[0] + "/" + __dec[1]);
