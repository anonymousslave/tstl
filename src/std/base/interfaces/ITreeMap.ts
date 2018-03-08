namespace std.base
{
	/** 
	 * @hidden
	 */
    export interface ITreeMap<Key, T>
	{
		key_comp(): (x: Key, y: Key) => boolean;
		value_comp(): (x: IPair<Key, T>, y: IPair<Key, T>) => boolean;

		lower_bound(key: Key): MapIterator<Key, T>;
		upper_bound(key: Key): MapIterator<Key, T>;
		equal_range(key: Key): Pair<MapIterator<Key, T>, MapIterator<Key, T>>;
	}
}