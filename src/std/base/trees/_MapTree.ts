/// <reference path="../../API.ts" />

/// <reference path="_XTree.ts" />

namespace std.base
{
	/**
	 * @hidden
	 */
	export abstract class _MapTree<Key, T>
		extends _XTree<MapIterator<Key, T>>
	{
		protected readonly end_: MapIterator<Key, T>;

		private readonly key_compare_: (x: Key, y: Key) => boolean;
		private readonly key_eq_: (x: Key, y: Key) => boolean;
		private readonly value_compare_: (x: IPair<Key, T>, y: IPair<Key, T>) => boolean;
		
		/* ---------------------------------------------------------
			CONSTRUCTOR
		--------------------------------------------------------- */
        public constructor
			(
				end: MapIterator<Key, T>, 
				comp: (x: Key, y: Key) => boolean,
				it_comp: (x: MapIterator<Key, T>, y: MapIterator<Key, T>) => boolean
			)
		{
			super(it_comp);
			this.end_ = end;

			this.key_compare_ = comp;
			this.key_eq_ = function (x: Key, y: Key): boolean
			{
				return !comp(x, y) && !comp(y, x);
			};
			this.value_compare_ = function (x: IPair<Key, T>, y: IPair<Key, T>): boolean
			{
				return comp(x.first, y.first);
			};
		}

		/* ---------------------------------------------------------
			FINDERS
		--------------------------------------------------------- */
		public get_by_key(key: Key): _XTreeNode<MapIterator<Key, T>>
		{
			let ret = this.nearest_by_key(key);
			if (ret == null || !this.key_eq_(key, ret.value.first))
				return null;
			else
				return ret;
		}
		public abstract nearest_by_key(key: Key): _XTreeNode<MapIterator<Key, T>>;

		public lower_bound(key: Key): MapIterator<Key, T>
		{
			let node: _XTreeNode<MapIterator<Key, T>> = this.nearest_by_key(key);

			if (node == null)
				return this.end_;
			else if (this.key_comp()(node.value.first, key)) // it < key
				return node.value.next();
			else
				return node.value;
		}

		public abstract upper_bound(key: Key): MapIterator<Key, T>;

		public equal_range(key: Key): Pair<MapIterator<Key, T>, MapIterator<Key, T>>
		{
			return make_pair(this.lower_bound(key), this.upper_bound(key));
		}

		/* ---------------------------------------------------------
			ACCECSSORS
		--------------------------------------------------------- */
		public key_comp(): (x: Key, y: Key) => boolean
		{
			return this.key_compare_;
		}
		public key_eq(): (x: Key, y: Key) => boolean
		{
			return this.key_eq_;	
		}
		
		public value_comp(): (x: IPair<Key, T>, y: IPair<Key, T>) => boolean
		{
			return this.value_compare_;
		}
	}
}