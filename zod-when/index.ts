// deno-lint-ignore-file no-explicit-any
import { z } from "npm:zod";
import type { ZodEffects, ZodRawShape, ZodSchema, ZodTypeAny } from "npm:zod";

declare module "npm:zod" {
	interface ZodObject<T extends ZodRawShape> {
		when<ThenSchema extends z.ZodObject<any>>(
			conditionField: keyof T,
			options: {
				is: ZodSchema;
				then: ThenSchema;
			},
		): ZodEffects<
			ZodTypeAny,
			{
				[P in (keyof T | keyof ThenSchema["_output"])]:
					| (P extends keyof T ? T[P]["_output"] : never)
					| (P extends keyof ThenSchema["_output"] ? ThenSchema["_output"][P] : never);
			}
		>;
	}
}

z.ZodObject.prototype.when = function <T extends ZodRawShape, ThenSchema extends z.ZodObject<any>>(
	conditionField: keyof T,
	{ is, then }: { is: ZodSchema; then: ThenSchema },
) {
	return this.refine((data) => {
		if (is.safeParse(data[conditionField]).success) {
			then.parse(data);
		}

		return true;
	});
};

const unknown_data: unknown = {
	game_mode: "first_to_goal",
	goal_amount: 10,
};

const gameSchema = z.object({
	game_mode: z.enum(["first_to_goal", "cooperative", "most_at_the_end", "daily_goal"]),
	goal_amount: z.string(),
}).when("game_mode", {
	is: z.literal("first_to_goal"),
	then: z.object({
		goal_amount: z.number(),
	}),
});

const game = gameSchema.parse(unknown_data);
type Game = z.infer<typeof gameSchema>;

console.log(game);
