/**
 * Helper class that contains helper functions
 * that are probably usefull for all classes implementing Statement.
 * 
 * This class should be static, but static classes are not supported by Haxe.
 * 
 * @author Jonathan Merlevede
 */
class StatementHelper {
	// Returns the most specific generalisatinos in the given list of generalisations.
	// (i.e. returns a list that is the given list with the general generalisations removed)
	public static function sanitiseGeneralisations<T : Statement<T>> (generalisedStatements : List<T>) : List<T> {
		var newList : List<T> = new List<T>();
		for (stm in generalisedStatements) {
			var add : Bool = true;
			for (stm2 in generalisedStatements) {
				if (stm == stm2)
					continue;
				if (stm.contains(stm2)){
					add = false;
					break;
				}
			}
			if (add)
				newList.add(stm);
		}
		return newList;
	}

	// Returns the most general specialisations in the given list of specialisations.
	// (i.e. returns a list that is the given list with the specific generalisations removed)
	public static function sanitiseSpecialisations<T : Statement<T>>(specialisedStatements: List<T>) : List<T> {
		var newList : List<T> = new List<T>();
		for (stm in specialisedStatements) {
			var add : Bool = true;
			for (stm2 in specialisedStatements) {
				if (stm == stm2)
					continue;
				if (stm2.contains(stm)){
					add = false;
					break;
				}
			}
			if (add)
				newList.add(stm);
		}
		return newList;
	}
}