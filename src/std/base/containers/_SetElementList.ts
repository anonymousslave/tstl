/// <reference path="../../API.ts" />

/// <reference path="ListContainer.ts" />

namespace std.base
{
	/**
	 * @hidden
	 */
	export class _SetElementList<T>
		extends ListContainer<T, _SetElementList<T>, SetIterator<T>, SetReverseIterator<T>>
	{
		/**
		 * @hidden
		 */
		private rend_: SetReverseIterator<T>;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		protected _Create_iterator(prev: SetIterator<T>, next: SetIterator<T>, val: T): SetIterator<T>
		{
			return new SetIterator<T>(prev, next, val);
		}

		protected _Set_begin(it: SetIterator<T>): void
		{
			super._Set_begin(it);
			this.rend_ = new SetReverseIterator<T>(it);
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public rbegin(): SetReverseIterator<T>
		{
			return new SetReverseIterator<T>(this.end());
		}
		
		public rend(): SetReverseIterator<T>
		{
			return this.rend_;
		}
	}
}