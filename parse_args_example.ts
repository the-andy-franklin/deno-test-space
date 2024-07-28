import { parseArgs } from "https://deno.land/std@0.207.0/cli/parse_args.ts";
// deno run parse_args_example.ts --version=1.0.0 --no-color --help Deno sushi

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

const name = flags._[0];
const food = flags._[1];

console.log(`Hello from ${name}, I like ${food}!`);
