import { delay } from "./delay.ts";

type Success<T> = {
	success: true;
	failure: false;
	data: T;
};

type Failure = {
	success: false;
	failure: true;
	error: Error;
};

type Either<T> = Success<T> | Failure;

function createSuccess<T>(data: T): Success<T> {
	return { success: true, failure: false, data };
}

function createFailure(error: unknown): Failure {
	if (error instanceof Error) return { success: false, failure: true, error };
	return { success: false, failure: true, error: new Error(JSON.stringify(error)) };
}

export function Try<T>(fn: () => Promise<T>): Promise<Either<T>>;
export function Try<T>(fn: () => T): Either<T>;
export function Try<T>(fn: (() => T) | (() => Promise<T>)): Either<T> | Promise<Either<T>> {
	try {
		const result = fn();
		if (result instanceof Promise) {
			return result
				.then(createSuccess)
				.catch(createFailure);
		}

		return createSuccess(result);
	} catch (error: unknown) {
		return createFailure(error);
	}
}

// Example usage:
if (import.meta.main) {
	const iterations = 10000;
	const iteration_keys = Array(iterations).keys();

	const start_try = performance.now();

	for (const i of iteration_keys) {
		Try(() => "Hello, World!");
	}

	const end_try = performance.now();

	const durationInMilliseconds = end_try - start_try;
	const durationInMicroseconds = durationInMilliseconds * 1e3;
	console.log(`Duration: ${durationInMicroseconds / iterations} microseconds`);
	// =================================================
	const start_async_try = performance.now();

	for (const i of iteration_keys) {
		await Try(async () => {
			await delay(0);

			"Hello, World!";
		});
	}

	const end_async_try = performance.now();

	const asyncDurationInMilliseconds = end_async_try - start_async_try;
	const asyncDurationInMicroseconds = asyncDurationInMilliseconds * 1e3;
	console.log(`Async Duration: ${asyncDurationInMicroseconds / iterations} microseconds`);
}
