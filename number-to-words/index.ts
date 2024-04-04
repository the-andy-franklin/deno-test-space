const underTwenty = [
	"",
	"One",
	"Two",
	"Three",
	"Four",
	"Five",
	"Six",
	"Seven",
	"Eight",
	"Nine",
	"Ten",
	"Eleven",
	"Twelve",
	"Thirteen",
	"Fourteen",
	"Fifteen",
	"Sixteen",
	"Seventeen",
	"Eighteen",
	"Nineteen",
];
const tens = [
	"",
	"",
	"Twenty",
	"Thirty",
	"Forty",
	"Fifty",
	"Sixty",
	"Seventy",
	"Eighty",
	"Ninety",
];
const parts = [
	"",
	"Thousand",
	"Million",
	"Billion",
	"Trillion",
	"Quadrillion",
	"Quintillion",
	"Sextillion",
	"Septillion",
	"Octillion",
	"Nonillion",
	"Decillion",
	"Undecillion",
	"Duodecillion",
	"Tredecillion",
	"Quattuordecillion",
	"Quindecillion",
	"Sexdecillion",
	"Septendecillion",
	"Octodecillion",
	"Novemdecillion",
	"Vigintillion",
	"Unvigintillion",
	"Duovigintillion",
	"Trevigintillion",
	"Quattuorvigintillion",
	"Quinvigintillion",
	"Sexvigintillion",
	"Septenvigintillion",
	"Octovigintillion",
	"Novemvigintillion",
	"Trigintillion",
	"Untrigintillion",
	"Duotrigintillion",
	"Tretrigintillion",
	"Quattuortrigintillion",
	"Quintrigintillion",
	"Sextrigintillion",
	"Septentrigintillion",
	"Octotrigintillion",
	"Novemtrigintillion",
	"Quadragintillion",
	"Unquadragintillion",
	"Duoquadragintillion",
	"Trequadragintillion",
	"Quattuorquadragintillion",
	"Quinquadragintillion",
	"Sexquadragintillion",
	"Septenquadragintillion",
	"Octoquadragintillion",
	"Novemquadragintillion",
	"Quinquagintillion",
];

function processChunk(chunk: number): string {
	if (chunk === 0) return "";
	if (chunk < 20) return underTwenty[chunk];
	if (chunk < 100) return tens[Math.floor(chunk / 10)] + (chunk % 10 ? "-" + underTwenty[chunk % 10] : "");
	return underTwenty[Math.floor(chunk / 100)] + " Hundred" + (chunk % 100 ? " and " + processChunk(chunk % 100) : "");
}

export function numberToWords(num: number | string | bigint): string {
	let str = num.toString().trim();
	const match = str.match(/^(-?)(\d+)(\.\d+)?$/);
	if (!match) return "Invalid input";

	const [, sign, integer, _decimal] = match;
	const isNegative = sign === "-";
	str = integer;

	let result = "";
	for (let i = 0; str.length > 0; i++) {
		const chunk = str.length > 3 ? str.slice(-3) : str;
		str = str.slice(0, -3);

		const words = processChunk(+chunk);
		if (words) result = `${words} ${parts[i]}, ${result}`;
	}

	if (isNegative) result = "Negative " + result;

	return result.trim()
		.replace(/,$/, "")
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

const start = performance.now();
console.log(numberToWords(1234567892.1234567890));
const end = performance.now();
console.log(`Time: ${end - start}ms`);
