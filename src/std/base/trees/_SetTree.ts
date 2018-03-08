/// <reference path="../../API.ts" />

/// <reference path="_XTree.ts" />

namespace std.base
{
	/**
	 * @hidden
	 */
	export abstract class _SetTree<T>
		extends _XTree<SetIterator<T>>
	{
		protected readonly end_: SetIterator<T>;
		private readonly key_comp_: (x: T, y: T) => boolean;
		private readonly key_eq_: (x: T, y: T) => boolean;

		/* ---------------------------------------------------------
			CONSTRUCTOR
		--------------------------------------------------------- */
        public constructor
			(
				end: SetIterator<T>, 
				comp: (x: T, y: T) => boolean,
				it_comp: (x: SetIterator<T>, y: SetIterator<T>) => boolean
			)
		{
			super(it_comp);
			this.end_ = end;

			this.key_comp_ = comp;
			this.key_eq_ = function (x: T, y: T): boolean
			{
				return !comp(x, y) && !comp(y, x);
			};
		}

		/* ---------------------------------------------------------
			FINDERS
		--------------------------------------------------------- */
		public get_by_key(val: T): _XTreeNode<SetIterator<T>>
		{
			let ret = this.nearest_by_key(val);
			if (ret == null || !this.key_eq_(val, ret.value.value))
				return null;
			else
				return ret;
		}
		public abstract nearest_by_key(val: T): _XTreeNode<SetIterator<T>>;

		public lower_bound(val: T): SetIterator<T>
		{
			let node: _XTreeNode<SetIterator<T>> = this.nearest_by_key(val);

			if (node == null)
				return this.end_;
			else if (this.key_comp_(node.value.value, val)) // it < key
				return node.value.next();
			else
				return node.value;
        }
		public abstract upper_bound(val: T): SetIterator<T>;

		public equal_range(val: T): Pair<SetIterator<T>, SetIterator<T>>
		{
			return make_pair(this.lower_bound(val), this.upper_bound(val));
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public key_comp(): (x: T, y: T) => boolean
		{
			return this.key_comp_;
		}
		public key_eq(): (x: T, y: T) => boolean
		{
			return this.key_eq_;
		}

		public value_comp(): (x: T, y: T) => boolean
		{
			return this.key_comp_;
        }
	}
}