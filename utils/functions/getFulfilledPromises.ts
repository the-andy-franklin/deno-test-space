export async function getFulfilledPromises<T extends Promise<unknown>[]>(promises: [...T]) {
	return (await Promise.allSettled(promises))
		.filter((promise): promise is PromiseFulfilledResult<Awaited<T[number]>> => promise.status === "fulfilled")
		.map((promise) => promise.value);
}
