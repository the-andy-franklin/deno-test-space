export async function getPromiseResults<T extends Promise<unknown>[]>(promises: [...T]) {
	return (await Promise.allSettled(promises))
		.map((promise) => {
			if (promise.status === "fulfilled") return promise.value;
		}) as { [K in keyof T]: Awaited<T[K]> | undefined };
}
