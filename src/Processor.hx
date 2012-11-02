package ;

enum Mode {
	REGULAR;
	EXTENDED;
}

typedef EC = ExtendedConcept;

class Processor {
	static inline var STRUCTURE_ID = "structure";
	static inline var SAMPLE_ID = "sample";
	
	public function new() {
		try {
			var time : Float = haxe.Timer.stamp();
			processFormInputs();
			time = haxe.Timer.stamp() - time;
			time *= 1000;
			var timeStr : String = Math.round(time) + "";
			Logger.write("Computation took " + timeStr + "ms.");
		} catch (msg : String) {
			Logger.error(msg);
		}
	}
	
	private var concepts : Hash<Concept>;
	private var structureInput : String;
	private var sampleInput : String;
	
	public function processFormInputs() {
		Logger.debug("Reading input..."); 
		structureInput = untyped js.Lib.document.getElementById(STRUCTURE_ID).value;
		sampleInput = untyped js.Lib.document.getElementById(SAMPLE_ID).value;
		Logger.debug("   Structure input: " + structureInput);
		Logger.debug("   Sample input: " + sampleInput);
		Logger.debug("Processing input...");
		concepts = DotConceptParser.processConcepts(structureInput);
		Logger.debug("Concepts found: " + concepts);
		var mode : Mode = DotConceptParser.determineMode(sampleInput);
		switch(mode) {
			case Mode.EXTENDED:
				Logger.log("Extended mode detected.");
				processExtendedConcepts();
			case Mode.REGULAR:
				Logger.log("Regular mode detected.");
				processConcepts();
		}
	}
	
	private function processConcepts() {
		var firstConcept = concepts.get(concepts.keys().next());
		var extremes : Extremes<Concept> = Concept.searchExtremes(firstConcept);
		Logger.debug("Extremes found: " + extremes);
		var vs : VersionSpace<Concept> = new VersionSpace(extremes.all, extremes.empty);
		vs.print(Logger.log);
		for (sample in DotConceptParser.processInputRegular(sampleInput, concepts)) {
			switch (sample.type) {
				case Sample.Type.NegativeSample:
					Logger.write('Substracting concept <span class="concept">' + sample.concept + '</span>');
					vs.substract(sample.concept);
					vs.print(Logger.log);
				case Sample.Type.PositiveSample:
					Logger.write('Adding concept <span class="concept">' + sample.concept + '</span>');
					vs.add(sample.concept);
					vs.print(Logger.log);
			}
		}
	}
	
	private function processExtendedConcepts() {
		var extendedSamples : Iterable<Sample<EC>> = DotConceptParser.processInputExtended(sampleInput, concepts);
		Logger.debug("Samples found.");
		var firstSample = extendedSamples.iterator().next().concept;
		var extremes : Extremes<EC> = EC.searchExtremes(firstSample);
		Logger.debug("Extremes found: " + extremes);
		var vs : VersionSpace<EC> = new VersionSpace(extremes.all, extremes.empty);
		vs.print(Logger.log);
		for (sample in extendedSamples) {
			switch (sample.type) {
				case Sample.Type.NegativeSample:
					Logger.write('Substracting concept <span class="concept">' + sample.concept + '</span>');
					vs.substract(sample.concept);
					vs.print(Logger.log);
				case Sample.Type.PositiveSample:
					Logger.write('Adding concept <span class="concept">' + sample.concept + '</span>');
					vs.add(sample.concept);
					vs.print(Logger.log);
			}
		}
//		var firstConcept = concepts.get(concepts.keys().next());
//		var extremes : Extremes<Concept> = ExtendedConcept.searchExtremes(firstConcept);
//		Logger.debug("Extremes found: " + extremes);
	}
	
	public static function moo() {
	
	}
	
	public static function process() {
		Logger.clear();
		new Processor();
	}
}