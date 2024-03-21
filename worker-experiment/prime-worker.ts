/// <reference lib="webworker" />

import { WorkerDispatcher } from "./index.ts";

self.onmessage = () => {
	const primes = WorkerDispatcher.primes();
	self.postMessage(primes);
	self.close();
};
