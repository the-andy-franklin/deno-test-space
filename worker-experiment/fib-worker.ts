/// <reference lib="webworker" />

import { WorkerDispatcher } from "./index.ts";

self.onmessage = () => {
	const sequence = WorkerDispatcher.fibonacci();
	self.postMessage(sequence);
	self.close();
};
