// deno-fmt-ignore-file
export type Success<T> = { success: true; failure: false; data: T; };
export type Failure = { success: false; failure: true; error: Error };

export function Success<T>(data: T): Success<T> {
	return { success: true, failure: false, data };
}

export function Failure(error: unknown): Failure {
	if (error instanceof Error) return { success: false, failure: true, error };
	return { success: false, failure: true, error: new Error(JSON.stringify(error)) };
}

export function Try<T>(fn: () => T): Extract<T, Promise<any>> extends never ? Failure | Success<T> : Promise<Failure | Success<Awaited<T>>>;
export function Try<T>(fn: () => T): Failure | Success<T> | Promise<Failure | Success<T>> {
	try {
		const result = fn();
		if (result instanceof Promise) return result.then(Success, Failure)

		return Success(result);
	} catch (error: unknown) {
		return Failure(error);
	}
}

// Example usage:
if (import.meta.main) {
	const { nextTick } = await import("node:process");
	const { range } = await import("./range.ts");

	const iterations = 100000;
	const start_try = performance.now();

	for (const i of range(iterations)) {
		Try(() => nextTick(() => {}));
	}

	const end_try = performance.now();

	const duration = end_try - start_try;
	console.log(`Duration: ${duration / iterations} ms`);
	// =================================================
	const start_async_try = performance.now();

	for (const i of range(iterations)) {
		await Try(() => new Promise<void>((resolve) => nextTick(resolve)));
	}

	const end_async_try = performance.now();

	const async_duration = end_async_try - start_async_try;
	console.log(`Async Duration: ${async_duration / iterations} ms`);
}
