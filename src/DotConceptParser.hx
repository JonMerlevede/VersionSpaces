package ;

class DotConceptParser {
//	public var concepts : Hash<Concept>;

//	public function new() {
//		concepts = new Hash<Concept>();
//	}
	
	public static function processConcepts(string : String) : Hash<Concept> {
		var lines = string.split("\n");
		Logger.debug("Lines: " + lines);
		var concepts : Hash<Concept> = new Hash<Concept>();
		var i = 0;
		for (line in lines) {
			i++;
			Logger.debug("Processing line: " + line);
			var connection = line.split("->");
			if (connection.length != 2) {
				if (!Helper.isEmptyLine(line))
					Logger.warn("Ignoring line " + i + " (" + line + ")"); 
				continue;
			}
			connection[0] = StringTools.trim(connection[0]);
			connection[1] = StringTools.trim(connection[1]);
			var parent : Concept, child : Concept;
			if (concepts.exists(connection[0]))
				child = concepts.get(connection[0]);
			else {
				child = new Concept(connection[0]);
				concepts.set(child.name,child);
			}
			if (concepts.exists(connection[1]))
				parent = concepts.get(connection[1]);
			else {
				parent = new Concept(connection[1]);
				concepts.set(parent.name,parent);
			}
			parent.addChild(child);
		}
		return concepts;
	}
	
	public static function processInput(string : String, concepts : Hash<Concept>) : Iterable<Sample> {
		var lines = string.split("\n");
		var examples : List<Sample> = new List<Sample>();
		var i = 0;
		for (line in lines) {
			i++;
			line = StringTools.trim(line);
			var type : String = line.substr(0,1);
			var conceptKey : String = StringTools.trim(line.substr(1));
			if (type == "-") {
				var tmp : Sample = {type : Sample.Type.NegativeSample, concept : concepts.get(conceptKey)};
				examples.add(tmp);
			} else if (type == "+") {
				var tmp : Sample = {type : Sample.Type.PositiveSample, concept : concepts.get(conceptKey)}; 
				examples.add(tmp);
			} else {
				if (!Helper.isEmptyLine(line))
					Logger.warn("Ignoring sample " + i + " (" + line + ")");
			}
		}
		return examples;
	}
}