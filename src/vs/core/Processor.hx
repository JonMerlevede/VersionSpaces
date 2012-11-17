package vs.core;

/**
 * Enum containing the different processing modes of this processor. Depending on the
 * processing mode of the processor, words processed by the processor are Concepts
 * or ExtendedConcepts.
 *
 * The processing mode used depends on the version space language structure, which
 * is defined by the structure of examples and the given concept hierarchies.
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
 * @see Statement
 * @see ExtendedConcept
 * @see Concept
 *
 */
import vs.parse.DotConceptParser;
using StringTools;

#if js
    import vs.io.JavascriptIO;
#end


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
    private var mode : Mode;
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
		mode = DotConceptParser.determineMode(sampleInput);
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
        versionSpace = vs;
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

    public function processQuestions() : Void {
        #if js
        var Io = cast(Main.IO,JavascriptIO);
        var questionString = Io.getQuestions();
        Io.debugln("Processing questionstring: " + questionString);
        if (questionString.trim() == "") {
            Io.writeln("You have to enter questions.");
            Main.IO.flush();
            return;
        }
        // This should not be possible, since this method can only be called if there
        // already is an instance of the processor, which should mean the version space
        // has been created.
        if (versionSpace == null) {
            Io.writeln("You have to derive the version space first.");
            Main.IO.flush();
            return;
        }
        Io.writeln("Answering questions using version space");
        versionSpace.print();
        var questions : Iterable<Statement<Dynamic>>;
        switch (mode) {
            case Mode.EXTENDED :
                Io.debugln("Extended mode detected.");
                questions = DotConceptParser.processQuestionExtended(questionString,concepts);
            case Mode.REGULAR :
                Io.debugln("Regular mode detected.");
                questions = DotConceptParser.processQuestionRegular(questionString,concepts);
        }
        Io.debugln("Questions found: " + questions);
        for (question in questions) {
            Io.write("Version space contains " + question + ": ");
            switch (versionSpace.contains(question)) {
                case VersionSpace.ContainmentStatus.YES :
                    Io.writeln("true");
                case VersionSpace.ContainmentStatus.NO :
                    Io.writeln("false");
                case VersionSpace.ContainmentStatus.MAYBE :
                    Io.writeln("maybe");
            }
        }
        #end
    }

	public static function moo() {
	
	}

/**
    * Method that starts processing.
**/
	public static function process() {
		#if js
			var Io = cast(Main.IO,JavascriptIO);
			Io.clear();
		#end
		instance = new Processor();
	}
/**
    * Method that should only be called from Javascript.
**/
    public static function question() {
        #if js
			var Io = cast(Main.IO,JavascriptIO);
			Io.clear();
            if (instance == null) {
                Io.writeln("You have to derive the version space first.");
                Main.IO.flush();
                return;
            }
            Main.IO.debugln("Answering questions.");
            instance.processQuestions();
        #end
        Main.IO.flush();
    }
}