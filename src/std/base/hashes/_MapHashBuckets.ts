/// <reference path="../../API.ts" />

/// <reference path="_HashBuckets.ts" />

namespace std.base
{
	/**
	 * @hidden
	 */
	export class _MapHashBuckets<Key, T>
		extends _HashBuckets<MapIterator<Key, T>>
	{
		private end_: MapIterator<Key, T>;

		private hash_function_: (key: Key) => number;
		private key_eq_: (x: Key, y: Key) => boolean;

		/* ---------------------------------------------------------
			CONSTRUCTORS & ACCESSORS
		--------------------------------------------------------- */
        public constructor(end: MapIterator<Key, T>, hash: (key: Key) => number, pred: (x: Key, y: Key) => boolean)
		{
			super();

			this.end_ = end;
			this.hash_function_ = hash;
			this.key_eq_ = pred;
		}

		public hash_function(): (key: Key) => number
		{
			return this.hash_function_;
		}
		public key_eq(): (x: Key, y: Key) => boolean
		{
			return this.key_eq_;
		}
		
		/* ---------------------------------------------------------
			FINDERS
		--------------------------------------------------------- */
		public find(key: Key): MapIterator<Key, T>
		{
			let index = this.hash_function_(key) % this.size();
			let bucket = this.at(index);

			for (let it of bucket)
				if (this.key_eq_(it.first, key))
					return it;

			return this.end_;
		}

		public hash_index(it: MapIterator<Key, T>): number
		{
			return this.hash_function_(it.first) % this.size();
		}
	}
}
