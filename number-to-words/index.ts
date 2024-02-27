const underTwenty = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
const parts = ["", "Thousand", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion", "Sextillion", "Septillion", "Octillion", "Nonillion", "Decillion", "Undecillion", "Duodecillion", "Tredecillion", "Quattuordecillion", "Quindecillion", "Sexdecillion", "Septendecillion", "Octodecillion", "Novemdecillion", "Vigintillion", "Centillion", "Unvigintillion", "Duovigintillion", "Trevigintillion", "Quattuorvigintillion", "Quinvigintillion", "Sexvigintillion", "Septenvigintillion", "Octovigintillion", "Novemvigintillion", "Trigintillion", "Untrigintillion", "Duotrigintillion", "Tretrigintillion", "Quattuortrigintillion", "Quintrigintillion", "Sextrigintillion", "Septentrigintillion", "Octotrigintillion", "Novemtrigintillion", "Quadragintillion", "Unquadragintillion", "Duoquadragintillion", "Trequadragintillion", "Quattuorquadragintillion", "Quinquadragintillion", "Sexquadragintillion", "Septenquadragintillion", "Octoquadragintillion", "Novemquadragintillion", "Quinquagintillion", "Unquinquagintillion", "Duoquinquagintillion", "Trequinquagintillion", "Quattuorquinquagintillion"];

function sliceOffDecimal(num: number): number {
	if (num % 1 === 0) return num;
	return Number(num.toString().split(".")[0]);
}

function processChunk(chunk: number): string {
	if (chunk === 0) return "";
	if (chunk < 20) return underTwenty[chunk];
	if (chunk < 100) return tens[Math.floor(chunk / 10)] + (chunk % 10 ? "-" + underTwenty[chunk % 10] : "");
	return underTwenty[Math.floor(chunk / 100)] + " Hundred" + (chunk % 100 ? " and " + processChunk(chunk % 100) : "");
}

export function numberToWords(input: number | string | bigint): string {
	let num = Number(input);
	if (isNaN(num)) return "Invalid input";

	num = sliceOffDecimal(num);
	if (num === 0) return "Zero";

	const isNegative = num < 0;
	let str = Math.abs(num).toString();

	let result = "";
	for (let i = 0; str.length > 0; i++) {
		const chunk = str.length > 3 ? str.slice(-3) : str;
		str = str.slice(0, -3);

		const words = processChunk(+chunk);
		if (words) result = words + (i ? " " + parts[i] + ", " : "") + result;
	}

	if (isNegative) result = "Negative " + result;
	return result
		.replace(/, $/, "")
		.replace(/,(?!.*(\band\b|,).*$)/, ", and");
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

export function numberToOrdinalWords(input: number): string {
	const words = numberToWords(input);
	if (words === "Invalid input") return "Invalid input";

	const condition = words.match(/(-| )/);
	const [, prefixWords, splitter, lastWord] = words.match(condition ? /(.*)(-| )(.*?)$/ : /()()(.*)$/) ?? ([] as undefined[]);

	/* deno-fmt-ignore */
	const ordinalLastWord =
		!lastWord ? "" :
		exceptions[lastWord] ? exceptions[lastWord] :
		lastWord.endsWith("y") ? lastWord.replace(/y$/, "ieth") :
		lastWord + "th";

	return [prefixWords, ordinalLastWord].join(splitter ?? " ").trim();
}

console.log(numberToWords(1000000000000000000000000000000000000000000000000000000000000000000000n));
