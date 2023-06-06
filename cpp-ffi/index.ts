const lib = Deno.dlopen("./insertion_sort.so", {
	"insertionSort": {
		parameters: ["buffer", "i32"],
		result: "void",
	},
});

declare global {
	interface Int32Array {
		insertionSort(): void;
	}
}

Int32Array.prototype.insertionSort = function () {
	lib.symbols.insertionSort(this, this.length);
};

const arr = new Int32Array(Array.from({ length: 10000 }, () => Math.floor(Math.random() * 10000)));
const arr2 = new Int32Array(arr);
console.time("c++");
arr.insertionSort();
console.timeEnd("c++");

console.time("js");
arr2.sort();
console.timeEnd("js");

console.log("Arr1 After sort:", arr);
console.log("Arr2 After sort:", arr2);

lib.close();
