/// <reference path="../../API.ts" />

/// <reference path="_HashBuckets.ts" />

namespace std.base
{
	/**
	 * @hidden
	 */
	export class _SetHashBuckets<T>
		extends _HashBuckets<SetIterator<T>>
	{
		private end_: SetIterator<T>;

		private hash_function_: (val: T) => number;
		private key_eq_: (x: T, y: T) => boolean;
		
		/* ---------------------------------------------------------
			CONSTRUCTORS & ACCESSORS
		--------------------------------------------------------- */
        public constructor(end: SetIterator<T>, hash: (val: T) => number, pred: (x: T, y: T) => boolean)
		{
			super();

			this.end_ = end;
			this.hash_function_ = hash;
			this.key_eq_ = pred;
		}

		public hash_function(): (val: T) => number
		{
			return this.hash_function_;
		}
		public key_eq(): (x: T, y: T) => boolean
		{
			return this.key_eq_;
		}

		/* ---------------------------------------------------------
			FINDERS
		--------------------------------------------------------- */
		public find(val: T): SetIterator<T>
		{
			let index = this.hash_function_(val) % this.size();
			let bucket = this.at(index);

			for (let it of bucket)
				if (this.key_eq_(it.value, val))
					return it;

			return this.end_;
		}

		public hash_index(it: SetIterator<T>): number
		{
			return this.hash_function_(it.value) % this.size();
		}
	}
}