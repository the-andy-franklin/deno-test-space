import { z } from "npm:zod";
import type { Primitive, ZodEffects, ZodRawShape, ZodSchema, ZodTypeAny } from "npm:zod";

declare module "npm:zod" {
	interface ZodObject<T extends ZodRawShape> {
		when<ThenSchema extends z.ZodObject<any>>(
			conditionField: keyof T,
			options: {
				is: ZodSchema | Primitive;
				then: ThenSchema;
			},
		): ZodEffects<
			ZodTypeAny,
			{
				[P in (keyof T | keyof ThenSchema["_output"])]:
					| (P extends keyof ThenSchema["_output"] ? ThenSchema["_output"][P] : never)
					| (P extends keyof T ? T[P]["_output"] : never);
			}
		>;
	}
}

z.ZodObject.prototype.when = function <T extends ZodRawShape, ThenSchema extends z.ZodObject<any>>(
	conditionField: keyof T,
	{ is, then }: { is: ZodSchema | Primitive; then: ThenSchema },
) {
	return this.refine((data) => {
		const isZodType = is instanceof z.ZodSchema;

		if (isZodType) {
			if (is.safeParse(data).success) {
				then.parse(data);
			}
			return true;
		} else {
			if (data[conditionField] === is) {
				then.parse(data);
			}
			return true;
		}
	}, { message: "Conditional validation failed" });
};

const unknown_data: unknown = {
	game_mode: "first_to_goal",
	goal_amount: 10,
};

const gameSchema = z.object({
	game_mode: z.enum(["first_to_goal", "cooperative", "most_at_the_end", "daily_goal"]),
	goal_amount: z.string(),
}).when("game_mode", {
	is: "first_to_goal",
	then: z.object({
		goal_amount: z.number(),
	}),
});

const game = gameSchema.parse(unknown_data);
type Game = z.infer<typeof gameSchema>;

console.log(game);
