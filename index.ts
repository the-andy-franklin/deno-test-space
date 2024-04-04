const thing = {
	a: Infinity,
	b: null,
	c: undefined,
};

const json = JSON.stringify(thing, (key, value) => {
	if (value === Infinity) return "Infinity";
	return value;
});

console.log(json);
