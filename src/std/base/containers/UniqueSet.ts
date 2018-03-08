/// <reference path="../../API.ts" />

/// <reference path="SetContainer.ts" />

namespace std.base
{
	export abstract class UniqueSet<T, Source extends UniqueSet<T, Source>>
		extends SetContainer<T, Pair<SetIterator<T>, boolean>, Source>
	{
		/* ---------------------------------------------------------
			ACCESSOR
		--------------------------------------------------------- */
		public count(key: T): number
		{
			return this.find(key).equals(this.end()) ? 0 : 1;
		}

		/* ---------------------------------------------------------
			ERASE
		--------------------------------------------------------- */
		public extract(val: T): T;
		public extract(it: SetIterator<T>): SetIterator<T>;

		public extract(param: T | SetIterator<T>): any
		{
			if (param instanceof SetIterator)
				return this._Extract_by_iterator(param);
			else
				return this._Extract_by_key(param);
		}

		/**
		 * @hidden
		 */
		private _Extract_by_key(val: T): T
		{
			let it = this.find(val);
			if (it.equals(this.end()) == true)
				throw new OutOfRange("No such key exists.");

			this.erase(val);
			return val;
		}

		/**
		 * @hidden
		 */
		private _Extract_by_iterator(it: SetIterator<T>): SetIterator<T>
		{
			if (it.equals(this.end()) == true || this.has(it.value) == false)
				return this.end();

			this.erase(it);
			return it;
		}

		/* ---------------------------------------------------------
			UTILITY
		--------------------------------------------------------- */
		public merge(source: Source): void
		{
			for (let it = source.begin(); !it.equals(source.end());)
			{
				if (this.has(it.value) == false)
				{
					this.insert(it.value);
					it = source.erase(it);
				}
				else
					it = it.next();
			}
		}
	}
}