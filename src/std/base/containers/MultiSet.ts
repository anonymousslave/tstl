/// <reference path="../../API.ts" />

/// <reference path="SetContainer.ts" />

namespace std.base
{
	export abstract class MultiSet<T, Source extends MultiSet<T, Source>>
		extends SetContainer<T, SetIterator<T>, Source>
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