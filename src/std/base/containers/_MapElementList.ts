/// <reference path="../../API.ts" />

/// <reference path="ListContainer.ts" />

namespace std.base
{
	/**
	 * @hidden
	 */
	export class _MapElementList<Key, T> 
		extends ListContainer<Entry<Key, T>, 
			_MapElementList<Key, T>,
			MapIterator<Key, T>,
			MapReverseIterator<Key, T>>
	{
		/**
		 * @hidden
		 */
		private rend_: MapReverseIterator<Key, T>;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		protected _Create_iterator(prev: MapIterator<Key, T>, next: MapIterator<Key, T>, val: Entry<Key, T>): MapIterator<Key, T>
		{
			return new MapIterator<Key, T>(prev, next, val);
		}
		
		protected _Set_begin(it: MapIterator<Key, T>): void
		{
			super._Set_begin(it);
			this.rend_ = new MapReverseIterator<Key, T>(it);
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public rbegin(): MapReverseIterator<Key, T>
		{
			return new MapReverseIterator<Key, T>(this.end());
		}

		public rend(): MapReverseIterator<Key, T>
		{
			return this.rend_;
		}
	}
}