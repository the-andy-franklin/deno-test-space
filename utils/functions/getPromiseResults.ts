// deno-fmt-ignore-file
export async function getPromiseResults<T extends Promise<unknown>[]>(promises: [...T]) {
	return (await Promise.allSettled(promises)).map((promise) => {
		if (promise.status === "fulfilled") return promise.value;
		return null;
	}) as { [K in keyof T]: Awaited<T[K]> | null };
}

if (import.meta.main) {
	const { delay } = await import("./delay.ts");

	const results = await getPromiseResults([
		delay(1000).then(() => "one"),
		delay(1000).then(() => { throw 2; }),
		Promise.resolve(3),
		Promise.reject("four"),
	]);

	console.log(results);
}
