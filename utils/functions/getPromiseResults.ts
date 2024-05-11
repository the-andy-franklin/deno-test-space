// deno-fmt-ignore-file
export async function getPromiseResults<T extends Promise<unknown>[]>(promises: [...T]) {
	return (await Promise.allSettled(promises))
		.map((promise) => {
			if (promise.status === "fulfilled") return promise.value;
			if (promise.reason instanceof Error) return promise.reason;
			return new Error(JSON.stringify(promise.reason, (key, value) => {
				if (value === Infinity) return "Infinity";
				return value;
			}));
		});
}

if (import.meta.main) {
	const { delay } = await import("./delay.ts");

	const promises = [
		delay(1000).then(() => "one"),
		delay(1000).then(() => { throw 2; }),
		Promise.resolve(3),
		Promise.reject("four"),
	];

	const results = await getPromiseResults(promises);

	console.log(results);
}
