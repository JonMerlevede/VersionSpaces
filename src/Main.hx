package ;

import js.Lib;

/**
 * ...
 * @author Jonathan Merlevede
 */

class Main {
	static inline function log(message) { Logger.log(message); }
	
	private function dummyStructure() {
		log("Initializing");
		var empty : Concept = new Concept("empty");
		var blue : Concept = new Concept("blue");
		var green : Concept = new Concept("green");
		var red : Concept = new Concept("red");
		var orange : Concept = new Concept("orange");
		var purple : Concept = new Concept("purple");
		var mono : Concept = new Concept("mono");
		var poly : Concept = new Concept("poly");
		var all :Concept = new Concept("all");
		log("Created concepts. Inserting hierarchy...");
		empty.addParents([blue, green, red, orange, purple]);
		mono.addChildren([blue, green, red]);
		poly.addChildren([orange, purple]);
		all.addChildren([mono, poly]);
		log("Hierarchy created. Creating version space...");
		var vs : VersionSpace<Concept> = new VersionSpace(all, empty);
		log("Starting...");
		vs.print(log);
		log("Adding red...");
		vs.add(red);
		vs.print(log);
		log("Substracting purple...");
		vs.substract(purple);
		vs.print(log);
		log("Adding blue...");
		vs.add(blue);
		vs.print(log);
	}
	
	private function dummyStructure2() {
		var emptyTijd = new Concept("emptyTijd");
		var voormiddag = new Concept("voormiddag");
		var namiddag = new Concept("namiddag");
		var avond =  new Concept("avond");
		var nacht = new Concept("nacht");
		
		var empty : Concept = new Concept("empty");
		var blue : Concept = new Concept("blue");
		var green : Concept = new Concept("green");
		var red : Concept = new Concept("red");
		var orange : Concept = new Concept("orange");
		var purple : Concept = new Concept("purple");
		var mono : Concept = new Concept("mono");
		var poly : Concept = new Concept("poly");
		var all :Concept = new Concept("all");
	}
	
	static function main() {
		Processor.moo();
		ExtendedConcept.moo();
		// do nothing; wait for event to trigger
	}
}