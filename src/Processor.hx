package ;

class Processor {
	static inline var STRUCTURE_ID = "structure";
	static inline var SAMPLE_ID = "sample";
	
	public function new() {
//		var structure = js.Lib.
//		js.Lib.document.getElementById(SAMPLE_ID).
		
//		var sample = js.Lib.document.getElementById(SAMPLE_ID).innerHTML;
//		js.Lib.alert(structure);
		try {
			processFormInputs();
		} catch (msg : String) {
			Logger.error(msg);
		}
	}
	
	public function processFormInputs() {
		Logger.debug("Reading input..."); 
		var structureInput : String = untyped js.Lib.document.getElementById(STRUCTURE_ID).value;
		var sampleInput : String = untyped js.Lib.document.getElementById(SAMPLE_ID).value;
		Logger.debug("   Structure input: " + structureInput);
		Logger.debug("   Sample input: " + sampleInput);
		Logger.debug("Processing input...");
		var concepts : Hash<Concept> = DotConceptParser.processConcepts(structureInput);
		Logger.debug("Concepts found: " + concepts);
		var extremes : VersionSpace.Extremes = VersionSpace.searchExtremes(concepts);
		Logger.debug("Extremes found: " + extremes);
		var vs : VersionSpace = new VersionSpace(extremes.all, extremes.empty);
		vs.print(Logger.log);
		for (sample in DotConceptParser.processInput(sampleInput, concepts)) {
			switch (sample.type) {
				case Sample.Type.NegativeSample:
					Logger.write("Substracting concept " + sample.concept);
					vs.substract(sample.concept);
					vs.print(Logger.log);
				case Sample.Type.PositiveSample:
					Logger.write("Adding concept " + sample.concept);
					vs.add(sample.concept);
					vs.print(Logger.log);
			}				
		}
	}
	
	public static function moo() {
	
	}
	
	public static function process() {
		new Processor();
	}
}