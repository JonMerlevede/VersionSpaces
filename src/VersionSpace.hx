package ;

/**
 * ...
 * @author Jonathan Merlevede
 */
class VersionSpace<T : Statement<T>> {
	
	public var G (default,null) : List<T>;
	public var S (default,null) : List<T>;
	
	public static function searchExtremes <T : Statement<T>> (statements : Iterable<T>) : Extremes<T> {
		var all : T = null;
		var empty : T = null;
		for (statement in statements) {
			if (statement.isAll()) {
				if (all != null)
					throw "Disconnected structure! Two heads.";
				all = statement;
			}
			if (statement.isEmpty()) {
				if (empty != null)
					throw "Disconnected structure! Two bottoms.";
				empty = statement;
			}
		}
		if (all == null)
			throw "Invalid structure! No all.";
		if (empty == null)
			throw "Invalid structure! No empty.";
		return { all : all, empty : empty };
	}
	
	public function new (mostGeneral : T, mostSpecific : T) {
		G = new List<T>();
		G.add(mostGeneral);
		S = new List<T>();
		S.add(mostSpecific);
	}
	
	public function add(statement : T) : Void {
		// The boundary defined by S needs to be raised.
		// Positive examples ==> generalization
		var newS = new List<T>();
		for (val in S) {
			for (generalised in val.generalise(statement)) {
				Main.IO.debugln('Adding generalised statements: ' + generalised);
				newS.add(generalised);
			}
		}
		S = newS;
		sanitizeVersionSpace();
	}
	
	public function substract(statement : T) : Void {
		// The boundary defined by G needs to be lowered.
		// Negative examples ==> specialization
		var newG = new List<T>();
		for (val in G) {
			for (specialised in val.specialise(statement)) {
				Main.IO.debugln('Adding specialised statements: ' + specialised);
				newG.add(specialised);
			}
		}
		G = newG;
		sanitizeVersionSpace();
	}
	
	private function sanitizeVersionSpace() : Void {
		S = StatementHelper.sanitiseGeneralisations(S);
		// NOT --- All the elements in G always need to contain all elements in S
		// No element in S can be more general than any element in G.
		var newG : List<T> = new List<T>();
		for (general in G) {
			for (specific in S) {
				if (!general.contains(specific))
					continue;
				newG.add(general);
//				if (specific.contains(general) && specific != general)
//					continue;
//				newG.add(general);
//				if (general.contains(specific)) {
//					newG.add(general);
//					continue;
//				}
//				if (!specific.contains(general)) {
//					newG.add(general);
//					continue;
//				}
			}
		}
		G = StatementHelper.sanitiseSpecialisations(newG);
	}
	
	public function ms(hc : Hash<Statement<T>>) : String {
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
	
	public function print() {
		Main.IO.writeln('The Version Space is now defined by:');
		#if js
			Main.IO.write('<div class="vs">');
		#end
		Main.IO.writeln('   G: ' + G);
		Main.IO.writeln("   S: " + S);
		#if js
			Main.IO.write('</div>');
		#end
	}
}