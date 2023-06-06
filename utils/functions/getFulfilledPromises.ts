export async function getFulfilledPromises<T extends Promise<unknown>[]>(promises: [...T]) {
	return (await Promise.allSettled(promises))
		.reduce((acc: Awaited<T[number]>[], promise) => {
			if (promise.status === "fulfilled") acc.push(promise.value);
			return acc;
		}, []);
}
