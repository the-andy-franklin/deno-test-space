const input = 100000;

const arr_start = performance.now();

const arr = Array.from({ length: input }, (_, i) => i);

const arr_answer = (() => {
	for (let i = 1; true; i++) {
		if (arr.includes(i)) continue;
		return i;
	}
})();

const arr_end = performance.now();

console.log(arr_answer);
console.log(`arr solution: ${arr_end - arr_start}ms`);

const obj_start = performance.now();

const obj: { [key: number]: true } = {};
for (let i = 0; i < input; i++) {
	obj[i] = true;
}

const obj_answer = (() => {
	for (let i = 1; true; i++) {
		if (obj[i]) continue;
		return i;
	}
})();

const obj_end = performance.now();

console.log(obj_answer);
console.log(`obj solution: ${obj_end - obj_start}ms`);
