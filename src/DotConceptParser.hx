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