export const range = (start: number, end: number) =>
	Array.from({ length: Math.abs(end - start) }, (_, i) => end > start ? start + i : start - i);
