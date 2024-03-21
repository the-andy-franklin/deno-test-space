// deno-lint-ignore-file no-explicit-any
import { ZodLiteral } from "npm:zod";
import { ZodObject } from "npm:zod";
import { ZodEnum } from "npm:zod";
import { Primitive } from "npm:zod";
import { z } from "npm:zod";
import type { ZodEffects, ZodRawShape, ZodTypeAny } from "npm:zod";

declare module "npm:zod" {
	interface ZodObject<T extends ZodRawShape> {
		when<IsSchema extends (ZodLiteral<Primitive> | ZodEnum<[string, ...string[]]>), ThenSchema extends ZodObject<any>>(
			conditionField: keyof T,
			options: {
				is: IsSchema;
				then: ThenSchema;
			},
		): ZodEffects<
			ZodTypeAny,
			| this["_output"]
			| (
				& {
					[K in keyof ThenSchema["_output"]]: ThenSchema["_output"][K];
				}
				& {
					[P in "conditionField"]: IsSchema["_output"];
				}
			)
		>;
	}
}

ZodObject.prototype.when = function <
	T extends ZodRawShape,
	IsSchema extends (ZodLiteral<Primitive> | ZodEnum<[string, ...string[]]>),
	ThenSchema extends ZodObject<any>,
>(
	conditionField: keyof T,
	{ is, then }: { is: IsSchema; then: ThenSchema },
) {
	let newShape;

	return z.preprocess((data: any) => {
		if (is.safeParse(data[conditionField]).success) {
			newShape = Object.assign(
				{},
				this.shape,
				z.object({ [conditionField]: is }).shape,
				then.shape,
			);
		}

		return data;
	}, newShape!);
};

const unknown_data: unknown = {
	game_mode: "first_to_goal",
	goal_amount: "10",
};

const gameSchema = z.object({
	game_mode: z.enum(["cooperative", "most_at_the_end", "daily_goal"]),
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
