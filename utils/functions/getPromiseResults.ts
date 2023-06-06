// deno-fmt-ignore-file
import { Success, Failure } from "./try.ts";

export async function getPromiseResults<T extends Promise<unknown>[]>(promises: [...T]) {
	return (await Promise.allSettled(promises)).map((promise) => {
		if (promise.status === "fulfilled") return Success(promise.value);
		return Failure(promise.reason);
	}) as { [K in keyof T]: Failure | Success<Awaited<T[K]>> };
}

if (import.meta.main) {
	const { delay } = await import("./delay.ts");

	const [a, b, c, d] = await getPromiseResults([
		delay(1000).then(() => "one"),
		delay(1000).then(() => { throw 2; }),
		Promise.resolve(3),
		Promise.reject("four"),
	]);

	console.log([a, b, c, d]);
}
