import "npm:@total-typescript/ts-reset";
import z from "npm:zod";

const schema = z.object({
	userId: z.number(),
	id: z.number(),
	title: z.string(),
	completed: z.boolean(),
});

const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
const data = await response.json();

const parsed = schema.safeParse(data);
if (parsed.success) console.log(parsed.data);
else console.error(parsed.error);
