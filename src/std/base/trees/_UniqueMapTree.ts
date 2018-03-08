/// <reference path="../../API.ts" />

/// <reference path="_MapTree.ts" />

namespace std.base
{
	/**
	 * @hidden
	 */
	export class _UniqueMapTree<Key, T>
		extends _MapTree<Key, T>
	{
		/* ---------------------------------------------------------
			CONSTRUCTOR
		--------------------------------------------------------- */
		public constructor(end: MapIterator<Key, T>, comp: (x: Key, y: Key) => boolean)
		{
			super(end, comp,
				function (x: MapIterator<Key, T>, y: MapIterator<Key, T>): boolean
				{
					return comp(x.first, y.first);
				}
			);
		}

		/* ---------------------------------------------------------
			FINDERS
		--------------------------------------------------------- */
		public nearest_by_key(key: Key): _XTreeNode<MapIterator<Key, T>>
		{
			// NEED NOT TO ITERATE
			if (this.root_ == null)
				return null;

			//----
			// ITERATE
			//----
			let ret: _XTreeNode<MapIterator<Key, T>> = this.root_;
			
			while (true) // UNTIL MEET THE MATCHED VALUE OR FINAL BRANCH
			{
				let it: MapIterator<Key, T> = ret.value;
				let my_node: _XTreeNode<MapIterator<Key, T>> = null;
				
				// COMPARE
				if (this.key_comp()(key, it.first))
					my_node = ret.left;
				else if (this.key_comp()(it.first, key))
					my_node = ret.right;
				else
					return ret; // MATCHED VALUE

				// FINAL BRANCH? OR KEEP GOING
				if (my_node == null)
					break;
				else
					ret = my_node;
			}
			return ret; // DIFFERENT NODE
		}

		public upper_bound(key: Key): MapIterator<Key, T>
		{
			// FIND MATCHED NODE
			let node: _XTreeNode<MapIterator<Key, T>> = this.nearest_by_key(key);
			if (node == null)
				return this.end_;

			// MUST BE it.first > key
			let it: MapIterator<Key, T> = node.value;
			if (this.key_comp()(key, it.first))
				return it;
			else
				return it.next();
        }
	}
}