package ;

/**
 * Class representing a concept.
 * 
 * @author Jonathan Merlevede
 */
class Concept implements Statement<Concept> {
	public var name(default, null) : String;
	public var children(default, null) : List<Concept>;
	public var parents(default, null) : List<Concept>;
	public var numberOfParents(getNumberOfParents, never) : Int;
	public var numberOfChildren(getNumberOfChildren, never) : Int;
	
	public static function searchExtremes(concept : Concept) : Extremes<Concept> {
		var all : Concept = concept;
		var empty : Concept = concept;
		while (all.parents.length != 0)
			all = all.parents.first();
		while (empty.children.length != 0)
			empty = empty.children.first();
		return { all : all, empty : empty };
	}
	
	public function isAll() : Bool {
		return (this.parents.length == 0);
	}
	
	public function isEmpty() : Bool {
		return (this.children.length == 0);
	}
	
	private function getNumberOfParents() {
		return parents.length;
	}
	private function getNumberOfChildren() {
		return children.length;
	}
	
	// The name is supposed to be unique.
	public function new(name : String) {
		this.name = name;
		children = new List<Concept>();
		parents = new List<Concept>();
	}
	
	public function pure() : Concept {
		return this;
	}
	
	public function toString() {
		return name;
	}
	
	public function addChild(child : Concept) : Void {
		this.children.add(child);
		child.parents.add(this);
	}
	
	public function addParent(parent : Concept) : Void {
		this.parents.add(parent);
		parent.children.add(this);
	}
	
	public function addChildren(children : Iterable<Concept>) : Void {
		for (child in children)
			addChild(child);
	}
	
	public function addParents(parents : Iterable<Concept>) : Void {
		for (parent in parents)
			addParent(parent);
	}
	
	public function generalise(concept : Concept) : List<Concept> {
		Main.IO.debug('Generalising from ' + this + '...');
		// BASE CASE: if this concept already contains the concept no generalization is necessary
		if (contains(concept)) {
			Main.IO.debugln('match');
			var tmp = new List<Concept>();
			tmp.add(this);
			return tmp;
		}
		// RECURSION CASE : generalise this concept until the given concept is contained
		Main.IO.debugln('no match; recursing');
		var generalisations = new List<Concept>();
		for (parent in parents) {
			var gs = parent.generalise(concept);
			for (g in gs)
				generalisations.add(g);
		}
		Main.IO.debugln('Sanitising ' + generalisations);
		generalisations = StatementHelper.sanitiseGeneralisations(generalisations);
		Main.IO.debugln('Sanitised: ' + generalisations);
		return generalisations;
	}
	
	public function specialise(concept : Concept) : List<Concept> {
		// BASE CASE
		// If the given concept is not contained by this concept, return this concept
		if (!contains(concept)) {
			var tmp = new List<Concept>();
			tmp.add(this);
			return tmp;
		}
		// RECURSION
		// Specialize this concept until the given concept is no longer contained
		var specialisations = new List<Concept>();
		for (child in children) {
			var ss = child.specialise(concept);
			for (s in ss)
				specialisations.add(s);
		}
		specialisations = StatementHelper.sanitiseSpecialisations(specialisations);
		return specialisations;
		// Remove specialized concepts from the array
//		var toRemove = new List<String>();
//		for (conceptKey in rv.keys()) {
//			var concept = rv.get(conceptKey);
//			for (concept2 in rv) {
//				if (concept == concept2)
//					continue;
//				if (concept2.contains(concept)) {
//					toRemove.add(conceptKey);
////					rv.remove(conceptKey);
//				}
//			}
//		}
//		for (val in toRemove)
//			rv.remove(val);
	}
	
	public function contains(concept : Concept) : Bool {
		// BASE CASE: a concept contains itself
		if (concept == this)
			return true;
		// RECURSION CASE: a concept contains all concepts of its children
		for (child in children) {
			if (child.contains(concept))
				return true;
		}
		return false;
	}
}