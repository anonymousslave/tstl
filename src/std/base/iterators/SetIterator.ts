/// <reference path="../../API.ts" />

/// <reference path="ListIterator.ts" />

namespace std.base
{
	export class SetIterator<T>
		extends ListIterator<T, SetIterator<T>>
	{
		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public less(obj: SetIterator<T>): boolean
		{
			return less(this.value, obj.value);
		}

		public hashCode(): number
		{
			return hash(this.value);
		}
	}
}

namespace std.base
{
	export class SetReverseIterator<T>
		extends ReverseIterator<T, 
			SetIterator<T>, 
			SetReverseIterator<T>>
	{
		/**
		 * @hidden
		 */
		protected _Create_neighbor(base: SetIterator<T>): SetReverseIterator<T>
		{
			return new SetReverseIterator(base);
		}
	}
}
