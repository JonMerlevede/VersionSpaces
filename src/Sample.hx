package ;

typedef Sample<T : Statement<T>> = {
	var type : Type;
	var concept : T;
}

enum Type {
	PositiveSample;
	NegativeSample;
}