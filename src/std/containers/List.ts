/// <reference path="../API.ts" />

/// <reference path="../base/containers/ListContainer.ts" />
/// <reference path="../base/iterators/ListIterator.ts" />

namespace std
{
	export class List<T>
		extends base.ListContainer<T, List<T>, List.Iterator<T>, List.ReverseIterator<T>>
	{
		/**
		 * @hidden
		 */
		private rend_: List.ReverseIterator<T>;

		/* =========================================================
			CONSTRUCTORS & SEMI-CONSTRUCTORS
				- CONSTRUCTORS
				- ASSIGN & CLEAR
		============================================================
			CONSTURCTORS
		--------------------------------------------------------- */
		public constructor();
		public constructor(items: Array<T>);
		public constructor(size: number, val: T);
		public constructor(container: List<T>);
		public constructor(first: Readonly<IForwardIterator<T>>, last: Readonly<IForwardIterator<T>>);

		public constructor(...args: any[])
		{
			//----
			// DEFAULT CONFIGURATIONS
			//----
			// INHERITS
			super();

			//----
			// BRANCHES
			//----
			if (args.length == 0) 
			{
				// DEFAULT CONSTRUCTOR
			}
			else if (args.length == 1 && args[0] instanceof Array) 
			{
				// INITIALIZER CONSTRUCTOR
				let array: Array<T> = args[0];
				this.push(...array);
			}
			else if (args.length == 1 && (args[0] instanceof List)) 
			{
				// COPY CONSTRUCTOR
				let container: List<T> = args[0];
				this.assign(container.begin(), container.end());
			}
			else if (args.length == 2) 
			{
				// ASSIGN CONTRUCTOR
				this.assign(args[0], args[1]);
			}
		}

		/**
		 * @hidden
		 */
		protected _Create_iterator(prev: List.Iterator<T>, next: List.Iterator<T>, val: T): List.Iterator<T>
		{
			return new List.Iterator(prev, next, val);
		}

		/**
		 * @hidden
		 */
		protected _Set_begin(it: List.Iterator<T>): void
		{
			super._Set_begin(it);
			this.rend_ = new List.ReverseIterator<T>(it);
		}

		/* ---------------------------------------------------------
			ASSIGN & CLEAR
		--------------------------------------------------------- */
		public assign(n: number, val: T): void;
		public assign<U extends T, InputIterator extends Readonly<IForwardIterator<U, InputIterator>>>
			(first: InputIterator, last: InputIterator): void;

		public assign(par1: any, par2: any): void
		{
			this.clear();
			this.insert(this.end(), par1, par2);
		}
		
		/* =========================================================
			ACCESSORS
		========================================================= */
		public rbegin(): List.ReverseIterator<T>
		{
			return new List.ReverseIterator<T>(this.end());
		}

		public rend(): List.ReverseIterator<T>
		{
			return this.rend_;
		}

		/* ===============================================================
			ALGORITHMS
				- UNIQUE & REMOVE(_IF)
				- MERGE & SPLICE
				- SORT & SWAP
		==================================================================
			UNIQUE & REMOVE(_IF)
		--------------------------------------------------------------- */
		public unique(): void;

		public unique(binary_pred: (left: T, right: T) => boolean): void;

		public unique(binary_pred: (left: T, right: T) => boolean = equal_to): void
		{
			let it = this.begin().next();

			while (!it.equals(this.end()))
			{
				if (binary_pred(it.value, it.prev().value) == true)
					it = this.erase(it);
				else
					it = it.next();
			}
		}

		public remove(val: T): void
		{
			this.remove_if(function (x: T): boolean
			{
				return x == val;
			});
		}

		public remove_if(pred: (val: T) => boolean): void
		{
			let it = this.begin();

			while (!it.equals(this.end()))
			{
				if (pred(it.value) == true)
					it = this.erase(it);
				else
					it = it.next();
			}
		}

		/* ---------------------------------------------------------
			MERGE & SPLICE
		--------------------------------------------------------- */
		public merge<U extends T>(obj: List<U>): void;

		public merge<U extends T>(obj: List<U>, compare: (left: T, right: T) => boolean): void;

		public merge<U extends T>(obj: List<U>, compare: (left: T, right: T) => boolean = less): void
		{
			if (this == <List<T>>obj)
				return;

			let it = this.begin();

			while (obj.empty() == false)
			{
				let first = obj.begin();
				while (!it.equals(this.end()) && compare(it.value, first.value) == true)
					it = it.next();

				this.splice(it, obj, first);
			}
		}

		public splice<U extends T>(position: List.Iterator<T>, obj: List<U>): void;
		
		public splice<U extends T>(position: List.Iterator<T>, obj: List<U>, it: List.Iterator<U>): void;
		
		public splice<U extends T>
			(position: List.Iterator<T>, obj: List<U>, begin: List.Iterator<U>, end: List.Iterator<U>): void;

		public splice<U extends T>
			(
				position: List.Iterator<T>, obj: List<U>, 
				begin: List.Iterator<U> = null, end: List.Iterator<U> = null): void
		{
			if (begin == null)
			{
				begin = obj.begin();
				end = obj.end();
			}
			else if (end == null)
			{
				end = begin.next();
			}

			this.insert(position, begin, end);
			obj.erase(begin, end);
		}

		/* ---------------------------------------------------------
			SORT & SWAP
		--------------------------------------------------------- */
		public sort(): void;

		public sort(compare: (left: T, right: T) => boolean): void;

		public sort(compare: (left: T, right: T) => boolean = less): void
		{
			this._Quick_sort(this.begin(), this.end().prev(), compare);
		}

		/**
		 * @hidden
		 */
		private _Quick_sort(first: List.Iterator<T>, last: List.Iterator<T>, compare: (left: T, right: T) => boolean): void
		{
			if (!first.equals(last) && !last.equals(this.end()) && !first.equals(last.next()))
			{
				let temp: List.Iterator<T> = this._Quick_sort_partition(first, last, compare);

				this._Quick_sort(first, temp.prev(), compare);
				this._Quick_sort(temp.next(), last, compare);
			}
		}

		/**
		 * @hidden
		 */
		private _Quick_sort_partition(first: List.Iterator<T>, last: List.Iterator<T>, compare: (left: T, right: T) => boolean): List.Iterator<T>
		{
			let standard: T = last.value; // TO BE COMPARED
			let prev: List.Iterator<T> = first.prev(); // TO BE SMALLEST

			let it: List.Iterator<T> = first;
			for (; !it.equals(last); it = it.next())
				if (compare(it.value, standard))
				{
					prev = prev.equals(this.end()) ? first : prev.next();
					[prev.value, it.value] = [it.value, prev.value];
				}

			prev = prev.equals(this.end()) ? first : prev.next();
			[prev.value, it.value] = [it.value, prev.value];
		
			return prev;
		}

		public reverse(): void
		{
			let begin: List.Iterator<T> = this.end().prev();
			let prev_of_end: List.Iterator<T> = this.begin();

			for (let it = this.begin(); !it.equals(this.end()); )
			{
				let next = it.next();
				[it["prev_"], it["next_"]] = [it["next_"], it["prev_"]];

				it = next;
			}
			
			// ADJUST THE BEGIN AND END
			this._Set_begin(begin); // THE NEW BEGIN
			this.end()["prev_"] = prev_of_end;
			this.end()["next_"] = begin;
		}
	}
}

namespace std.List
{
	export class Iterator<T>
		extends base.ListIterator<T, Iterator<T>>
	{

		/* ---------------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------------- */
		public get value(): T
		{
			return this["value_"];
		}

		public set value(val: T)
		{
			this["value_"] = val;
		}

		/* ---------------------------------------------------------------
			COMPARISON
		--------------------------------------------------------------- */
		public equals(obj: Iterator<T>): boolean
		{
			return this == obj;
		}
	}

	export class ReverseIterator<T>
		extends base.ReverseIterator<T, Iterator<T>, ReverseIterator<T>>
	{
		/**
		 * @hidden
		 */
		protected _Create_neighbor(base: Iterator<T>): ReverseIterator<T>
		{
			return new ReverseIterator<T>(base);
		}

		public get value(): T
		{
			return this.base_.value;
		}

		public set value(val: T)
		{
			this.base_.value = val;
		}
	}
}