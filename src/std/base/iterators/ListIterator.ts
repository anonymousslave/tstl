/// <reference path="../../API.ts" />

namespace std.base
{
	export abstract class ListIterator<T,
			IteratorT extends ListIterator<T, IteratorT>>
		implements Readonly<IBidirectionalIterator<T, IteratorT>>
	{
		private static SEQUENCE: number = 0;

		/**
		 * @hidden
		 */
		private gid_: number;

		/**
		 * @hidden
		 */
		private prev_: IteratorT;

		/**
		 * @hidden
		 */
		private next_: IteratorT;

		/**
		 * @hidden
		 */
		private value_: T;

		/**
		 * @hidden
		 */
		public constructor(prev: IteratorT, next: IteratorT, value: T)
		{
			if (prev)
				this.gid_ = prev.gid_;
			else if (next)
				this.gid_ = next.gid_;
			else
				this.gid_ = ++ListIterator.SEQUENCE;

			this.prev_ = prev;
			this.next_ = next;
			this.value_ = value;
		}

		/* ---------------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------------- */
		public prev(): IteratorT
		{
			return this.prev_;
		}

		public next(): IteratorT
		{
			return this.next_;
		}

		public get value(): T
		{
			return this.value_;
		}

		/* ---------------------------------------------------------------
			COMPARISON
		--------------------------------------------------------------- */
		public equals(obj: IteratorT): boolean
		{
			return this == <any>obj;
		}
	}
}
