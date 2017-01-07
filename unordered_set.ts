﻿import { UniqueSet } from "./base/UniqueSet";
import { MultiSet } from "./base/MultiSet";
import { IHashSet } from "./base/IHashSet";

import { _SetHashBuckets } from "./base/hash/_SetHashBuckets";
import { _Hash } from "./base/hash/_HashBuckets";
import { SetIterator, SetReverseIterator } from "./base/SetContainer";

import { Container } from "./base/Container";
import { Iterator } from "./iterator";

import { Pair, make_pair } from "./utility";
import { equal_to, hash } from "./functional";

/**
	 * <p> Hashed, unordered set. </p>
	 *
	 * <p> {@link HashSet}s are containers that store unique elements in no particular order, and which 
	 * allow for fast retrieval of individual elements based on their value. </p>
	 *
	 * <p> In an {@link HashSet}, the value of an element is at the same time its <i>key</i>, that 
	 * identifies it uniquely. Keys are immutable, therefore, the elements in an {@link HashSet} cannot be 
	 * modified once in the container - they can be inserted and removed, though. </p>
	 *
	 * <p> Internally, the elements in the {@link HashSet} are not sorted in any particular order, but 
	 * organized into buckets depending on their hash values to allow for fast access to individual elements 
	 * directly by their <i>values</i> (with a constant average time complexity on average). </p>
	 *
	 * <p> {@link HashSet} containers are faster than {@link TreeSet} containers to access individual 
	 * elements by their <i>key</i>, although they are generally less efficient for range iteration through a 
	 * subset of their elements. </p>
	 * 
	 * <p> <a href="http://samchon.github.io/tstl/images/design/class_diagram/set_containers.png" target="_blank"> 
	 * <img src="http://samchon.github.io/tstl/images/design/class_diagram/set_containers.png" style="max-width: 100%" /></a> </p>
	 * 
	 * <h3> Container properties </h3>
	 * <dl>
	 *	<dt> Associative </dt>
	 *	<dd> Elements in associative containers are referenced by their <i>key</i> and not by their absolute 
	 *		 position in the container. </dd>
	 *
	 *	<dt> Hashed </dt>
	 *	<dd> Hashed containers organize their elements using hash tables that allow for fast access to elements 
	 *		 by their <i>key</i>. </dd>
	 * 
	 *	<dt> Set </dt>
	 *	<dd> The value of an element is also the <i>key</i> used to identify it. </dd>
	 * 
	 *	<dt> Unique keys </dt>
	 *	<dd> No two elements in the container can have equivalent <i>keys</i>. </dd>
	 * </dl>
	 * 
	 * @param <T> Type of the elements. 
	 *			  Each element in an {@link HashSet} is also uniquely identified by this value.
	 *
	 * @reference http://www.cplusplus.com/reference/unordered_set/unordered_set
	 * @author Jeongho Nam <http://samchon.org>
	 */
export class HashSet<T>
	extends UniqueSet<T>
	implements IHashSet<T>
{
	/**
	 * @hidden
	 */
	private hash_buckets_: _SetHashBuckets<T>;

	/* =========================================================
		CONSTRUCTORS & SEMI-CONSTRUCTORS
			- CONSTRUCTORS
			- ASSIGN & CLEAR
	============================================================
		CONSTURCTORS
	--------------------------------------------------------- */
	/**
	 * Default Constructor.
	 */
	public constructor();

	/**
	 * Construct from elements.
	 */
	public constructor(items: T[]);

	/**
	 * Copy Constructor.
	 */
	public constructor(container: HashSet<T>);

	/**
	 * Construct from range iterators.
	 */
	public constructor(begin: Iterator<T>, end: Iterator<T>);

	public constructor(...args: any[])
	{
		// INIT MEMBERS
		super();
		this.hash_buckets_ = new _SetHashBuckets<T>(this);

		// BRANCH - METHOD OVERLOADINGS
		if (args.length == 0)
		{
			// DO NOTHING
		}
		else if (args.length == 1 && args[0] instanceof HashSet)
		{
			// COPY CONSTRUCTOR
			let container: HashSet<T> = args[0];

			this.assign(container.begin(), container.end());
		}
		else if (args.length == 1 && args[0] instanceof Array)
		{
			// INITIALIZER LIST CONSTRUCTOR
			let items: T[] = args[0];

			this.rehash(items.length * _Hash.RATIO);
			this.push(...items);
		}
		else if (args.length == 2 && args[0] instanceof Iterator && args[1] instanceof Iterator)
		{
			// RANGE CONSTRUCTOR
			let first: Iterator<T> = args[0];
			let last: Iterator<T> = args[1];

			this.assign(first, last);
		}
	}

	/* ---------------------------------------------------------
		ASSIGN & CLEAR
	--------------------------------------------------------- */
	/**
	 * @inheritdoc
	 */
	public clear(): void
	{
		this.hash_buckets_.clear();

		super.clear();
	}

	/* =========================================================
		ACCESSORS
			- MEMBER
			- HASH
	============================================================
		MEMBER
	--------------------------------------------------------- */
	/**
	 * @inheritdoc
	 */
	public find(key: T): SetIterator<T>
	{
		return this.hash_buckets_.find(key);
	}

	/**
	 * @inheritdoc
	 */
	public begin(): SetIterator<T>;

	/**
	 * @inheritdoc
	 */
	public begin(index: number): SetIterator<T>;

	public begin(index: number = -1): SetIterator<T>
	{
		if (index == -1)
			return super.begin();
		else
			return this.hash_buckets_.at(index).front();
	}

	/**
	 * @inheritdoc
	 */
	public end(): SetIterator<T>;

	/**
	 * @inheritdoc
	 */
	public end(index: number): SetIterator<T>

	public end(index: number = -1): SetIterator<T>
	{
		if (index == -1)
			return super.end();
		else
			return this.hash_buckets_.at(index).back().next();
	}

	/**
	 * @inheritdoc
	 */
	public rbegin(): SetReverseIterator<T>;

	/**
	 * @inheritdoc
	 */
	public rbegin(index: number): SetReverseIterator<T>;

	public rbegin(index: number = -1): SetReverseIterator<T>
	{
		if (index == -1)
			return super.rbegin();
		else
			return new SetReverseIterator<T>(this.end(index));
	}

	/**
	 * @inheritdoc
	 */
	public rend(): SetReverseIterator<T>;

	/**
	 * @inheritdoc
	 */
	public rend(index: number): SetReverseIterator<T>;

	public rend(index: number = -1): SetReverseIterator<T>
	{
		if (index == -1)
			return super.rend();
		else
			return new SetReverseIterator<T>(this.begin(index));
	}

	/* ---------------------------------------------------------
		HASH
	--------------------------------------------------------- */
	/**
	 * @inheritdoc
	 */
	public bucket_count(): number
	{
		return this.hash_buckets_.size();
	}

	/**
	 * @inheritdoc
	 */
	public bucket_size(n: number): number
	{
		return this.hash_buckets_.at(n).size();
	}

	/**
	 * @inheritdoc
	 */
	public max_load_factor(): number;

	/**
	 * @inheritdoc
	 */
	public max_load_factor(z: number): void;

	public max_load_factor(z: number = -1): any
	{
		if (z == -1)
			return this.size() / this.bucket_count();
		else
			this.rehash(Math.ceil(this.bucket_count() / z));
	}

	/**
	 * @inheritdoc
	 */
	public bucket(key: T): number
	{
		return hash(key) % this.hash_buckets_.size();
	}

	/**
	 * @inheritdoc
	 */
	public reserve(n: number): void
	{
		this.hash_buckets_.rehash(Math.ceil(n * this.max_load_factor()));
	}

	/**
	 * @inheritdoc
	 */
	public rehash(n: number): void
	{
		if (n <= this.bucket_count())
			return;

		this.hash_buckets_.rehash(n);
	}

	/* =========================================================
		ELEMENTS I/O
			- INSERT
			- POST-PROCESS
			- SWAP
	============================================================
		INSERT
	--------------------------------------------------------- */
	/**
	 * @hidden
	 */
	protected _Insert_by_val(val: T): any
	{
		// TEST WHETHER EXIST
		let it = this.find(val);
		if (it.equals(this.end()) == false)
			return make_pair(it, false);

		// INSERT
		this["data_"].push_back(val);
		it = it.prev();

		// POST-PROCESS
		this._Handle_insert(it, it.next());

		return make_pair(it, true);
	}

	/**
	 * @hidden
	 */
	protected _Insert_by_hint(hint: SetIterator<T>, val: T): SetIterator<T>
	{
		// FIND KEY
		if (this.has(val) == true)
			return this.end();

		// INSERT
		let it = this["data_"].insert(hint, val);

		// POST-PROCESS
		this._Handle_insert(it, it.next());

		return it;
	}

	/**
	 * @hidden
	 */
	protected _Insert_by_range<U extends T, InputIterator extends Iterator<U>>
		(first: InputIterator, last: InputIterator): void
	{
		let my_first: SetIterator<T> = this.end().prev();
		let size: number = 0;

		for (; !first.equals(last); first = first.next() as InputIterator)
		{
			// TEST WHETER EXIST
			if (this.has(first.value))
				continue;

			// INSERTS
			this["data_"].push_back(first.value);
			size++;
		}
		my_first = my_first.next();

		// IF NEEDED, HASH_BUCKET TO HAVE SUITABLE SIZE
		if (this.size() + size > this.hash_buckets_.size() * _Hash.MAX_RATIO)
			this.hash_buckets_.rehash((this.size() + size) * _Hash.RATIO);

		// INSERTS
		this._Handle_insert(my_first, this.end());
	}

	/* ---------------------------------------------------------
		POST-PROCESS
	--------------------------------------------------------- */
	/**
	 * @hidden
	 */
	protected _Handle_insert(first: SetIterator<T>, last: SetIterator<T>): void
	{
		for (; !first.equals(last); first = first.next())
			this.hash_buckets_.insert(first);
	}

	/**
	 * @hidden
	 */
	protected _Handle_erase(first: SetIterator<T>, last: SetIterator<T>): void
	{
		for (; !first.equals(last); first = first.next())
			this.hash_buckets_.erase(first);
	}

	/* ---------------------------------------------------------
		SWAP
	--------------------------------------------------------- */
	/**
	 * <p> Swap content. </p>
	 * 
	 * <p> Exchanges the content of the container by the content of <i>obj</i>, which is another 
	 * {@link HashSet set} of the same type. Sizes abd container type may differ. </p>
	 * 
	 * <p> After the call to this member function, the elements in this container are those which were 
	 * in <i>obj</i> before the call, and the elements of <i>obj</i> are those which were in this. All 
	 * iterators, references and pointers remain valid for the swapped objects. </p>
	 *
	 * <p> Notice that a non-member function exists with the same name, {@link swap swap}, overloading that 
	 * algorithm with an optimization that behaves like this member function. </p>
	 * 
	 * @param obj Another {@link HashSet set container} of the same type of elements as this (i.e.,
	 *			  with the same template parameters, <b>Key</b> and <b>T</b>) whose content is swapped 
	 *			  with that of this {@link HashSet container}.
	 */
	public swap(obj: HashSet<T>): void;

	/**
	 * @inheritdoc
	 */
	public swap(obj: Container<T>): void;

	public swap(obj: HashSet<T> | Container<T>): void
	{
		if (obj instanceof HashSet)
		{
			this._Swap(obj);
			[this.hash_buckets_, obj.hash_buckets_] = [obj.hash_buckets_, this.hash_buckets_];
		}
		else
			super.swap(obj);
	}
}

/**
	 * <p> Hashed, unordered Multiset. </p>
	 *
	 * <p> {@link HashMultiSet HashMultiSets} are containers that store elements in no particular order, allowing fast 
	 * retrieval of individual elements based on their value, much like {@link HashMultiSet} containers, 
	 * but allowing different elements to have equivalent values. </p>
	 *
	 * <p> In an {@link HashMultiSet}, the value of an element is at the same time its <i>key</i>, used to 
	 * identify it. <i>Keys</i> are immutable, therefore, the elements in an {@link HashMultiSet} cannot be 
	 * modified once in the container - they can be inserted and removed, though. </p>
	 *
	 * <p> Internally, the elements in the {@link HashMultiSet} are not sorted in any particular, but 
	 * organized into <i>buckets</i> depending on their hash values to allow for fast access to individual 
	 * elements directly by their <i>values</i> (with a constant average time complexity on average). </p>
	 * 
	 * <p> Elements with equivalent values are grouped together in the same bucket and in such a way that an 
	 * iterator can iterate through all of them. Iterators in the container are doubly linked iterators. </p>
	 *
	 * <p> <a href="http://samchon.github.io/tstl/images/design/class_diagram/set_containers.png" target="_blank"> 
	 * <img src="http://samchon.github.io/tstl/images/design/class_diagram/set_containers.png" style="max-width: 100%" /></a> </p>
	 * 
	 * <h3> Container properties </h3>
	 * <dl>
	 *	<dt> Associative </dt>
	 *	<dd> Elements in associative containers are referenced by their <i>key</i> and not by their absolute 
	 *		 position in the container. </dd>
	 *
	 *	<dt> Hashed </dt>
	 *	<dd> Hashed containers organize their elements using hash tables that allow for fast access to elements 
	 *		 by their <i>key</i>. </dd>
	 *
	 *	<dt> Set </dt>
	 *	<dd> The value of an element is also the <i>key</i> used to identify it. </dd>
	 *
	 *	<dt> Multiple equivalent keys </dt>
	 *	<dd> The container can hold multiple elements with equivalent <i>keys</i>. </dd>
	 * </dl> 
	 *
	 * @param <T> Type of the elements. 
	 *		   Each element in an {@link UnorderedMultiSet} is also identified by this value..
	 *
	 * @reference http://www.cplusplus.com/reference/unordered_set/unordered_multiset
	 * @author Jeongho Nam <http://samchon.org>
	 */
export class HashMultiSet<T>
	extends MultiSet<T>
{
	/**
	 * @hidden
	 */
	private hash_buckets_: _SetHashBuckets<T>;

	/* =========================================================
		CONSTRUCTORS & SEMI-CONSTRUCTORS
			- CONSTRUCTORS
			- ASSIGN & CLEAR
	============================================================
		CONSTURCTORS
	--------------------------------------------------------- */
	/**
	 * Default Constructor.
	 */
	public constructor();

	/**
	 * Construct from elements.
	 */
	public constructor(items: T[]);

	/**
	 * Copy Constructor.
	 */
	public constructor(container: HashMultiSet<T>);

	/**
	 * Construct from range iterators.
	 */
	public constructor(begin: Iterator<T>, end: Iterator<T>);

	public constructor(...args: any[])
	{
		// INIT MEMBERS
		super();
		this.hash_buckets_ = new _SetHashBuckets<T>(this);

		// BRANCH - METHOD OVERLOADINGS
		if (args.length == 0)
		{
			// DO NOTHING
		}
		else if (args.length == 1 && args[0] instanceof HashMultiSet)
		{
			// COPY CONSTRUCTOR
			let container: HashMultiSet<T> = args[0];

			this.assign(container.begin(), container.end());
		}
		else if (args.length == 1 && args[0] instanceof Array)
		{
			// INITIALIZER LIST CONSTRUCTOR
			let items: T[] = args[0];

			this.rehash(items.length * _Hash.RATIO);
			this.push(...items);
		}
		else if (args.length == 2 && args[0] instanceof Iterator && args[1] instanceof Iterator)
		{
			// RANGE CONSTRUCTOR
			let first: Iterator<T> = args[0];
			let last: Iterator<T> = args[1];

			this.assign(first, last);
		}
	}

	/* ---------------------------------------------------------
		ASSIGN & CLEAR
	--------------------------------------------------------- */
	/**
	 * @inheritdoc
	 */
	public clear(): void
	{
		this.hash_buckets_.clear();

		super.clear();
	}

	/* =========================================================
		ACCESSORS
			- MEMBER
			- HASH
	============================================================
		MEMBER
	--------------------------------------------------------- */
	/**
	 * @inheritdoc
	 */
	public find(key: T): SetIterator<T>
	{
		return this.hash_buckets_.find(key);
	}

	/**
	 * @inheritdoc
	 */
	public count(key: T): number
	{
		// FIND MATCHED BUCKET
		let index = hash(key) % this.hash_buckets_.item_size();
		let bucket = this.hash_buckets_.at(index);

		// ITERATE THE BUCKET
		let cnt: number = 0;
		for (let i = 0; i < bucket.size(); i++)
			if (equal_to(bucket.at(i).value, key))
				cnt++;

		return cnt;
	}

	/**
	 * @inheritdoc
	 */
	public begin(): SetIterator<T>;

	/**
	 * @inheritdoc
	 */
	public begin(index: number): SetIterator<T>;

	public begin(index: number = -1): SetIterator<T>
	{
		if (index == -1)
			return super.begin();
		else
			return this.hash_buckets_.at(index).front();
	}

	/**
	 * @inheritdoc
	 */
	public end(): SetIterator<T>;

	/**
	 * @inheritdoc
	 */
	public end(index: number): SetIterator<T>

	public end(index: number = -1): SetIterator<T>
	{
		if (index == -1)
			return super.end();
		else
			return this.hash_buckets_.at(index).back().next();
	}

	/**
	 * @inheritdoc
	 */
	public rbegin(): SetReverseIterator<T>;

	/**
	 * @inheritdoc
	 */
	public rbegin(index: number): SetReverseIterator<T>;

	public rbegin(index: number = -1): SetReverseIterator<T>
	{
		if (index == -1)
			return super.rbegin();
		else
			return new SetReverseIterator<T>(this.end(index));
	}

	/**
	 * @inheritdoc
	 */
	public rend(): SetReverseIterator<T>;

	/**
	 * @inheritdoc
	 */
	public rend(index: number): SetReverseIterator<T>;

	public rend(index: number = -1): SetReverseIterator<T>
	{
		if (index == -1)
			return super.rend();
		else
			return new SetReverseIterator<T>(this.begin(index));
	}

	/* ---------------------------------------------------------
		HASH
	--------------------------------------------------------- */
	/**
	 * @inheritdoc
	 */
	public bucket_count(): number
	{
		return this.hash_buckets_.size();
	}

	/**
	 * @inheritdoc
	 */
	public bucket_size(n: number): number
	{
		return this.hash_buckets_.at(n).size();
	}

	/**
	 * @inheritdoc
	 */
	public max_load_factor(): number;

	/**
	 * @inheritdoc
	 */
	public max_load_factor(z: number): void;

	public max_load_factor(z: number = -1): any
	{
		if (z == -1)
			return this.size() / this.bucket_count();
		else
			this.rehash(Math.ceil(this.bucket_count() / z));
	}

	/**
	 * @inheritdoc
	 */
	public bucket(key: T): number
	{
		return hash(key) % this.hash_buckets_.size();
	}

	/**
	 * @inheritdoc
	 */
	public reserve(n: number): void
	{
		this.hash_buckets_.rehash(Math.ceil(n * this.max_load_factor()));
	}

	/**
	 * @inheritdoc
	 */
	public rehash(n: number): void
	{
		if (n <= this.bucket_count())
			return;

		this.hash_buckets_.rehash(n);
	}

	/* =========================================================
		ELEMENTS I/O
			- INSERT
			- POST-PROCESS
			- SWAP
	============================================================
		INSERT
	--------------------------------------------------------- */
	/**
	 * @hidden
	 */
	protected _Insert_by_val(val: T): any
	{
		// INSERT
		let it = this["data_"].insert(this["data_"].end(), val);

		this._Handle_insert(it, it.next()); // POST-PROCESS
		return it;
	}

	/**
	 * @hidden
	 */
	protected _Insert_by_hint(hint: SetIterator<T>, val: T): SetIterator<T>
	{
		// INSERT
		let it = this["data_"].insert(hint, val);

		// POST-PROCESS
		this._Handle_insert(it, it.next());

		return it;
	}

	/**
	 * @hidden
	 */
	protected _Insert_by_range<U extends T, InputIterator extends Iterator<U>>
		(first: InputIterator, last: InputIterator): void
	{
		// INSERT ELEMENTS
		let my_first = this["data_"].insert(this["data_"].end(), first, last);

		// IF NEEDED, HASH_BUCKET TO HAVE SUITABLE SIZE
		if (this.size() > this.hash_buckets_.item_size() * _Hash.MAX_RATIO)
			this.hash_buckets_.rehash(this.size() * _Hash.RATIO);

		// POST-PROCESS
		this._Handle_insert(my_first, this.end());
	}

	/* ---------------------------------------------------------
		POST-PROCESS
	--------------------------------------------------------- */
	/**
	 * @hidden
	 */
	protected _Handle_insert(first: SetIterator<T>, last: SetIterator<T>): void
	{
		for (; !first.equals(last); first = first.next())
			this.hash_buckets_.insert(first);
	}

	/**
	 * @hidden
	 */
	protected _Handle_erase(first: SetIterator<T>, last: SetIterator<T>): void
	{
		for (; !first.equals(last); first = first.next())
			this.hash_buckets_.erase(first);
	}

	/* ---------------------------------------------------------
		SWAP
	--------------------------------------------------------- */
	/**
	 * <p> Swap content. </p>
	 * 
	 * <p> Exchanges the content of the container by the content of <i>obj</i>, which is another 
	 * {@link HashMultiSet set} of the same type. Sizes abd container type may differ. </p>
	 * 
	 * <p> After the call to this member function, the elements in this container are those which were 
	 * in <i>obj</i> before the call, and the elements of <i>obj</i> are those which were in this. All 
	 * iterators, references and pointers remain valid for the swapped objects. </p>
	 *
	 * <p> Notice that a non-member function exists with the same name, {@link swap swap}, overloading that 
	 * algorithm with an optimization that behaves like this member function. </p>
	 * 
	 * @param obj Another {@link HashMultiSet set container} of the same type of elements as this (i.e.,
	 *			  with the same template parameters, <b>Key</b> and <b>T</b>) whose content is swapped 
	 *			  with that of this {@link HashMultiSet container}.
	 */
	public swap(obj: HashMultiSet<T>): void;

	/**
	 * @inheritdoc
	 */
	public swap(obj: Container<T>): void;

	public swap(obj: HashMultiSet<T> | Container<T>): void
	{
		if (obj instanceof HashMultiSet)
		{
			this._Swap(obj);
			[this.hash_buckets_, obj.hash_buckets_] = [obj.hash_buckets_, this.hash_buckets_];
		}
		else
			super.swap(obj);
	}
}