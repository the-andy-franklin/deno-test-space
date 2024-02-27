const input = 100000000;
const obj: { [key: number]: true } = {};
for (let i = 0; i < input; i++) {
	obj[i] = true;
}

const start = performance.now();

const answer = (() => {
	for (let i = 1; true; i++) {
		if (obj[i]) continue;
		return i;
	}
})();

const end = performance.now();

console.log(answer);
console.log(`${end - start}ms`);
