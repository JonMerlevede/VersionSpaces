package ;

import js.Lib;

/**
 * ...
 * @author Jonathan Merlevede
 */

class Main {
	public static var IO (getIO, never) : IIO;
	#if js
		private static var _IO = new JavascriptIO();
	#end
	public static function getIO() : IIO {
		return _IO;
	}
	
	
	private function dummyStructure() {
		Main.IO.writeln("Initializing");
		var empty = new Concept("empty");
		var blue = new Concept("blue");
		var green = new Concept("green");
		var red = new Concept("red");
		var orange = new Concept("orange");
		var purple = new Concept("purple");
		var mono = new Concept("mono");
		var poly = new Concept("poly");
		var all = new Concept("all");
		Main.IO.writeln("Created concepts. Inserting hierarchy...");
		empty.addParents([blue, green, red, orange, purple]);
		mono.addChildren([blue, green, red]);
		poly.addChildren([orange, purple]);
		all.addChildren([mono, poly]);
		Main.IO.writeln("Hierarchy created. Creating version space...");
		var vs : VersionSpace<Concept> = new VersionSpace(all, empty);
		Main.IO.writeln("Starting...");
		vs.print(IO.writeln);
		Main.IO.writeln("Adding red...");
		vs.add(red);
		vs.print(IO.writeln);
		Main.IO.writeln("Substracting purple...");
		vs.substract(purple);
		vs.print(IO.writeln);
		Main.IO.writeln("Adding blue...");
		vs.add(blue);
		vs.print(IO.writeln);
	}
	
	private function dummyStructure2() {
		var emptyTijd = new Concept("emptyTijd");
		var voormiddag = new Concept("voormiddag");
		var namiddag = new Concept("namiddag");
		var avond =  new Concept("avond");
		var nacht = new Concept("nacht");
		var empty = new Concept("empty");
		var blue = new Concept("blue");
		var green = new Concept("green");
		var red = new Concept("red");
		var orange = new Concept("orange");
		var purple = new Concept("purple");
		var mono = new Concept("mono");
		var poly = new Concept("poly");
		var all = new Concept("all");
	}
	
	static function main() {
		Processor.moo();
		ExtendedConcept.moo();
		// do nothing; wait for event to trigger
	}
}