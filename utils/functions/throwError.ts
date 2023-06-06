/**
 * this is useful because `throw` cannot be used where javascript
 * expects an expression but a function can be used in its place
 */
export function throwError(message: string): never {
	throw new Error(message);
}
