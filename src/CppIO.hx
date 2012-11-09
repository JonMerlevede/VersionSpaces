package ;
import cpp.io.FileInput;
import cpp.Lib;
import haxe.io.Input;
import sys.io.File;

/**
 * IO processor to be used with the C++ target.
 * 
 * @author Jonathan Merlevede
 */
class CppIO implements IIO
{
	private var _writeToFile : Bool;
	public var sb : StringBuf;
	public var writeToFile (getWriteToFile, setWriteToFile) : Bool;
	public var structurePath (default, default) : String;
	public var samplePath (default, default) : String;
	public var outputPath (default, default) : String;
	
	public function new() {
		_writeToFile = false;
	}
	
	
	private function getWriteToFile() : Bool {
		return _writeToFile;
	}
	private function setWriteToFile(val : Bool) : Bool {
		_writeToFile = val;
		if (val)
			sb = new StringBuf();
		return true;
	}
	
	public function writeln(m : String) {
		if (writeToFile) {
			sb.add(m);
			sb.add("\n");
		} else
			Lib.println(m);
	}
	public function write(m : String) {
		if (writeToFile)
			sb.add(m);
		else 
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
		return File.getContent(structurePath);
	}
	public function getSamples() : String {
		return File.getContent(samplePath);
	}
	
	public function flush() {
		if (writeToFile)
			File.saveContent(outputPath, sb.toString());
	}
}