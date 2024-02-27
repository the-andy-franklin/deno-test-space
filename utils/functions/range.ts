export const range = (start: number, end: number) => {
	return Array.from({ length: Math.abs(end - start) }, (_, i) => end >= start ? start + i : start - i);
};
