// deno-lint-ignore-file no-explicit-any
import { ZodLiteral } from "npm:zod";
import { ZodObject } from "npm:zod";
import { Primitive } from "npm:zod";
import { z } from "npm:zod";
import type { ZodEffects, ZodRawShape, ZodTypeAny } from "npm:zod";

declare module "npm:zod" {
	interface ZodObject<T extends z.ZodRawShape> {
		when<
			ConditionField extends keyof T,
			IsSchema extends z.ZodLiteral<Primitive>,
			ThenSchema extends z.ZodObject<any>,
		>(
			conditionField: ConditionField,
			options: {
				is: IsSchema;
				then: ThenSchema;
			},
		): ZodObject<
			| this["shape"]
			| (
				& ThenSchema["shape"]
				& Record<ConditionField, IsSchema>
			)
		>;
	}
}

z.ZodObject.prototype.when = function (conditionField, { is, then }) {
	let newShape = z.object(this.shape);

	z.custom<ZodObject<any, any, any, any, any>>((data: any) => {
		if (is.safeParse(data[conditionField]).success) {
			newShape = z.object({
				...this.shape,
				...then.shape,
				[conditionField]: is,
			});
		}

		return true;
	});

	return newShape as any;
};

const unknown_data: unknown = {
	game_mode: "something_else",
	goal_amount: false,
};

const gameSchema = z.object({
	game_mode: z.enum(["cooperative", "most_at_the_end", "daily_goal"]),
	goal_amount: z.string(),
}).when("game_mode", {
	is: z.literal("first_to_goal"),
	then: z.object({
		goal_amount: z.number(),
	}),
}).when("game_mode", {
	is: z.literal("something_else"),
	then: z.object({
		goal_amount: z.boolean(),
	}),
});

const game = gameSchema.parse(unknown_data);
type Game = z.infer<typeof gameSchema>;

console.log(game);
