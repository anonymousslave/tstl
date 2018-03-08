/// <reference path="../../API.ts" />

namespace std.base
{
	export abstract class MapContainer<Key, T, InsertRet, Source extends MapContainer<Key, T, InsertRet, Source>>
		extends Container<Entry<Key, T>,
			Source,
			MapIterator<Key, T>,
			MapReverseIterator<Key, T>>
	{
		/**
		 * @hidden
		 */
		private data_: _MapElementList<Key, T>;

		/* ---------------------------------------------------------
			CONSTURCTORS
		--------------------------------------------------------- */
		protected constructor()
		{
			super();
			
			this.data_ = new _MapElementList<Key, T>();
		}
		
		public assign<L extends Key, U extends T, InputIterator extends Readonly<IForwardIterator<IPair<L, U>, InputIterator>>>
			(first: InputIterator, last: InputIterator): void
		{
			// INSERT
			this.clear();
			this.insert(first, last);
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
		public abstract find(key: Key): MapIterator<Key, T>;

		public begin(): MapIterator<Key, T>
		{
			return this.data_.begin();
		}
		public end(): MapIterator<Key, T>
		{
			return this.data_.end();
		}

		public rbegin(): MapReverseIterator<Key, T>
		{
			return this.data_.rbegin();
		}
		public rend(): MapReverseIterator<Key, T>
		{
			return this.data_.rend();
		}

		/* ---------------------------------------------------------
			ELEMENTS
		--------------------------------------------------------- */
		public has(key: Key): boolean
		{
			return !this.find(key).equals(this.end());
		}

		public abstract count(key: Key): number;

		public size(): number
		{
			return this.data_.size();
		}
		
		/* =========================================================
			ELEMENTS I/O
				- INSERT
				- ERASE
				- UTILITY
				- POST-PROCESS
		============================================================
			INSERT
		--------------------------------------------------------- */
		public push(...items: IPair<Key, T>[]): number
		{
			// INSERT BY RANGE
			let first = new _NativeArrayIterator(items, 0);
			let last = new _NativeArrayIterator(items, items.length);

			this.insert(first, last);

			// RETURN SIZE
			return this.size();
		}

		public emplace(key: Key, value: T): InsertRet;
		public emplace(pair: IPair<Key, T>): InsertRet;

		public emplace(...args: any[]): InsertRet
		{
			if (args.length == 1)
				return this._Emplace(args[0].first, args[0].second);
			else
				return this._Emplace(args[0], args[1]);
		}

		public emplace_hint(hint: MapIterator<Key, T>, key: Key, val: T): MapIterator<Key, T>;
		public emplace_hint(hint: MapIterator<Key, T>, pair: IPair<Key, T>): MapIterator<Key, T>;

		public emplace_hint(hint: any, ...args: any[]): any
		{
			if (args.length == 1)
				return this._Emplace_hint(hint, args[0].first, args[0].second);
			else
				return this._Emplace_hint(hint, args[0], args[1]);
		}

		public insert(pair: IPair<Key, T>): InsertRet;
		public insert(hint: MapIterator<Key, T>, pair: IPair<Key, T>): MapIterator<Key, T>;
		public insert<L extends Key, U extends T, InputIterator extends Readonly<IForwardIterator<IPair<L, U>, InputIterator>>>
			(first: InputIterator, last: InputIterator): void;

		public insert(...args: any[]): any
		{
			if (args.length == 1)
				return this._Emplace(args[0].first, args[0].second);
			else if (args.length == 2 && args[0].next instanceof Function && args[1].next instanceof Function)
				return this._Insert_by_range(args[0], args[1]);
			else
				return this._Emplace_hint(args[0], args[1].first, args[1].second);
		}

		/**
		 * @hidden
		 */
		protected abstract _Emplace(key: Key, val: T): InsertRet;

		/**
		 * @hidden
		 */
		protected abstract _Emplace_hint(hint: MapIterator<Key, T>, key: Key, val: T): MapIterator<Key, T>;

		/**
		 * @hidden
		 */
		protected abstract _Insert_by_range<L extends Key, U extends T, InputIterator extends Readonly<IForwardIterator<IPair<L, U>, InputIterator>>>
			(first: InputIterator, last: InputIterator): void;

		/* ---------------------------------------------------------
			ERASE
		--------------------------------------------------------- */
		public erase(key: Key): number;
		public erase(it: MapIterator<Key, T>): MapIterator<Key, T>;
		public erase(begin: MapIterator<Key, T>, end: MapIterator<Key, T>): MapIterator<Key, T>;

		public erase(...args: any[]): any 
		{
			if (args.length == 1 && (args[0] instanceof MapIterator == false || (args[0] as MapIterator<Key, T>)["gid_"] != this.end()["gid_"]))
				return this._Erase_by_key(args[0]);
			else
				if (args.length == 1)
					return this._Erase_by_range(args[0]);
				else
					return this._Erase_by_range(args[0], args[1]);
		}

		/**
		 * @hidden
		 */
		private _Erase_by_key(key: Key): number
		{
			let it = this.find(key);
			if (it.equals(this.end()) == true)
				return 0;

			this._Erase_by_range(it);
			return 1;
		}

		/**
		 * @hidden
		 */
		private _Erase_by_range(first: MapIterator<Key, T>, last: MapIterator<Key, T> = first.next()): MapIterator<Key, T>
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
		protected abstract _Handle_insert(first: MapIterator<Key, T>, last: MapIterator<Key, T>): void;

		/**
		 * @hidden
		 */
		protected abstract _Handle_erase(first: MapIterator<Key, T>, last: MapIterator<Key, T>): void;
	}
}
