package ;

/**
 * ...
 * @author Jonathan Merlevede
 */

class Helper {
	public static function hashToList<T> (hash : Hash<T>) : List<T> {
		var list = new List<T>();
		for (val in hash) {
			list.add(val);
		}
		return list;
	}
	
	public static function isEmptyLine(str : String) {
		return (StringTools.trim(str).length == 0);
	}
}