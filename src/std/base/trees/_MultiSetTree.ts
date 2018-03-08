/// <reference path="../../API.ts" />

/// <reference path="_SetTree.ts" />

namespace std.base
{
	/**
	 * @hidden
	 */
	export class _MultiSetTree<T>
		extends _SetTree<T>
	{
		/* ---------------------------------------------------------
			CONSTRUCTOR
		--------------------------------------------------------- */
		public constructor(end: SetIterator<T>, comp: (x: T, y: T) => boolean)
		{
			super(end, comp, 
				function (x: SetIterator<T>, y: SetIterator<T>): boolean
				{
					let ret: boolean = comp(x.value, y.value);
					if (!ret && !comp(y.value, x.value))
						return (x as any).__get_m_iUID() < (y as any).__get_m_iUID();
					else
						return ret;
				}
			);
		}

		public insert(val: SetIterator<T>): void
		{
			// ISSUE UID BEFORE INSERTION
			(val as any).__get_m_iUID();

			super.insert(val);
		}

		/* ---------------------------------------------------------
			FINDERS
		--------------------------------------------------------- */
		private _Nearest_by_key
			(
				val: T, 
				equal_mover: (node: _XTreeNode<SetIterator<T>>) => _XTreeNode<SetIterator<T>>
			): _XTreeNode<SetIterator<T>>
		{
			// NEED NOT TO ITERATE
			if (this.root_ == null)
				return null;

			//----
			// ITERATE
			//----
			let ret: _XTreeNode<SetIterator<T>> = this.root_;
			let matched: _XTreeNode<SetIterator<T>> = null;

			while (true)
			{
				let it: SetIterator<T> = ret.value;
				let my_node: _XTreeNode<SetIterator<T>> = null;

				// COMPARE
				if (this.key_comp()(val, it.value))
					my_node = ret.left;
				else if (this.key_comp()(it.value, val))
					my_node = ret.right;
				else
				{
					// EQUAL, RESERVE THAT POINT
					matched = ret;
					my_node = equal_mover(ret);
				}

				// ULTIL CHILD NODE EXISTS
				if (my_node == null)
					break;
				else
					ret = my_node;
			}

			// RETURNS -> MATCHED OR NOT
			return (matched != null) ? matched : ret;
		}

		public nearest_by_key(val: T): _XTreeNode<SetIterator<T>>
		{
			return this._Nearest_by_key(val, function (node)
			{
				return node.left;
			});
		}

		public upper_bound(val: T): SetIterator<T>
		{
			// FIND MATCHED NODE
			let node: _XTreeNode<SetIterator<T>> = this._Nearest_by_key(val, 
				function (node)
				{
					return node.right;
				});
			if (node == null) // NOTHING
				return this.end_;

			// MUST BE it.first > key
			let it: SetIterator<T> = node.value;
			
			if (this.key_comp()(val, it.value))
				return it;
			else
				return it.next();
        }
	}
}