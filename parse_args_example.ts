const name = Deno.args[0];
const food = Deno.args[1];
console.log(`Hello ${name}, I like ${food}!`);

import { parseArgs } from "https://deno.land/std@0.207.0/cli/parse_args.ts";

const flags = parseArgs(Deno.args, {
	boolean: ["help", "color"],
	string: ["version"],
	default: { color: true },
	negatable: ["color"],
});

console.log("Wants help?", flags.help);
console.log("Version:", flags.version);
console.log("Wants color?:", flags.color);
console.log("Other:", flags._);
