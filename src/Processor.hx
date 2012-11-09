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
			Main.IO.writeln("Computation took " + timeStr + "ms.");
			Main.IO.flush();
		} catch (msg : String) {
			Main.IO.errorln(msg);
		}
	}
	
	private var concepts : Hash<Concept>;
	private var structureInput : String;
	private var sampleInput : String;
	
	public function processFormInputs() {
		Main.IO.debugln("Reading input..."); 
		structureInput = Main.IO.getStructure();
		sampleInput = Main.IO.getSamples();
		Main.IO.debugln("   Structure input: " + structureInput);
		Main.IO.debugln("   Sample input: " + sampleInput);
		Main.IO.debugln("Processing input...");
		concepts = DotConceptParser.processConcepts(structureInput);
		Main.IO.debugln("Concepts found: " + concepts);
		var mode : Mode = DotConceptParser.determineMode(sampleInput);
		switch(mode) {
			case Mode.EXTENDED:
				Main.IO.writeln("Extended mode detected.");
				processExtendedConcepts();
			case Mode.REGULAR:
				Main.IO.writeln("Regular mode detected.");
				processConcepts();
		}
	}
	
	private function processConcepts() {
		var firstConcept = concepts.get(concepts.keys().next());
		var extremes : Extremes<Concept> = Concept.searchExtremes(firstConcept);
		Main.IO.debugln("Extremes found: " + extremes);
		var vs : VersionSpace<Concept> = new VersionSpace(extremes.all, extremes.empty);
		vs.print(Main.IO.writeln);
		for (sample in DotConceptParser.processInputRegular(sampleInput, concepts)) {
			switch (sample.type) {
				case Sample.Type.NegativeSample:
					Main.IO.writeln('Substracting concept ' + sample.concept);
					vs.substract(sample.concept);
					vs.print(Main.IO.writeln);
				case Sample.Type.PositiveSample:
					Main.IO.writeln('Adding concept ' + sample.concept);
					vs.add(sample.concept);
					vs.print(Main.IO.writeln);
			}
		}
	}
	
	private function processExtendedConcepts() {
		var extendedSamples : Iterable<Sample<EC>> = DotConceptParser.processInputExtended(sampleInput, concepts);
		Main.IO.debugln("Samples found.");
		var firstSample = extendedSamples.iterator().next().concept;
		var extremes : Extremes<EC> = EC.searchExtremes(firstSample);
		Main.IO.debugln("Extremes found: " + extremes);
		var vs : VersionSpace<EC> = new VersionSpace(extremes.all, extremes.empty);
		vs.print(Main.IO.writeln);
		for (sample in extendedSamples) {
			switch (sample.type) {
				case Sample.Type.NegativeSample:
					Main.IO.writeln('Substracting concept ' + sample.concept);
					vs.substract(sample.concept);
					vs.print(Main.IO.writeln);
				case Sample.Type.PositiveSample:
					Main.IO.writeln('Adding concept ' + sample.concept);
					vs.add(sample.concept);
					vs.print(Main.IO.writeln);
			}
		}
//		var firstConcept = concepts.get(concepts.keys().next());
//		var extremes : Extremes<Concept> = ExtendedConcept.searchExtremes(firstConcept);
//		Main.IO.debugln("Extremes found: " + extremes);
	}
	
	public static function moo() {
	
	}
	
	public static function process() {
		#if js
			var Io = cast(Main.IO,JavascriptIO);
			Io.clear();
		#end
		new Processor();
	}
}