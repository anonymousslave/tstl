/// <reference path="../../API.ts" />

/// <reference path="MapContainer.ts" />

namespace std.base
{
	export abstract class MultiMap<Key, T, Source extends MultiMap<Key, T, Source>>
		extends MapContainer<Key, T, MapIterator<Key, T>, Source>
	{
		/* ---------------------------------------------------------
			UTILITY
		--------------------------------------------------------- */
		public merge(source: Source): void
		{
			this.insert(source.begin(), source.end());
			source.clear();
		}
	}
}