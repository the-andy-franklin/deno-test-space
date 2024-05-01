// deno-lint-ignore-file no-explicit-any
import { assertEquals } from "https://deno.land/std@0.221.0/assert/mod.ts";

const willThrowDuplicateError = (methodName: string) => () => {
	throw new Error(`Duplicate ${methodName}`);
};

const generateGroupByRecursively = (
	_groupBy: ((arg: any) => any)[],
	_havingGroups: ((arg: any) => boolean)[][],
) => function groupByRecursively(
	items: any[],
	index: number = 0,
): any[] {
	if (index >= _groupBy.length) return items;

	const groupMap: Map<any, any[]> = new Map();
	items.forEach((item) => {
		const key = _groupBy[index]?.(item);
		if (!groupMap.has(key)) groupMap.set(key, []);
		groupMap.get(key)!.push(item);
	});

	const grouped = [...groupMap.entries()]
		.map(([key, value]) => [key, groupByRecursively(value, index + 1)]);

	if (!_havingGroups.length) return grouped;
	return grouped.filter((item) => _havingGroups.every((havingGroup) => havingGroup.some((having) => having(item))));
};

function joinCollections(collections: any[][]) {
	const _collections: any[] = [];

	for (let i = 0; i < collections.length - 1; i++) {
		const collection = collections[i];
		if (!collection) continue;

		const remaining_items = collections.slice(i + 1).flat();
		if (!remaining_items.length) break;

		for (const item of collection) {
			for (const remaining_item of remaining_items) {
				_collections.push([item, remaining_item]);
			}
		}
	}

	return _collections;
}

export function query() {
	const _collections: any[] = [];

	let _select: ((arg: any) => any) | null = null;
	let _sort: ((arg1: any, arg2: any) => number) | null = null;
	const _havingGroups: ((arg: any) => boolean)[][] = [];
	const _whereGroups: ((arg: any) => boolean)[][] = [];
	const _groupBy: ((arg: any) => any)[] = [];

	const return_obj = {
		select: (selectFunction?: (arg: any) => any) => {
			_select = selectFunction ?? null;

			return_obj.select = willThrowDuplicateError("SELECT");
			return return_obj;
		},

		from: (...collections: any[][]) => {
			if (collections.length === 1) _collections.push(...collections.flat());
			if (collections.length >= 2) _collections.push(...joinCollections(collections));

			return_obj.from = willThrowDuplicateError("FROM");
			return return_obj;
		},

		where: (...whereFunctions: ((arg: any) => boolean)[]) => {
			_whereGroups.push(whereFunctions);
			return return_obj;
		},

		orderBy: (sortFunction: (arg1: any, arg2: any) => number) => {
			_sort = sortFunction;

			return_obj.orderBy = willThrowDuplicateError("ORDERBY");
			return return_obj;
		},

		groupBy: (...groupFunctions: ((arg: any) => any)[]) => {
			_groupBy.push(...groupFunctions);

			return_obj.groupBy = willThrowDuplicateError("GROUPBY");
			return return_obj;
		},

		having: (...havingFunctions: ((arg: any) => boolean)[]) => {
			_havingGroups.push(havingFunctions);
			return return_obj;
		},

		execute: () => {
			let result = _collections;

			_whereGroups.forEach((conditions) => {
				result = result.filter((item) => conditions.some((condition) => condition(item)));
			});

			if (_groupBy.length > 0) result = generateGroupByRecursively(_groupBy, _havingGroups)(result);
			if (_sort !== null) result.sort(_sort);
			if (_select !== null) result = result.map(_select);

			return result;
		},
	};

	return return_obj;
}

Deno.test("Basic SELECT tests", () => {
	const numbers = [1, 2, 3];
	assertEquals(
		query().select().from(numbers).execute(),
		numbers,
	);

	assertEquals(
		query().select().execute(),
		[],
	);

	assertEquals(
		query().from(numbers).execute(),
		numbers,
	);

	assertEquals(
		query().execute(),
		[],
	);

	assertEquals(
		query().from(numbers).select().execute(),
		numbers,
	);
});

Deno.test("Basic SELECT and WHERE over objects", () => {
	const persons = [{
		name: "Peter",
		profession: "teacher",
		age: 20,
		maritalStatus: "married",
	}, {
		name: "Michael",
		profession: "teacher",
		age: 50,
		maritalStatus: "single",
	}, {
		name: "Peter",
		profession: "teacher",
		age: 20,
		maritalStatus: "married",
	}, {
		name: "Anna",
		profession: "scientific",
		age: 20,
		maritalStatus: "married",
	}, {
		name: "Rose",
		profession: "scientific",
		age: 50,
		maritalStatus: "married",
	}, {
		name: "Anna",
		profession: "scientific",
		age: 20,
		maritalStatus: "single",
	}, {
		name: "Anna",
		profession: "politician",
		age: 50,
		maritalStatus: "married",
	}];

	assertEquals(
		query().select().from(persons).execute(),
		persons,
	);

	function profession(person: any) {
		return person.profession;
	}

	// SELECT profession FROM persons
	assertEquals(
		query().select(profession).from(persons).execute(),
		["teacher", "teacher", "teacher", "scientific", "scientific", "scientific", "politician"],
	);

	assertEquals(
		query().select(profession).execute(),
		[],
	);

	function isTeacher(person: any) {
		return person.profession === "teacher";
	}

	// SELECT profession FROM persons WHERE profession="teacher"
	assertEquals(
		query().select(profession).from(persons).where(isTeacher).execute(),
		["teacher", "teacher", "teacher"],
	);

	// SELECT * FROM persons WHERE profession="teacher"
	assertEquals(
		query().from(persons).where(isTeacher).execute(),
		persons.slice(0, 3),
	);

	function name(person: any) {
		return person.name;
	}

	// SELECT name FROM persons WHERE profession="teacher"
	assertEquals(
		query().select(name).from(persons).where(isTeacher).execute(),
		["Peter", "Michael", "Peter"],
	);

	assertEquals(
		query().where(isTeacher).from(persons).select(name).execute(),
		["Peter", "Michael", "Peter"],
	);
});

Deno.test("GROUP BY tests", () => {
	const persons = [{
		name: "Peter",
		profession: "teacher",
		age: 20,
		maritalStatus: "married",
	}, {
		name: "Michael",
		profession: "teacher",
		age: 50,
		maritalStatus: "single",
	}, {
		name: "Peter",
		profession: "teacher",
		age: 20,
		maritalStatus: "married",
	}, {
		name: "Anna",
		profession: "scientific",
		age: 20,
		maritalStatus: "married",
	}, {
		name: "Rose",
		profession: "scientific",
		age: 50,
		maritalStatus: "married",
	}, {
		name: "Anna",
		profession: "scientific",
		age: 20,
		maritalStatus: "single",
	}, {
		name: "Anna",
		profession: "politician",
		age: 50,
		maritalStatus: "married",
	}];

	function profession(person: any) {
		return person.profession;
	}

	// SELECT * FROM persons GROUPBY profession <- Bad in SQL but possible in JavaScript
	assertEquals(
		query().select().from(persons).groupBy(profession).execute(),
		[
			["teacher", [{
				"name": "Peter",
				"profession": "teacher",
				"age": 20,
				"maritalStatus": "married",
			}, {
				"name": "Michael",
				"profession": "teacher",
				"age": 50,
				"maritalStatus": "single",
			}, {
				"name": "Peter",
				"profession": "teacher",
				"age": 20,
				"maritalStatus": "married",
			}]],
			["scientific", [{
				"name": "Anna",
				"profession": "scientific",
				"age": 20,
				"maritalStatus": "married",
			}, {
				"name": "Rose",
				"profession": "scientific",
				"age": 50,
				"maritalStatus": "married",
			}, {
				"name": "Anna",
				"profession": "scientific",
				"age": 20,
				"maritalStatus": "single",
			}]],
			["politician", [{
				"name": "Anna",
				"profession": "politician",
				"age": 50,
				"maritalStatus": "married",
			}]],
		],
	);

	function isTeacher(person: any) {
		return person.profession === "teacher";
	}

	// SELECT * FROM persons WHERE profession='teacher' GROUPBY profession
	assertEquals(
		query().select().from(persons).where(isTeacher).groupBy(profession).execute(),
		[
			["teacher", [{
				"name": "Peter",
				"profession": "teacher",
				"age": 20,
				"maritalStatus": "married",
			}, {
				"name": "Michael",
				"profession": "teacher",
				"age": 50,
				"maritalStatus": "single",
			}, {
				"name": "Peter",
				"profession": "teacher",
				"age": 20,
				"maritalStatus": "married",
			}]],
		],
	);

	function professionGroup(group: any) {
		return group[0];
	}

	// SELECT profession FROM persons GROUPBY profession
	assertEquals(
		query().select(professionGroup).from(persons).groupBy(profession).execute(),
		["teacher", "scientific", "politician"],
	);

	function name(person: any) {
		return person.name;
	}

	// SELECT * FROM persons WHERE profession='teacher' GROUPBY profession, name
	assertEquals(
		query().select().from(persons).groupBy(profession, name).execute(),
		[
			["teacher", [
				["Peter", [{
					"name": "Peter",
					"profession": "teacher",
					"age": 20,
					"maritalStatus": "married",
				}, {
					"name": "Peter",
					"profession": "teacher",
					"age": 20,
					"maritalStatus": "married",
				}]],
				["Michael", [{
					"name": "Michael",
					"profession": "teacher",
					"age": 50,
					"maritalStatus": "single",
				}]],
			]],
			["scientific", [
				["Anna", [{
					"name": "Anna",
					"profession": "scientific",
					"age": 20,
					"maritalStatus": "married",
				}, {
					"name": "Anna",
					"profession": "scientific",
					"age": 20,
					"maritalStatus": "single",
				}]],
				["Rose", [{
					"name": "Rose",
					"profession": "scientific",
					"age": 50,
					"maritalStatus": "married",
				}]],
			]],
			["politician", [
				["Anna", [{
					"name": "Anna",
					"profession": "politician",
					"age": 50,
					"maritalStatus": "married",
				}]],
			]],
		],
	);

	function age(person: any) {
		return person.age;
	}

	function maritalStatus(person: any) {
		return person.maritalStatus;
	}

	// SELECT * FROM persons WHERE profession='teacher' GROUPBY profession, name, age
	assertEquals(
		query().select().from(persons).groupBy(profession, name, age, maritalStatus).execute(),
		[
			["teacher", [
				["Peter", [
					[20, [
						["married", [{
							"name": "Peter",
							"profession": "teacher",
							"age": 20,
							"maritalStatus": "married",
						}, {
							"name": "Peter",
							"profession": "teacher",
							"age": 20,
							"maritalStatus": "married",
						}]],
					]],
				]],
				["Michael", [
					[50, [
						["single", [{
							"name": "Michael",
							"profession": "teacher",
							"age": 50,
							"maritalStatus": "single",
						}]],
					]],
				]],
			]],
			["scientific", [
				["Anna", [
					[20, [
						["married", [{
							"name": "Anna",
							"profession": "scientific",
							"age": 20,
							"maritalStatus": "married",
						}]],
						["single", [{
							"name": "Anna",
							"profession": "scientific",
							"age": 20,
							"maritalStatus": "single",
						}]],
					]],
				]],
				["Rose", [
					[50, [
						["married", [{
							"name": "Rose",
							"profession": "scientific",
							"age": 50,
							"maritalStatus": "married",
						}]],
					]],
				]],
			]],
			["politician", [
				["Anna", [
					[50, [
						["married", [{
							"name": "Anna",
							"profession": "politician",
							"age": 50,
							"maritalStatus": "married",
						}]],
					]],
				]],
			]],
		],
	);

	function professionCount(group: any) {
		return [group[0], group[1].length];
	}

	// SELECT profession, count(profession) FROM persons GROUPBY profession
	assertEquals(
		query().select(professionCount).from(persons).groupBy(profession).execute(),
		[
			["teacher", 3],
			["scientific", 3],
			["politician", 1],
		],
	);

	function naturalCompare(value1: any, value2: any) {
		if (value1 < value2) return -1;
		if (value1 > value2) return 1;
		return 0;
	}

	// SELECT profession, count(profession) FROM persons GROUPBY profession ORDER BY profession
	assertEquals(
		query().select(professionCount).from(persons).groupBy(profession).orderBy(naturalCompare).execute(),
		[
			["politician", 1],
			["scientific", 3],
			["teacher", 3],
		],
	);
});

Deno.test("Number tests", () => {
	function isEven(number: number) {
		return number % 2 === 0;
	}

	function parity(number: number) {
		return isEven(number) ? "even" : "odd";
	}

	function isPrime(number: number) {
		if (number < 2) return false;
		let divisor = 2;
		for (; number % divisor !== 0; divisor++);
		return divisor === number;
	}

	function prime(number: number) {
		return isPrime(number) ? "prime" : "divisible";
	}

	const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

	// SELECT * FROM numbers
	assertEquals(
		query().select().from(numbers).execute(),
		numbers,
	);

	// SELECT * FROM numbers GROUP BY parity
	assertEquals(
		query().select().from(numbers).groupBy(parity).execute(),
		[
			["odd", [1, 3, 5, 7, 9]],
			["even", [2, 4, 6, 8]],
		],
	);

	// SELECT * FROM numbers GROUP BY parity, isPrime
	assertEquals(
		query().select().from(numbers).groupBy(parity, prime).execute(),
		[
			["odd", [
				["divisible", [1, 9]],
				["prime", [3, 5, 7]],
			]],
			["even", [
				["prime", [2]],
				["divisible", [4, 6, 8]],
			]],
		],
	);

	function odd(group: any) {
		return group[0] === "odd";
	}

	// SELECT * FROM numbers GROUP BY parity HAVING
	assertEquals(
		query().select().from(numbers).groupBy(parity).having(odd).execute(),
		[
			["odd", [1, 3, 5, 7, 9]],
		],
	);

	function descendentCompare(number1: number, number2: number) {
		return number2 - number1;
	}

	// SELECT * FROM numbers ORDER BY value DESC
	assertEquals(
		query().select().from(numbers).orderBy(descendentCompare).execute(),
		[9, 8, 7, 6, 5, 4, 3, 2, 1],
	);

	function lessThan3(number: number) {
		return number < 3;
	}

	function greaterThan4(number: number) {
		return number > 4;
	}

	// SELECT * FROM number WHERE number < 3 OR number > 4
	assertEquals(
		query().select().from(numbers).where(lessThan3, greaterThan4).execute(),
		[1, 2, 5, 6, 7, 8, 9],
	);
});

Deno.test("Frequency tests", () => {
	const persons = [
		["Peter", 3],
		["Anna", 4],
		["Peter", 7],
		["Michael", 10],
	];

	function nameGrouping(person: any) {
		return person[0];
	}

	function sumValues(value: any) {
		return [
			value[0],
			value[1].reduce(function (result: any, person: any) {
				return result + person[1];
			}, 0),
		];
	}

	function naturalCompare(value1: any, value2: any) {
		if (value1 < value2) return -1;
		if (value1 > value2) return 1;
		return 0;
	}

	// SELECT name, sum(value) FROM persons ORDER BY naturalCompare GROUP BY nameGrouping
	assertEquals(
		query().select(sumValues).from(persons).orderBy(naturalCompare).groupBy(nameGrouping).execute(),
		[
			["Anna", 4],
			["Michael", 10],
			["Peter", 10],
		],
	);

	const numbers = [1, 2, 1, 3, 5, 6, 1, 2, 5, 6];

	function id(value: any) {
		return value;
	}

	function frequency(group: any) {
		return {
			value: group[0],
			frequency: group[1].length,
		};
	}

	// SELECT number, count(number) FROM numbers GROUP BY number
	assertEquals(
		query().select(frequency).from(numbers).groupBy(id).execute(),
		[
			{ "value": 1, "frequency": 3 },
			{ "value": 2, "frequency": 2 },
			{ "value": 3, "frequency": 1 },
			{ "value": 5, "frequency": 2 },
			{ "value": 6, "frequency": 2 },
		],
	);

	function greatThan1(group: any) {
		return group[1].length > 1;
	}

	function isPair(group: any) {
		return group[0] % 2 === 0;
	}

	// SELECT number, count(number) FROM numbers GROUP BY number HAVING count(number) > 1 AND isPair(number)
	assertEquals(
		query().select(frequency).from(numbers).groupBy(id).having(greatThan1).having(isPair).execute(),
		[{
			"value": 2,
			"frequency": 2,
		}, {
			"value": 6,
			"frequency": 2,
		}],
	);
});

Deno.test("Join tests", () => {
	const teachers = [{
		teacherId: "1",
		teacherName: "Peter",
	}, {
		teacherId: "2",
		teacherName: "Anna",
	}];

	const students = [{
		studentName: "Michael",
		tutor: "1",
	}, {
		studentName: "Rose",
		tutor: "2",
	}];

	function teacherJoin(join: any) {
		return join[0].teacherId === join[1].tutor;
	}

	function student(join: any) {
		return {
			studentName: join[1].studentName,
			teacherName: join[0].teacherName,
		};
	}

	// SELECT studentName, teacherName FROM teachers, students WHERE teachers.teacherId = students.tutor
	assertEquals(
		query().select(student).from(teachers, students).where(teacherJoin).execute(),
		[{
			"studentName": "Michael",
			"teacherName": "Peter",
		}, {
			"studentName": "Rose",
			"teacherName": "Anna",
		}],
	);

	const numbers1 = [1, 2];
	const numbers2 = [4, 5];

	assertEquals(
		query().select().from(numbers1, numbers2).execute(),
		[
			[1, 4],
			[1, 5],
			[2, 4],
			[2, 5],
		],
	);

	function tutor1(join: any) {
		return join[1].tutor === "1";
	}

	// SELECT studentName, teacherName FROM teachers, students WHERE teachers.teacherId = students.tutor AND tutor = 1
	assertEquals(
		query().select(student).from(teachers, students).where(teacherJoin).where(tutor1).execute(),
		[{
			"studentName": "Michael",
			"teacherName": "Peter",
		}],
	);

	assertEquals(
		query().where(teacherJoin).select(student).where(tutor1).from(teachers, students).execute(),
		[{
			"studentName": "Michael",
			"teacherName": "Peter",
		}],
	);
});

Deno.test("Duplication exception tests", () => {
	function checkError(fn: (...args: any[]) => any, duplicate: any) {
		try {
			fn();
		} catch (e) {
			assertEquals(
				e instanceof Error,
				true,
			);

			assertEquals(
				e.message,
				"Duplicate " + duplicate,
			);
		}
	}

	function id(value: any) {
		return value;
	}

	checkError(() => query().select().select().execute(), "SELECT");
	checkError(() => query().select().from([]).select().execute(), "SELECT");
	checkError(() => query().select().from([]).from([]).execute(), "FROM");
	checkError(() => query().select().from([]).orderBy(id).orderBy(id).execute(), "ORDERBY");
	checkError(() => query().select().groupBy(id).from([]).groupBy(id).execute(), "GROUPBY");
});
