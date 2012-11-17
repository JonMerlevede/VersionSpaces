package vs.parse;

/**
 * Utility class that can process concept and structure strings.
 *
 * All methods in this class should be static.
 * This class has not state.
 *
 * @author Jonathan Merlevede
 */
import vs.core.Statement;
import vs.core.ExtendedConcept;
import vs.core.Sample;
import vs.core.Concept;
import vs.core.Processor;
import vs.core.Sample;
import vs.core.Helper;

class DotConceptParser {
/**
    * This class should never be initialized.
**/
	private function new () {

    }

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
	
	public static function determineMode(samples : String) : vs.core.Processor.Mode {
		if (Helper.containsChar(samples,'['))
			return vs.core.Processor.Mode.EXTENDED;
		else
			return vs.core.Processor.Mode.REGULAR;
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
				var tmp : Sample<T> = {type : Type.NegativeSample, concept : f(statementString)};
				examples.add(tmp);
			} else if (type == "+") {
				var tmp : Sample<T> = {type : Type.PositiveSample, concept : f(statementString)};
				examples.add(tmp);
			} else {
				if (!Helper.isEmptyLine(line))
					Main.IO.warnln("Ignoring sample " + i + " (" + line + ")");
			}
		}
		return examples;
	}

    private static function processQuestions <T : Statement<T>> (string : String, f : String -> T) : Iterable<T>{
        var lines = string.split("\n");
        var examples : List<T> = new List<T>();
        var i = 0;
        for (line in lines) {
            i++;
            if (Helper.isEmptyLine(line)) {
                Main.IO.warnln("Ignoring sample " + i + " (" + line + ")");
                continue;
            }
            line = StringTools.trim(line);
            examples.add(f(line));
        }
        return examples;
    }

    private static function decodeExtended (allConcepts : Hash<Concept>) : String -> ExtendedConcept {
        return function (extendedConceptString : String) : ExtendedConcept {
            if (extendedConceptString.charAt(0) == "[")
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
        }
    }

    private static function decodeSimple (allConcepts : Hash<Concept> ) : String -> Concept {
        return function (conceptKey : String) : Concept {
            return allConcepts.get(conceptKey);
        }
    }


	public static function processInputRegular(string : String, allConcepts : Hash<Concept>) : Iterable<Sample<Concept>> {
		return processInput(string, decodeSimple(allConcepts));
	}
	
	public static function processInputExtended(string : String, allConcepts : Hash<Concept>) : Iterable<Sample<ExtendedConcept>> {
		return processInput(string, decodeExtended(allConcepts));
	}

    public static function processQuestionRegular(string : String, allConcepts : Hash<Concept>) : Iterable<Concept> {
        return processQuestions(string, decodeSimple(allConcepts));
    }

    public static function processQuestionExtended(string : String, allConcepts : Hash<Concept>) : Iterable<ExtendedConcept> {
        return processQuestions(string, decodeExtended(allConcepts));
    }

}