package ;
import cpp.Lib;

/**
 * ...
 * @author Jonathan Merlevede
 */

class CppIO implements IIO
{
	public function new() {
		
	}
	
	public function writeln(m : String) {
		Lib.println(m);
	}
	public function write(m : String) {
		Lib.print(m);
	}
	public function debug(m : String) {
		//write(m);
	}
	public function debugln(m : String) {
		//writeln(m);
	}
	public function error(m : String) {
		//write(m);
	}
	public function errorln(m : String) {
		writeln(m);
	}
	public function warn(m : String) {
		write(m);
	}
	public function warnln(m : String) {
		writeln(m);
	}
	
	public function getStructure() : String {
		// TODO
		return "";
	}
	public function getSamples() : String {
		// TODO
		return "";
	}
}