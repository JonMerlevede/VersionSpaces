package vs.core;

/**
 * Represents a statement. Examples of statements are Concepts and ExtendedConcepts.
 *
 *
 * @author Jonathan Merlevede
 */
// TODO T needs to implement Statement. Is it possible to formalise this?
interface Statement<T> {
/**
    * Returns whether this statement contains the given statement.
    *
    * A statement always contains itself.
**/
	function contains(stm : T) : Bool;
/**
    * Minimally generalise this statement to contain the given statement.
    *
    * A minimal generalisation of this statement is a generalisation such that it contains
    * no other generalisation that also contain the given statement and this statement.
**/
    function generalise(stm : T) : List<T>;
/**
    * Minimally specialise this statement so that it does not contain the given statement.
    *
    * A minimal specialisation of this statement is a specialisation such that it is contained by
    * no other specialisation that does not contain the given statement and is contained by this statement.
**/
	function specialise(stm : T) : List<T>;
/**
    * Returns whether this statement contains all other statements in the version space
    * language.
**/
	function isAll() : Bool;
/**
    * Returns whether this statement is contained by all other statemetns in the version
    * space language.
**/
	function isEmpty() : Bool;
	function toString() : String;
}