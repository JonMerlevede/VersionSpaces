package ;
#if cpp
	import cpp.Lib;
#end

/**
 * This is the main class of the Version Spaces project.
 * 
 * Main is really supposed to be a static class, but static classes are not
 * supported as such by Haxe.
 * 
 * @author Jonathan Merlevede
 */

class Main {
	/**
	 * Handle to the IIO object of this main.
	 * A different class implementing IIO is used for different targets.
	 * Casting the IO object based on target should be avoided.
	 * 
	 * @return	The IIO object that can be used for this project.
	 */
	public static var IO (getIO, never) : IIO;
	private static var _IO : IIO;
	public static function getIO() : IIO {
		return _IO;
	}
	
	/**
	 * Initializes a new Main object.
	 * Main objects are not supposed to exist...
	 * Main is a static class.
	 */
	private function new() {
		
	}
	
	/**
	 * Just a sample dummy structure and examples.
	 * Enables the core of the program to be tested without depending on the input parser.
	 */
	private static inline function dummyStructure() {
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
	
	/**
	 * Just a sample dummy structure and examples.
	 * Enables the core of the program to be tested without depending on the input parser.
	 */
	private static inline function dummyStructure2() {
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
	
	static function start_java() {
	}
	
	/**
	 * Starting point in the case of the C++ target.
	 * 
	 * This method initializes the IIO object of the Main class and starts processing the input.
	 * 
	 * Behavior depends on the number of command-line arguments.
	 * <ul>
	 * <li>
	 * 		nargs < 2
	 * 			standard, sample concept tree and examples are processed. Output goes to the console.
	 * </li><li>
	 * 		nargs = 2
	 * 			the first argument should point to a text file containing the structure definition.
	 * 			the second argument should point to a text file containing examples.
	 * 			The given structure and examples are parsed. Output is sent to the console.
	 * </li><li>
	 * 		nargs > 2:
	 * 			The first and second argument are assumed to be as in the case of two parameters.
	 * 			The third argument should point to an existing text file,
	 * 			whose contents are flushed and replaced by the output of the algorithm.
	 * </li>
	 * </ul>
	 */
	private static inline function start_cpp() {
		// For some reason this if is necessary if we still want to be able to compile to different targets.
		// TODO investigate if this does not get burdonsome with larger multi-target software.
		#if cpp
		//var a = new Main();
		Main._IO = new CppIO();
		if (Sys.args().length < 2)
			Main.dummyStructure();
		else {
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
	
	/**
	 * Starting point in the case of the Javascript target.
	 * This function initializes the IIO object of the Main class.
	 * 
	 * It also calls the Processor.moo() and ExtendedConcept.moo() functions.
	 * Functionally, these calls do absolutely nothing.
	 * If these calls are left out, Processor and ExtendedConcept are left out of the compilation.
	 * 
	 * The Version Space processor is not called from here, but is instead
	 * called by pressing the "Derive" button in the application's webinterface.
	 */
	private static inline function start_js() {
		
		#if js
		Main._IO = new JavascriptIO();
		Processor.moo();
		ExtendedConcept.moo();
		// do nothing; wait for event to trigger
		#end
	}
	
	/**
	 * Starting point of the program. Its implementation is dependent of the target platform.
	 * <ul>
	 * 		<li>See start_js() for the Javascript target.</li>
	 * 		<li>See start_cpp() for the C++ target.</li>
	 * 		<li>See start_java() for the Java target.</li>
	 * </ul>
	 * Other targets are not currently supported.
	 */
	static function main() {
		#if js
			start_js();
		#elseif cpp
			start_cpp();
		#elseif java
			start_java();
		#end
	}
}