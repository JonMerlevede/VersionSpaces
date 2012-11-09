/**
 * Type that represents the two most extreme concepts in a Statement hierarchy.
 * 'All' is a statement that contains all other statements in the hierarchy.
 * 'Empty' is a statement that contains only itself, and that is contained by all other statements in the hierarchy.
 * Every valid statement hierarchy has exactly one Extreme.
 * 
 * @author Jonathan Merlevede
 */
typedef Extremes<T : Statement<T>> = {
	var all : T;
	var empty : T;
}