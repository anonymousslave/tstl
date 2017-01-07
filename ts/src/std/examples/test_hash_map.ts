﻿/// <reference path="../API.ts" />

namespace std.examples
{
	export function test_hash_map(): void
	{
		let map: std.HashMap<string, number> = new std.HashMap<string, number>();
		map.insert(["first", 1]);
		map.insert(["second", 2]);

		for (let it = map.begin(); !it.equals(map.end()); it = it.next())
			console.log(it.first, it.second);
	}
}