// deno-fmt-ignore-file
import { throwError } from "./utils/functions/throwError.ts";

const underTen = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
const underTwenty = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
const suffix = ["", "Thousand", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion", "Sextillion", "Septillion", "Octillion", "Nonillion", "Decillion", "Undecillion", "Duodecillion", "Tredecillion", "Quattuordecillion", "Quindecillion", "Sexdecillion", "Septendecillion", "Octodecillion", "Novemdecillion", "Vigintillion", "Unvigintillion", "Duovigintillion", "Trevigintillion", "Quattuorvigintillion", "Quinvigintillion", "Sexvigintillion", "Septenvigintillion", "Octovigintillion", "Novemvigintillion", "Trigintillion", "Untrigintillion", "Duotrigintillion", "Tretrigintillion", "Quattuortrigintillion", "Quintrigintillion", "Sextrigintillion", "Septentrigintillion", "Octotrigintillion", "Novemtrigintillion", "Quadragintillion", "Unquadragintillion", "Duoquadragintillion", "Trequadragintillion", "Quattuorquadragintillion", "Quinquadragintillion", "Sexquadragintillion", "Septenquadragintillion", "Octoquadragintillion", "Novemquadragintillion", "Quinquagintillion"];

function processChunk(chunk: number): string {
	if (chunk === 0) return "";
	if (chunk <  20) return underTwenty[chunk] ?? throwError("Invalid chunk");
	if (chunk < 100) return tens[Math.floor(chunk / 10)] + (chunk % 10 ? "-" + underTen[chunk % 10] : "");
	return underTen[Math.floor(chunk / 100)] + " Hundred" + (chunk % 100 ? " and " + processChunk(chunk % 100) : "");
}

export function numberToWords(num: number | string | bigint): string {
	let str = num.toString().trim();
	const match = str.match(/^(-?)(\d+)(\.\d+)?$/);
	if (!match) throw "Invalid input";

	const [, sign, integer, decimal] = match;
	if (integer === undefined) throw "Invalid input";

	const isNegative = sign === "-";
	str = integer;

	let result = "";
	for (let i = 0; str.length > 0; i++) {
		const chunk = str.length > 3 ? str.slice(-3) : str;
		str = str.slice(0, -3);

		const words = processChunk(+chunk);
		if (words) {
			if (i === 0) result = words;
			else result = `${words} ${suffix[i]}, ${result}`;
		}
	}

	if (isNegative) result = "Negative " + result;
	return result.trim().replace(/,(?!.*(\band\b|,).*$)/, " and");
}

const exceptions: { [key: string]: string } = {
	"One": "First",
	"Two": "Second",
	"Three": "Third",
	"Five": "Fifth",
	"Eight": "Eighth",
	"Nine": "Ninth",
	"Twelve": "Twelfth",
};

export function numberToOrdinalWords(num: number | string | bigint): string {
	const words = numberToWords(num);

	const condition = words.match(/(-| )/);
	const [, prefixWords, splitter, lastWord] = words.match(condition ? /(.*)(-| )(.*?)$/ : /()()(.*)$/) ?? [];

	/* deno-fmt-ignore */
	const ordinalLastWord =
		!lastWord ? "" :
		exceptions[lastWord] ? exceptions[lastWord] :
		lastWord.endsWith("y") ? lastWord.replace(/y$/, "ieth") :
		lastWord + "th";

	return [prefixWords, ordinalLastWord].join(splitter).trim();
}

const start = performance.now();
console.log(numberToOrdinalWords(123456789n));
const end = performance.now();
console.log(`Time: ${end - start}ms`);
