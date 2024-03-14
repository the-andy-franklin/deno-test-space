/// <reference lib="webworker" />

import { WorkerDispatcher } from "./index.ts";

self.onmessage = () => {
	const sequence = WorkerDispatcher.primes();
	self.postMessage(sequence);
	self.close();
};
