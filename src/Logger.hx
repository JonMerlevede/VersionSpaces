package ;

class Logger {
	static inline var OUTPUT_ID = "output";
	static var sb : StringBuf = new StringBuf();
	
	public static function write(m) {log(m);}
	public inline static function debug(m) {//log('<span class="debug">' + m + '</span>');
	}
	public inline static function debugInline(m) {//logInline('<span class="debug">' + m + '</span>');
	}
	public static function error(m) {log(m);}
	public static function warn(m) {log(m);}
	public static function logInline(message : String) {
		sb.add(message);
		js.Lib.document.getElementById(OUTPUT_ID).innerHTML = sb.toString();
//			js.Lib.document.getElementById(OUTPUT_ID).innerHTML + "<br />" + message;
	}
	public static function log(message : String) {
		sb.add(message);
		sb.add("<br />");
		js.Lib.document.getElementById(OUTPUT_ID).innerHTML = sb.toString();
//			js.Lib.document.getElementById(OUTPUT_ID).innerHTML + "<br />" + message;
	}
	public static function clear() {
		sb = new StringBuf();
		js.Lib.document.getElementById(OUTPUT_ID).innerHTML = "";
	}
}