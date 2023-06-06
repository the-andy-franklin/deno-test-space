export class WorkerDispatcher {
	private static number = 1000;

	dispatchFib() {
		const worker = new Worker(new URL("fib-worker.ts", import.meta.url).href, { type: "module" });
		worker.postMessage(null);

		worker.onmessage = (event) => {
			console.log(event.data);
		};

		worker.onerror = (error) => {
			console.error(error);
		};
	}

	dispatchPrimes() {
		const worker = new Worker(new URL("prime-worker.ts", import.meta.url).href, { type: "module" });
		worker.postMessage(null);

		worker.onmessage = (event) => {
			console.log(event.data);
		};

		worker.onerror = (error) => {
			console.error(error);
		};
	}

	static fibonacci(): number[] {
		const fib = [1, 1];

		for (let i = 2; fib.length < this.number; i++) {
			fib.push(fib[i - 1]! + fib[i - 2]!);
		}

		return fib;
	}

	private static isPrime(n: number): boolean {
		for (let i = 2; i <= Math.sqrt(n); i++) {
			if (n % i === 0) return false;
		}

		return true;
	}

	static primes(): number[] {
		const primes = [];

		for (let i = 2; primes.length < this.number; i++) {
			if (this.isPrime(i)) primes.push(i);
		}

		return primes;
	}
}

const workerDispatcher = new WorkerDispatcher();
workerDispatcher.dispatchFib();
workerDispatcher.dispatchPrimes();
