import z from "zod";
import axios from "axios";
import { Try } from "./utils/functions/try.ts";

const schema = z.object({
	userId: z.number(),
	id: z.number(),
	title: z.string(),
	completed: z.boolean(),
}).strict();

const result = await Try(() =>
	axios.get<unknown>("https://jsonplaceholder.typicode.com/todos")
		.then(({ data }) => schema.array().parse(data))
);

if (result.failure) console.error(result.error);
else console.log(result.data);
