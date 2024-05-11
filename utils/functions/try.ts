// deno-fmt-ignore-file
/// <reference types="npm:@types/node" />
import { nextTick } from "node:process";
import { range } from "./range.ts";

type Success<T> = { success: true; failure: false; data: T; };
type Failure = { success: false; failure: true; error: Error; };
type Either<F extends Failure, S extends Success<any>> = F | S;

function createSuccess<T>(data: T): Success<T> {
	return { success: true, failure: false, data };
}

function createFailure(error: unknown): Failure {
	if (error instanceof Error) return { success: false, failure: true, error };
	return { success: false, failure: true, error: new Error(JSON.stringify(error)) };
}

export function Try<T>(fn: () => Promise<T>): Promise<Either<Failure, Success<T>>>;
export function Try<T>(fn: () => T): Either<Failure, Success<T>>;
export function Try<T>(fn: (() => T) | (() => Promise<T>)): Either<Failure, Success<T>> | Promise<Either<Failure, Success<T>>> {
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

	const start_try = performance.now();

	for (const i of range(iterations)) {
		Try(() => nextTick(() => {}));
	}

	const end_try = performance.now();

	const duration = end_try - start_try;
	console.log(`Duration: ${duration / iterations} ms`);
	// // =================================================
	const start_async_try = performance.now();

	for (const i of range(iterations)) {
		await Try(() => Promise.resolve(nextTick(() => {})));
	}

	const end_async_try = performance.now();

	const async_duration = end_async_try - start_async_try;
	console.log(`Async Duration: ${async_duration / iterations} ms`);
}
