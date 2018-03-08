namespace std.base
{
	export interface IContainer<T, 
			Iterator extends Readonly<IForwardIterator<T, Iterator>>>
	{
		begin(): Iterator;
		end(): Iterator;
	}

	export interface IReverseContainer<T,
			IteratorT extends Readonly<IBidirectionalIterator<T, IteratorT>>,
			ReverseIteratorT extends ReverseIterator<T, IteratorT, ReverseIteratorT>>
		extends IContainer<T, IteratorT>
	{
		rbegin(): ReverseIteratorT;
		rend(): ReverseIteratorT;
	}
}