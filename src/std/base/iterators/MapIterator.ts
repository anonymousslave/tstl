/// <reference path="../../API.ts" />

/// <reference path="ListIterator.ts" />

namespace std.base
{
	export class MapIterator<Key, T> 
		extends ListIterator<Entry<Key, T>, MapIterator<Key, T>>
	{
		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public get first(): Key
		{
			return this.value.first;
		}

		public get second(): T
		{
			return this.value.second;
		}

		public set second(val: T)
		{
			this.value.second = val;
		}

		/* ---------------------------------------------------------
			COMPARISONS
		--------------------------------------------------------- */
		public less(obj: MapIterator<Key, T>): boolean
		{
			return less(this.first, obj.first);
		}
		
		public hashCode(): number
		{
			return hash(this.first);
		}
	}
}

namespace std.base
{
	export class MapReverseIterator<Key, T>
		extends ReverseIterator<Entry<Key, T>,
			MapIterator<Key, T>, 
			MapReverseIterator<Key, T>>
	{
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * @hidden
		 */
		protected _Create_neighbor(base: MapIterator<Key, T>): MapReverseIterator<Key, T>
		{
			return new MapReverseIterator(base);
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public get first(): Key
		{
			return this.base_.first;
		}

		public get second(): T
		{
			return this.base_.second;
		}

		public set second(val: T)
		{
			this.base_.second = val;
		}
	}
}
