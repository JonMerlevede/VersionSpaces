// TODO T needs to implement Statement. Is it possible to formalise this?
interface Statement<T> {
	function contains(stm : T) : Bool;
	function generalise(stm : T) : List<T>;
	function specialise(stm : T) : List<T>;
	function isAll() : Bool;
	function isEmpty() : Bool;
	function toString() : String;
}