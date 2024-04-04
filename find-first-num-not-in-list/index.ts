const input = Array.from({ length: 200000 }, (_, i) => i);

const arr_start = performance.now();

const arr_answer = (() => {
	for (let i = 1; true; i++) {
		if (!input.includes(i)) return i;
	}
})();

const arr_end = performance.now();

console.log(arr_answer);
console.log(`arr solution: ${(arr_end - arr_start) / 1000.000}s`);

const obj_start = performance.now();

const obj: { [key: number]: true } = {};
for (let i = 0; i < input.length; i++) {
	obj[i] = true;
}

const obj_answer = (() => {
	for (let i = 1; true; i++) {
		if (!obj[i]) return i;
	}
})();

const obj_end = performance.now();

console.log(obj_answer);
console.log(`obj solution: ${(obj_end - obj_start) / 1000.000}s`);
