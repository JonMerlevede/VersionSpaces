package ;
#if cpp
	import cpp.Lib;
#end

/**
 * ...
 * @author Jonathan Merlevede
 */

class Main {
	public static var IO (getIO, never) : IIO;
	#if js
		private static var _IO = new JavascriptIO();
	#elseif cpp
		private static var _IO = new CppIO();
	#end
	public static function getIO() : IIO {
		return _IO;
	}
	private function new() {
		
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
		vs.print();
		Main.IO.writeln("Adding red...");
		vs.add(red);
		vs.print();
		Main.IO.writeln("Substracting purple...");
		vs.substract(purple);
		vs.print();
		Main.IO.writeln("Adding blue...");
		vs.add(blue);
		vs.print();
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
		#if js
			Processor.moo();
			ExtendedConcept.moo();
			// do nothing; wait for event to trigger
		#elseif cpp
			var a = new Main();
			if (Sys.args().length < 2)
				a.dummyStructure();
			else {
				//IO.warnln("Arguments: " + Sys.args());
				_IO.structurePath = Sys.args()[0];
				_IO.samplePath = Sys.args()[1];
				if (Sys.args().length > 2) {
					_IO.writeToFile = true;
					_IO.outputPath = Sys.args()[2];
					Lib.println("Writing to file " + _IO.outputPath);
				}
				IO.writeln("Structure path: " + _IO.structurePath);
				IO.writeln("Sample path: " + _IO.samplePath);
				Processor.process();
				Lib.println("Done!");
			}
		#end
	}
}