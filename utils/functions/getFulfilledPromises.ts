/**
 * @param `...promises` any number of promises as arguments
 * @returns an array of the values of the fulfilled promises
 * @warning do not destructure the response of this function, because if a promise is rejected, it will not be included in the response
 */
export async function getFulfilledPromises<T extends Promise<unknown>[]>(promises: [...T]) {
	return (await Promise.allSettled(promises))
		.filter((promise): promise is PromiseFulfilledResult<Awaited<T[number]>> => promise.status === "fulfilled")
		.map((promise) => promise.value);
}
