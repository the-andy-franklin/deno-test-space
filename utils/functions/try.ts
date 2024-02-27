type Success<T> = {
	success: true;
	value: T;
};

type Failure = {
	success: false;
	error: Error;
};

type Either<T> = Success<T> | Failure;

function createSuccess<T>(value: T): Success<T> {
	return { success: true, value };
}

function createFailure(error: unknown): Failure {
	if (error instanceof Error) return { success: false, error };
	return { success: false, error: new Error(JSON.stringify(error)) };
}

export function Try<T>(fn: () => T): Either<T> {
	try {
		return createSuccess(fn());
	} catch (error: unknown) {
		return createFailure(error);
	}
}

export function asyncTry<T>(fn: () => Promise<T>): Promise<Either<T>> {
	return fn()
		.then(createSuccess)
		.catch(createFailure);
}

// Example usage:

if (import.meta.main) {
	console.time("Try");

	const result = Try(() => "Hello, World!");

	if (result.success) console.log(result.value);
	else console.error(result.error);

	console.timeEnd("Try");
	// =================================================
	console.time("asyncTry");

	const asyncResult = await asyncTry(async () => {
		await new Promise((resolve) => setTimeout(resolve, 0));

		return "Hello, World!";
	});

	if (asyncResult.success) console.log(asyncResult.value);
	else console.error(asyncResult.error);

	console.timeEnd("asyncTry");
}
