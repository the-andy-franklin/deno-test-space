const compile = new Deno.Command("gcc", {
	args: ["-shared", "-o", "insertion_sort.so", "insertion_sort.cpp"],
});

await compile.output();
