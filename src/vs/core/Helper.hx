package vs.core;

/**
 * Utility class that contains some helper functions not specific to any application domain.
 * 
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
	
	public static function cloneIterable<T> (list : Iterable<T>) : List<T> {
		var newList = new List<T>();
		for (val in list) {
			newList.add(val);
		}
		return newList;
	}
	
	public static function cloneHash<T> (hash : Hash<T>) : Hash<T> {
		var newHash = new Hash<T>();
		for (key in hash.keys()) {
			newHash.set(key,hash.get(key));
		}
		return newHash;
	}
	
	public static function isEmptyLine(str : String) {
		return (StringTools.trim(str).length == 0);
	}
	
	public static function containsChar(str : String, char : String) {
		if (char.length != 1)
			throw 'Only works for characters';
		var i = 0;
		while (i < str.length) {
			if (str.charAt(i)== char)
				return true;
			i++;
		}
		return false;
	}
}