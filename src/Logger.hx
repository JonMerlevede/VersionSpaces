package ;

class Logger {
	static inline var OUTPUT_ID = "output";
	
	public static function write(m) {log(m);}
	public inline static function debug(m) {//log(m);
	}
	public static function error(m) {log(m);}
	public static function warn(m) {log(m);}
	public static function log(message : String) {
		js.Lib.document.getElementById(OUTPUT_ID).innerHTML =
			js.Lib.document.getElementById(OUTPUT_ID).innerHTML + "<br />" + message;
	}
}