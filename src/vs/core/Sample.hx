package vs.core;

/**
 * Type representing a sample.
 * A sample is a signed statement.
 * 
 * @author Jonathan Merlevede
 */
typedef Sample<T : Statement<T>> = {
	var type : Type;
	var concept : T;
}

/**
 * Type representing the sign of a sample.
 * Samples can be either positive or negative.
 * 
 * @author Jonathan Merlevede
 */
enum Type {
	PositiveSample;
	NegativeSample;
}