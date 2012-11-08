package ;

/**
 * ...
 * @author Jonathan Merlevede
 */

class JavascriptIO implements IIO
{
	private var output_id : String;
	private var sb : StringBuf;
	
	public function new() {
		output_id = "output";
		sb = new StringBuf();
	}
	
	public function writeln(m : String) : Void {
		sb.add(m);
		sb.add("<br />");
		//js.Lib.document.getElementById(output_id).innerHTML = sb.toString();
	}
	
	public function write(m : String) : Void {
		sb.add(m);
		//js.Lib.document.getElementById(output_id).innerHTML = sb.toString();
	}
	
	public function debug(m : String) : Void {
		write('<span class="debug">' + m + '</span>');
	}
	
	public function debugln(m : String) : Void {
		writeln('<span class="debug">' + m + '</span>');
	}
	
	public function error(m ) { write(m); }
	public function errorln(m) { writeln(m); }	
	public function warn(m) { write(m); }
	public function warnln(m) { writeln(m); }
	
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
}