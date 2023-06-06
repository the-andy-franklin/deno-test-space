async function runPythonAdd(a: number, b: number) {
	const command = new Deno.Command("python3", {
		args: ["add.py", JSON.stringify({ a, b })],
	});

	const { success, stdout, stderr } = await command.output();
	const result = new TextDecoder().decode(success ? stdout : stderr).trim();

	console.log(`Result: ${result}`);
}

runPythonAdd(10, 5);
