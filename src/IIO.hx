package ;

interface IIO {
	public function writeln(m : String) : Void;
	public function write(m : String) : Void;
	public function debug(m : String) : Void;
	public function debugln(m : String) : Void;
	public function error(m : String) : Void;
	public function errorln(m : String) : Void;
	public function warn(m : String) : Void;
	public function warnln(m : String) : Void;
	public function getStructure() : String;
	public function getSamples() : String;
	public function flush() : Void;
}