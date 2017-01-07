﻿import {IComparable, less, equal_to} from "./functional";

declare var process: {versions: {node: any}}

/**
 * <p> Running on Node. </p>
 * 
 * <p> Test whether the JavaScript is running on Node. </p>
 * 
 * @references http://stackoverflow.com/questions/17575790/environment-detection-node-js-or-browser
 */
export function is_node(): boolean
{
	if (typeof process === "object")
		if (typeof process.versions === "object")
			if (typeof process.versions.node !== "undefined")
				return true;

	return false;
}

/**
 * <p> Pair of values. </p>
 *
 * <p> This class couples together a pair of values, which may be of different types (<i>T1</i> and 
 * <i>T2</i>). The individual values can be accessed through its public members {@link first} and 
 * {@link second}. </p>
 *
 * @param <T1> Type of member {@link first}.
 * @param <T2> Type of member {@link second}.
 *
 * @reference http://www.cplusplus.com/reference/utility/pair
 * @author Jeongho Nam <http://samchon.org>
 */
export class Pair<T1, T2> implements IComparable<Pair<T1, T2>>
{
	/**
	 * <p> A first value in the Pair. </p>
	 */
	public first: T1;

	/**
	 * <p> A second value in the Pair. </p>
	 */
	public second: T2;

	/* ---------------------------------------------------------
		CONSTRUCTORS
	--------------------------------------------------------- */
	/**
	 * <p> Construct from pair values. </p>
	 *
	 * @param first The first value of the Pair
	 * @param second The second value of the Pair
	 */
	public constructor(first: T1, second: T2)
	{
		this.first = first;
		this.second = second;
	}

	/* ---------------------------------------------------------
		COMPARISON
	--------------------------------------------------------- */
	/**
	 * <p> Whether a Pair is equal with the Pair. <p>
	 * <p> Compare each first and second value of two Pair(s) and returns whether they are equal or not. </p>
	 * 
	 * <p> If stored key and value in a Pair are not number or string but an object like a class or struct, 
	 * the comparison will be executed by a member method (SomeObject)::equals(). If the object does not have 
	 * the member method equal_to(), only address of pointer will be compared. </p>
	 *
	 * @param obj A Map to compare
	 * @return Indicates whether equal or not.
	 */
	public equals<U1 extends T1, U2 extends T2>(pair: Pair<U1, U2>): boolean
	{
		return equal_to(this.first, pair.first) && equal_to(this.second, pair.second);
	}

	/**
	 * @inheritdoc
	 */
	public less<U1 extends T1, U2 extends T2>(pair: Pair<U1, U2>): boolean
	{
		if (equal_to(this.first, pair.first) == false)
			return less(this.first, pair.first);
		else
			return less(this.second, pair.second);
	}
}

/**
 * <p> Construct {@link Pair} object. </p>
 * 
 * <p> Constructs a {@link Pair} object with its {@link Pair.first first} element set to <i>x</i> and its 
 * {@link Pair.second second} element set to <i>y</i>. </p>
 * 
 * <p> The template types can be implicitly deduced from the arguments passed to {@link make_pair}. </p>
 * 
 * <p> {@link Pair} objects can be constructed from other {@link Pair} objects containing different types, if the 
 * respective types are implicitly convertible. </p>
 * 
 * @param x Value for member {@link Pair.first first}.
 * @param y Value for member {@link Pair.second second}.
 * 
 * @return A {@link Pair} object whose elements {@link Pair.first first} and {@link Pair.second second} are set to 
 *		   <i>x</i> and <i>y</i> respectivelly.
 */
export function make_pair<T1, T2>(x: T1, y: T2): Pair<T1, T2>
{
	return new Pair<T1, T2>(x, y);
}