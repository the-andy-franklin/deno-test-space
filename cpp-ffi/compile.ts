const compile = new Deno.Command("g++", {
	args: ["-std=c++11", "-fPIC", "-shared", "-o", "insertion_sort.so", "insertion_sort.cpp"],
});

await compile.output();
