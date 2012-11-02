package ;

/**
 * ...
 * @author Jonathan Merlevede
 */

class Concept {
	public var name(default, null) : String;
	public var children(default, null) : List<Concept>;
	public var parents(default, null) : List<Concept>;
	public var numberOfParents(getNumberOfParents, never) : Int;
	public var numberOfChildren(getNumberOfChildren, never) : Int;
	
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
		// If this concept already contains the concept no generalization is necessary
		if (contains(concept)) {
			var tmp = new List<Concept>();
			tmp.add(this);
			return tmp;
		}
		// Generalise this concept until the given concept is contained
		var rv = new Hash<Concept>();
		for (parent in parents) {
			var generalisations = parent.generalise(concept);
			for (v in generalisations)
				rv.set(v.name,v);
		}
		// Remove general concepts from the array
		var toRemove= new List<String>();
		for (conceptKey in rv.keys()) {
			var concept = rv.get(conceptKey);
			for (concept2 in rv) {
				if (concept == concept2)
					continue;
				if (concept.contains(concept2))
					toRemove.add(conceptKey);
			}
		}
		for (val in toRemove)
			rv.remove(val);
		return Helper.hashToList(rv);
	}
	
	public function specialise(concept : Concept) : List<Concept> {
		// If the given concept is already not contained by this concept, return this concept
		if (!contains(concept)) {
			var tmp = new List<Concept>();
			tmp.add(this);
			return tmp;
		}
		// Specialize this concept until the given concept is no longer contained
		var rv = new Hash<Concept>();
		for (child in children) {
			var specialisations = child.specialise(concept);
			for (v in specialisations)
				rv.set(v.name,v);
		}
		// Remove specialized concepts from the array
		var toRemove = new List<String>();
		for (conceptKey in rv.keys()) {
			var concept = rv.get(conceptKey);
			for (concept2 in rv) {
				if (concept == concept2)
					continue;
				if (concept2.contains(concept)) {
					toRemove.add(conceptKey);
//					rv.remove(conceptKey);
				}
			}
		}
		for (val in toRemove)
			rv.remove(val);
		return Helper.hashToList(rv);
	}
	
	public function contains(concept : Concept) : Bool {
		// A concept always contains itself
		if (concept == this)
			return true;
		// A concept contains all concepts of its children
		// (==> does not contain the concept in the case of no children)
		for (child in children) {
			if (child.contains(concept))
				return true;
		}
		return false;
	}
}