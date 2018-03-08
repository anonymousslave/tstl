/// <reference path="../../API.ts" />

/// <reference path="ListContainer.ts" />

namespace std.base
{
	export abstract class SetContainer<T, InsertRet, Source extends SetContainer<T, InsertRet, Source>>
		extends Container<T, 
			Source, 
			SetIterator<T>, 
			SetReverseIterator<T>>
	{
		/**
		 * @hidden
		 */
		private data_: _SetElementList<T>;
		
		/* ---------------------------------------------------------
			CONSTURCTORS
		--------------------------------------------------------- */
		protected constructor()
		{
			super();

			this.data_ = new _SetElementList();
		}

		public assign<U extends T, InputIterator extends Readonly<IForwardIterator<U, InputIterator>>>
			(begin: InputIterator, end: InputIterator): void
		{
			// INSERT
			this.clear();
			this.insert(begin, end);
		}

		public clear(): void
		{
			// TO BE ABSTRACT
			this.data_.clear();
		}

		/* =========================================================
			ACCESSORS
				- ITERATORS
				- ELEMENTS
		============================================================
			ITERATOR
		--------------------------------------------------------- */
		public abstract find(val: T): SetIterator<T>;

		public begin(): SetIterator<T>
		{
			return this.data_.begin();
		}

		public end(): SetIterator<T>
		{
			return this.data_.end();
		}

		public rbegin(): SetReverseIterator<T>
		{
			return this.data_.rbegin();
		}

		public rend(): SetReverseIterator<T>
		{
			return this.data_.rend();
		}

		/* ---------------------------------------------------------
			ELEMENTS
		--------------------------------------------------------- */
		public has(val: T): boolean
		{
			return !this.find(val).equals(this.end());
		}

		public abstract count(val: T): number;

		public size(): number
		{
			return this.data_.size();
		}

		///**
		// * @hidden
		// */
		//protected _Get_data(): List<T>
		//{
		//	return this.data_;
		//}

		/* =========================================================
			ELEMENTS I/O
				- INSERT
				- ERASE
				- UTILITY
				- POST-PROCESS
		============================================================
			INSERT
		--------------------------------------------------------- */
		public push(...items: T[]): number
		{
			if (items.length == 0)
				return this.size();

			// INSERT BY RANGE
			let first: _NativeArrayIterator<T> = new _NativeArrayIterator<T>(items, 0);
			let last: _NativeArrayIterator<T> = new _NativeArrayIterator<T>(items, items.length);

			this._Insert_by_range(first, last);

			// RETURN SIZE
			return this.size();
		}
		
		public insert(val: T): InsertRet;
		public insert(hint: SetIterator<T>, val: T): SetIterator<T>;
		public insert<U extends T, InputIterator extends Readonly<IForwardIterator<U, InputIterator>>>
			(begin: InputIterator, end: InputIterator): void;

		public insert(...args: any[]): any
		{
			if (args.length == 1)
				return this._Insert_by_val(args[0]);
			else if (args.length == 2)
			{
				if (args[0].next instanceof Function && args[1].next instanceof Function)
				{
					// IT DOESN'T CONTAIN POSITION
					// RANGES TO INSERT ONLY
					return this._Insert_by_range(args[0], args[1]);
				}
				else
				{
					// INSERT AN ELEMENT
					return this._Insert_by_hint(args[0], args[1]);
				}
			}
		}

		/**
		 * @hidden
		 */
		protected abstract _Insert_by_val(val: T): InsertRet;
		
		/**
		 * @hidden
		 */
		protected abstract _Insert_by_hint(hint: SetIterator<T>, val: T): SetIterator<T>;
		
		/**
		 * @hidden
		 */
		protected abstract _Insert_by_range<U extends T, InputIterator extends Readonly<IForwardIterator<U, InputIterator>>>
			(begin: InputIterator, end: InputIterator): void;

		/* ---------------------------------------------------------
			ERASE
		--------------------------------------------------------- */
		public erase(val: T): number;
		public erase(it: SetIterator<T>): SetIterator<T>;
		public erase(begin: SetIterator<T>, end: SetIterator<T>): SetIterator<T>;

		public erase(...args: any[]): any
		{
			if (args.length == 1 && !(args[0] instanceof SetIterator && (args[0] as SetIterator<T>)["gid_"] == this.end()["gid_"]))
				return this._Erase_by_val(args[0]);
			else if (args.length == 1)
				return this._Erase_by_range(args[0]);
			else
				return this._Erase_by_range(args[0], args[1]);
		}

		/**
		 * @hidden
		 */
		private _Erase_by_val(val: T): number
		{
			// TEST WHETHER EXISTS
			let it = this.find(val);
			if (it.equals(this.end()) == true)
				return 0;

			// ERASE
			this._Erase_by_range(it);
			return 1;
		}

		/**
		 * @hidden
		 */
		private _Erase_by_range(first: SetIterator<T>, last: SetIterator<T> = first.next()): SetIterator<T>
		{
			// ERASE
			let it = this.data_.erase(first, last);
			
			// POST-PROCESS
			this._Handle_erase(first, last);

			return it; 
		}

		/* ---------------------------------------------------------
			UTILITY
		--------------------------------------------------------- */
		/**
		 * @hidden
		 */
		public swap(obj: Source): void
		{
			// CHANGE CONTENTS
			[this.data_, obj.data_] = [obj.data_, this.data_];
		}

		public abstract merge(source: Source): void;

		/* ---------------------------------------------------------
			POST-PROCESS
		--------------------------------------------------------- */
		/**
		 * @hidden
		 */
		protected abstract _Handle_insert(first: SetIterator<T>, last: SetIterator<T>): void;

		/**
		 * @hidden
		 */
		protected abstract _Handle_erase(first: SetIterator<T>, last: SetIterator<T>): void;
	}
}
