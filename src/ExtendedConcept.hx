package ;

typedef PositionedConcept = {
	var position : Int;
	var concept : Concept;
}
private typedef PC = PositionedConcept;

class ExtendedConcept implements Statement<ExtendedConcept> {
	private var concepts : IntHash<PositionedConcept>;
	
	public static function moo() : Void { 
	}
	
	public static function searchExtremes(extendedConcept : ExtendedConcept) : Extremes<ExtendedConcept> {
		var all : ExtendedConcept = cloneStm(extendedConcept);
		var empty : ExtendedConcept = cloneStm(extendedConcept);
		for (pConcept in extendedConcept.concepts) {
			var extremes : Extremes<Concept> = Concept.searchExtremes(pConcept.concept);
			all.concepts.set(
				pConcept.position,
				{position : pConcept.position, concept: extremes.all});
			empty.concepts.set(
				pConcept.position,
				{position: pConcept.position, concept: extremes.empty});
		}
		return { all : all, empty : empty };
	}
	
	public function new(concepts : Iterable<Concept>) {
		this.concepts = new IntHash<PositionedConcept>();
		var i : Int = 0;
		for (concept in concepts) { 
			this.concepts.set(i, { position : i, concept : concept });
			i++;
		}
			
	}
	
	public function isAll() : Bool {
		var isNotAll : Bool = true;
		for (pConcept in concepts)
			isNotAll = isNotAll && (!pConcept.concept.isAll());
		return !isNotAll;
	}
	
	public function isEmpty() : Bool {
		var isEmpty : Bool = false;
		for (pConcept in concepts)
			isEmpty = isEmpty || pConcept.concept.isEmpty();
		return isEmpty;
	}
	
	// Prerequisite: the given ExtendedConcept is compatible with this one.
	public function contains(stm : ExtendedConcept) : Bool {
		var returnValue : Bool = true;
		forEachConcept(this,stm,function (cThis : PC, cStm : PC) : Void {
			if (returnValue) {
				if(!cThis.concept.contains(cStm.concept))
					returnValue = false;
			}
		});
		return returnValue;
	}
	
	public function pure() : ExtendedConcept {
		return this;
	}
	
	private static function forEachConcept(stm1 : ExtendedConcept, stm2 : ExtendedConcept, f : PC -> PC -> Void) {
		for (pConcept in stm1.concepts) {
			f(pConcept, stm2.concepts.get(pConcept.position));
		}
	}
	
	public function clone() : ExtendedConcept {
		return cloneStm(this);
	}
	
	private static function cloneStm(stm : ExtendedConcept) : ExtendedConcept {
		var t = new ExtendedConcept(new List<Concept>());
		for (pConcept in stm.concepts)
			t.concepts.set(pConcept.position,pConcept);
		return t;
//		return new ExtendedConcept(Helper.cloneHash(stm.concepts));
	}
	
	public function generalise(stm : ExtendedConcept) : List<ExtendedConcept> {
		var generalisedExtendedConcepts : List<ExtendedConcept> = new List<ExtendedConcept>();
		forEachConcept(this,stm,function (cThis : PC, cStm : PC) : Void {
			var generalisedConcepts : List<Concept> = cThis.concept.generalise(cStm.concept);
			if (generalisedExtendedConcepts.length == 0) {
				for (gc in generalisedConcepts) {
					var t = new ExtendedConcept(new List<Concept>());
					t.concepts.set(cThis.position,{position: cThis.position, concept: gc});
					generalisedExtendedConcepts.add(t);
				}
			} else {
				var toAdd = new List<ExtendedConcept>();
				for (g in generalisedExtendedConcepts) {
					var clone : ExtendedConcept = cloneStm(g);
					var iter : Iterator<Concept> = generalisedConcepts.iterator();
					var concept = iter.next();
					g.concepts.set(cThis.position,{ position: cThis.position, concept: concept }); // there is always at least 1 generalisation
					while (iter.hasNext()) {
						var tmp : ExtendedConcept = cloneStm(clone);
						concept = iter.next();
						tmp.concepts.set(cThis.position, { position: cThis.position, concept: concept });
						toAdd.add(tmp);
					}
				}
				for (add in toAdd)
					generalisedExtendedConcepts.add(add);
			}
		});
//		return generalisedExtendedConcepts;
		return StatementHelper.sanitiseGeneralisations(generalisedExtendedConcepts);
//		return generalisedExtendedConcepts.sanitiseGeneralisations();
	}
	
	public function specialise(stm : ExtendedConcept) : List<ExtendedConcept> {
		var specialisedExtendedConcepts : List<ExtendedConcept> = new List<ExtendedConcept>();
		forEachConcept(this,stm,function(cThis : PC, cStm : PC) : Void {
			var basis: ExtendedConcept = clone();
			basis.concepts.remove(cThis.position);
			for (specialisedConcept in cThis.concept.specialise(cStm.concept)) {
				var clone = cloneStm(basis);
				clone.concepts.set(cThis.position,{position: cThis.position, concept: specialisedConcept});
				specialisedExtendedConcepts.add(clone);
			}
		});
		return StatementHelper.sanitiseSpecialisations(specialisedExtendedConcepts);
	}
	
	public function toString() {
		var r = "[";
		var it = concepts.iterator();
		while (it.hasNext()) {
			r += it.next().concept;
			if (it.hasNext())
				r += ".";
		}
		r += "]";
		return r;
		//return concepts + "";
	}
}