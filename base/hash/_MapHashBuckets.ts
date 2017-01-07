import { _HashBuckets } from "./_HashBuckets";

import { IHashMap } from "./../IHashMap";
import { MapIterator } from "./../MapContainer";

import { equal_to, hash } from "./../../functional";

/**
 * @hidden
 */
export class _MapHashBuckets<K, T>
	extends _HashBuckets<MapIterator<K, T>>
{
	private map_: IHashMap<K, T>;

	public constructor(map: IHashMap<K, T>)
	{
		super();

		this.map_ = map;
	}

	public find(key: K): MapIterator<K, T>
	{
		let index = hash(key) % this.size();
		let bucket = this.at(index);

		for (let i: number = 0; i < bucket.size(); i++)
			if (equal_to(bucket.at(i).first, key))
				return bucket.at(i);

		return this.map_.end();
	}
}