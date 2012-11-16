package vs;

/**
 * Enum containing the different procesing modes of this processor.
 * The processing mode used depends on the input structure and the structure of examples.
 * It is determined based on how examples look.
 * 
 * A language with a single underlying concept tree has to be parsed in 'Regular' mode.
 * A sample (or 'word') from this language looks like this:
	 * +a
 * 
 * A language with multiple underlying concept trees has to be parsed in 'Extended' mode.
 * A sample (or 'word') from this language looks like this:
	 * +[a.b.c]
 * Where a, b and c are concepts from different concept trees.
 * 
 */
enum Mode {
	REGULAR;
	EXTENDED;
}

typedef EC = ExtendedConcept;

/**
 * A Version Space processor loads structure input and sample input strings from the IIO object in Main.
 * It uses the DotConceptParser to process these strings to Concept, ExtendedConcept and Sample objects.
 * Using the generated Concept or ExtendedConcept objects, a VersionSpace object is generated.
 * The generated Sample objects are added to the VersionSpace object in the order they're defined.
 */
class Processor {
	private static var instance : Processor;
	private var concepts : Hash<Concept>;
	private var structureInput : String;
	private var sampleInput : String;
	private var versionSpace : VersionSpace<Dynamic>;
	
	/**
	 * Creates a new Version Space processor.
	 * 
	 * The creation of a Processor will automatically start processing
	 * using processMainIo(). In addition it will time how long the
	 * processing takes.
	 */
	public function new() {
		try {
			var time : Float = haxe.Timer.stamp();
			Main.IO.debugln("Reading input..."); 
			structureInput = Main.IO.getStructure();
			sampleInput = Main.IO.getSamples();
			_process();
			time = haxe.Timer.stamp() - time;
			time *= 1000;
			var timeStr : String = Math.round(time) + "";
			Main.IO.writeln("Computation took " + timeStr + "ms.");
			Main.IO.flush();
		} catch (msg : String) {
			Main.IO.errorln(msg);
			Main.IO.flush();
		}
	}
	
	/**
	 * Processes the structure and sample input defined in this processor.
	 * 
	 * Precondition: this processor's structure input (structureInput) is set and is valid
	 * Precondition: this processor's sample input (sampleInput) is set and is valid
	 * 
	 * First all concepts in this processor are parsed using
	 * DotConceptParser.processConcepts() and stored away in this.concepts.
	 * 
	 * Depending on the output Mode returned by determineMode() when supplied
	 * with the this processor's sample input, processing is continued by
	 * processConcepts() or processExtendedConcepts().
	 */
	private function _process() {
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
	
	/**
	 * Processes the structure and sample input defined in this processor.
	 * 
	 * Precondition: this processor's concepts (concepts) are set
	 * Precondition: this processor's sample input is defined
	 * Precondition: the samples described by the sample input are simple
	 * 
	 * Determines the extreme words in the language using the concepts in this processor and
	 * the first sample.
	 * Creates a version space containing the extended concepts in this.concepts
	 * Adds the samples described by the sampel input one by one.
	 */
	private function processConcepts() {
		var firstConcept = concepts.get(concepts.keys().next());
		var extremes : Extremes<Concept> = Concept.searchExtremes(firstConcept);
		Main.IO.debugln("Extremes found: " + extremes);
		var vs : VersionSpace<Concept> = new VersionSpace(extremes.all, extremes.empty);
		versionSpace.print();
		for (sample in DotConceptParser.processInputRegular(sampleInput, concepts)) {
			switch (sample.type) {
				case Sample.Type.NegativeSample:
					Main.IO.writeln('Substracting concept ' + sample.concept);
					versionSpace.substract(sample.concept);
					versionSpace.print();
				case Sample.Type.PositiveSample:
					Main.IO.writeln('Adding concept ' + sample.concept);
					versionSpace.add(sample.concept);
					versionSpace.print();
			}
		}
	}
	
	/**
	 * Processes the structure and sample input defined in this processor.
	 * 
	 * Precondition: this processor's concepts (concepts) are set
	 * Precondition: this processor's sample input is defined
	 * Precondition: the samples described by the sample input are extended
	 * 
	 * Determines the extreme words in the language using the concepts in this processor and
	 * the first sample.
	 * Creates a version space containing the extended concepts in this.concepts
	 * Adds the samples described by the sampel input one by one.
	 */

	private function processExtendedConcepts() {
		var extendedSamples : Iterable<Sample<EC>> = DotConceptParser.processInputExtended(sampleInput, concepts);
		Main.IO.debugln("Samples found.");
		var firstSample = extendedSamples.iterator().next().concept;
		var extremes : Extremes<EC> = EC.searchExtremes(firstSample);
		Main.IO.debugln("Extremes found: " + extremes);
		var _vs : VersionSpace<EC> = new VersionSpace(extremes.all, extremes.empty);
		this.versionSpace = _vs;
		versionSpace.print();
		for (sample in extendedSamples) {
			switch (sample.type) {
				case Sample.Type.NegativeSample:
					Main.IO.write('Substracting concept ');
					#if js
						Main.IO.write('<span class="concept">');
					#end
					Main.IO.write(""+sample.concept);
					#if js
						Main.IO.writeln('</span>');
					#else
						Main.IO.writeln("");
					#end
					versionSpace.substract(sample.concept);
					versionSpace.print();
				case Sample.Type.PositiveSample:
					Main.IO.writeln('Adding concept ' + sample.concept);
					versionSpace.add(sample.concept);
					versionSpace.print();
			}
		}
	}
	
	public static function moo() {
	
	}
	
	/**
	 * Method that is called from Javascript.
	 */
	public static function process() {
		#if js
			var Io = cast(Main.IO,JavascriptIO);
			Io.clear();
		#end
		instance = new Processor();
	}
}