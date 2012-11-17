package vs.io;

/**
 * IO processor to be used with the Javascript target.
 * 
 * @author Jonathan Merlevede
 */
class JavascriptIO implements IIO
{
	private var output_id : String;
	private var sb : StringBuf;
	
	private static inline var STRUCTURE_ID = 'structure';
	private static inline var SAMPLE_ID = 'sample';
    private static inline var QUESTIONS_ID = 'questions';

	public function new() {
		output_id = "output";
		sb = new StringBuf();
	}
	
	public function writeln(m : String) : Void {
		sb.add(m);
		sb.add("<br />");
        // Uncomment this line for debugging.
//		js.Lib.document.getElementById(output_id).innerHTML = sb.toString();
	}
	
	public function write(m : String) : Void {
		sb.add(m);
        // Uncomment this line for debugging.
//		js.Lib.document.getElementById(output_id).innerHTML = sb.toString();
	}
	
	public inline function debug(m : String) : Void {
        // Uncomment these lines for debugging.
//		write('<span class="debug">');
//		write(m);
//		write('</span>');
	}
	
	public inline function debugln(m : String) : Void {
        // Uncomment these lines for debugging.
//		write('<span class="debug">');
//		write(m);
//		writeln('</span>');
	}
	
	public function error(m ) {
		write('<span class="error">');
		write(m);
		write('</span>');
	}
	public function errorln(m) {
		write('<span class="error">');
		write(m);
		writeln('</span>');
	}	
	public function warn(m) {
		write(m);
	}
	public function warnln(m) {
		writeln(m);
	}
	
	public function flush() {
		js.Lib.document.getElementById(output_id).innerHTML = sb.toString();
	}
	
	public function clear() {
		sb = new StringBuf();
		js.Lib.document.getElementById(output_id).innerHTML = "";
	}
	
	public function getStructure() : String {
		return untyped js.Lib.document.getElementById(STRUCTURE_ID).value;
	}
	
	public function getSamples() : String {
		return untyped js.Lib.document.getElementById(SAMPLE_ID).value;
	}

    public function getQuestions() : String {
        return untyped js.Lib.document.getElementById(QUESTIONS_ID).value;
    }
}