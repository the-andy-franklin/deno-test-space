export function range(end: number): number[];
export function range(start: number, end: number): number[];
export function range(start: number, end?: number): number[] {
	if (end === undefined) end = start, start = 0;

	return Array.from(
		{ length: Math.abs(end - start) },
		end > start ? (_, i) => start + i : (_, i) => start - i,
	);
}
