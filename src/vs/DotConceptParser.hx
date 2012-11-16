package vs;

/**
 * Utility class that can process concept and structure strings.
 * 
 * @author Jonathan Merlevede
 */
class DotConceptParser {
	
	public static function processConcepts(string : String) : Hash<Concept> {
		var lines = string.split("\n");
		Main.IO.debugln("Lines: " + lines);
		var concepts : Hash<Concept> = new Hash<Concept>();
		var i = 0;
		for (line in lines) {
			i++;
			Main.IO.debugln("Processing line: " + line);
			var connection = line.split("->");
			if (connection.length != 2) {
				if (!Helper.isEmptyLine(line))
					Main.IO.warnln("Ignoring line " + i + " (" + line + ")"); 
				continue;
			}
			
			var childKey = StringTools.trim(connection[0]);
//			connection[1] = StringTools.trim(connection[1]);
			var child : Concept, parent : Concept;
			if (concepts.exists(childKey))
				child = concepts.get(childKey);
			else {
				child = new Concept(childKey);
				concepts.set(child.name,child);
			}
			var parentKeys = connection[1].split(",");
			for (val in parentKeys) {
				var parentKey = StringTools.trim(val);
				if (concepts.exists(parentKey))
					parent = concepts.get(parentKey);
				else {
					parent = new Concept(parentKey);
					concepts.set(parent.name,parent);
				}
				parent.addChild(child);
			}
		}
		return concepts;
	}
	
	public static function determineMode(samples : String) : Processor.Mode {
		if (Helper.containsChar(samples,'['))
			return Processor.Mode.EXTENDED;
		else
			return Processor.Mode.REGULAR;
	}
	
	private static function processInput <T : Statement<T>> (string : String, f : String -> T) : Iterable<Sample<T>>{
		var lines = string.split("\n");
		var examples : List<Sample<T>> = new List<Sample<T>>();
		var i = 0;
		for (line in lines) {
			i++;
			line = StringTools.trim(line);
			var type : String = line.substr(0,1);
			var statementString : String = StringTools.trim(line.substr(1));
			if (type == "-") {
				var tmp : Sample<T> = {type : Sample.Type.NegativeSample, concept : f(statementString)};
				examples.add(tmp);
			} else if (type == "+") {
				var tmp : Sample<T> = {type : Sample.Type.PositiveSample, concept : f(statementString)}; 
				examples.add(tmp);
			} else {
				if (!Helper.isEmptyLine(line))
					Main.IO.warnln("Ignoring sample " + i + " (" + line + ")");
			}
		}
		return examples;
	}
	
	public static function processInputRegular(string : String, allConcepts : Hash<Concept>) : Iterable<Sample<Concept>> {
		return processInput(string, function (conceptKey : String) : Concept {
			return allConcepts.get(conceptKey);
		});
	}
	
	public static function processInputExtended(string : String, allConcepts : Hash<Concept>) : Iterable<Sample<ExtendedConcept>> {
		return processInput(string, function (extendedConceptString : String) : ExtendedConcept {
			extendedConceptString = extendedConceptString.substr(1,extendedConceptString.length - 2); // remove [ and ]
			var conceptKeys = extendedConceptString.split('.'); // explode on .
			Main.IO.debugln("Processing extended concept " + conceptKeys + ".");
			var concepts : List<Concept> = new List<Concept>(); // process concepts and create extended concepts
			for (key in conceptKeys) {
				Main.IO.debugln("Looking up key " + key);
				concepts.add(allConcepts.get(key));
			}
			var ec = new ExtendedConcept(concepts);
			Main.IO.debugln("Created extended concept " + ec);
			return ec;
		});
//		var lines = string.split("\n");
//		var examples : List<
	}
}