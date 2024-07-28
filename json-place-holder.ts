import z from "zod";
import axios from "axios";
import { Try } from "./utils/functions/try.ts";

const todo_schema = z.object({
	userId: z.number(),
	id: z.number(),
	title: z.string(),
	completed: z.boolean(),
});

const result = await Try(() =>
	axios.get<unknown>("https://jsonplaceholder.typicode.com/todos")
		.then(({ data }) => todo_schema.array().parse(data))
);

if (result.failure) console.error(result.error);
else console.log(result.data);
