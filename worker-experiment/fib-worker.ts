/// <reference lib="webworker" />

import { WorkerDispatcher } from "./index.ts";

self.onmessage = () => {
	const fib = WorkerDispatcher.fibonacci();
	self.postMessage(fib);
	self.close();
};
