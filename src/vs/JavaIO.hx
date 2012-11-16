package vs;

import java.io.File;
//import sys.io.File;
import java.io.RandomAccessFile;
import java.lang.System;
/**
 * ...
 * @author Kristof Peeters
 */

class JavaIO implements IIO
{

	public var structurePath (default, default) : String;
	public var samplePath (default, default) : String;
	
	public function new() 
	{
		
	}
	
	public function writeln(m : String) : Void {
		System.out.println(m);
	}
	
	public function write(m : String) : Void {
		System.out.print(m);
	}
	
	public function debug(m : String) : Void {
		
	}
	
	public function debugln(m : String) : Void {
		
	}
	
	public function error(m : String) : Void {
		
	}
	
	public function errorln(m : String) : Void {
		
	}
	
	public function warn(m : String) : Void {
		
	}
	
	public function warnln(m : String) : Void {
		
	}
	
	public function getStructure() : String {
		//return File.getContent(structurePath);
		return readFile(structurePath);
	}
	
	public function getSamples() : String {
		//return File.getContent(samplePath);
		return readFile(samplePath);
	}
	
	private function readFile(pathName: String) : String {
		try {
			var a: File = new File(pathName);
			var b: RandomAccessFile = new RandomAccessFile(a, "r");
		
			var strLine: String;
			var result = new StringBuf();
			//var result: String = "";
			
			while ((strLine = b.readLine()) != null)   {
				result.add(strLine + "\n");
			}
			
			return result.toString();
		}
		catch (e : Dynamic) {
			return "";
		}
	}
	
	public function flush() : Void {
		
	}
	
	
}