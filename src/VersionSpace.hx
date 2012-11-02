package ;

/**
 * ...
 * @author Jonathan Merlevede
 */

typedef Extremes = {
	var all : Concept;
	var empty : Concept;
}

class VersionSpace {
	
	public var G (default,null) : Hash<Concept>;
	public var S (default,null) : Hash<Concept>;
	
	public static function searchExtremes(concepts : Iterable<Concept>) : Extremes {
		var all : Concept = null;
		var empty : Concept = null;
		for (concept in concepts) {
			if (concept.numberOfParents == 0) {
				if (all != null)
					throw "Disconnected structure! Two heads.";
				all = concept;
			}
			if (concept.numberOfChildren == 0) {
				if (empty != null)
					throw "Disconnected structure! Two bottoms.";
				empty = concept;
			}
		}
		if (all == null)
			throw "Invalid structure! No all.";
		if (empty == null)
			throw "Invalid structure! No empty.";
		return { all : all, empty : empty };
	}
	
	public function new (mostGeneral : Concept, mostSpecific : Concept) {
		G = new Hash<Concept>();
		G.set(mostGeneral.name,mostGeneral);
		S = new Hash<Concept>();
		S.set(mostSpecific.name,mostSpecific);
	}
	
	public function add(concept : Concept) : Void {
		// The boundary defined by S needs to be raised.
		// Positive examples ==> generalization
		var toRemove = new List<Concept>();
		var toAdd = new List<Concept>();
		for (val in S) {
			toRemove.add(val);
			for (generalised in val.generalise(concept))
				toAdd.add(generalised);
		}
		for (val in toRemove)
			S.remove(val.name); // note that val.name is the key of val in S
		for (val in toAdd)
			S.set(val.name,val);
		// All the elements in G always need to contain all elements in S
		sanitizeVersionSpace();
	}
	
	public function substract(concept : Concept) : Void {
		// The boundary defined by G needs to be lowered.
		// Negative examples ==> specialization
		var toRemove = new List<Concept>();
		var toAdd = new List<Concept>();
		for (val in G) {
			toRemove.add(val);
			for (specialised in val.specialise(concept))
				toAdd.add(specialised);
		}
		for (val in toRemove)
			G.remove(val.name); // note that val.name is the key of val in G
		for (val in toAdd)
			G.set(val.name,val);	
		// All the elements in G always need to contain all elements in S
		sanitizeVersionSpace();
	}
	
	private function sanitizeVersionSpace() : Void {
		// All the elements in G always need to contain all elements in S
		var toRemove = new List<Concept>();
		for (general in G) {
			for (specific in S) {
				if (!general.contains(specific)) {
					toRemove.add(general);
				}
			}
		}
		for (val in toRemove)
			G.remove(val.name);
	}
	
	public function ms(hc : Hash<Concept>) : String {
		var rv : String = "{";
		var iter = hc.keys();
		while (iter.hasNext()) {
			var next = iter.next();
			rv += next;
			if (iter.hasNext())
				rv += ", ";
		}
		return (rv + "}");
	}
	
	public function print(printf : String->Void) {
		printf('The Version Space is now defined by: <div class="vs">G: ' + ms(G) + "<br />   S: " + ms(S) + '</div>');
	}
}