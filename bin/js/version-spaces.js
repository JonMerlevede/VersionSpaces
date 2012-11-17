var $hxClasses = $hxClasses || {},$estr = function() { return js.Boot.__string_rec(this,''); };
var Hash = $hxClasses["Hash"] = function() {
	this.h = { };
};
Hash.__name__ = ["Hash"];
Hash.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += Std.string("{");
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += Std.string(" => ");
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += Std.string(", ");
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,h: null
	,__class__: Hash
}
var HxOverrides = $hxClasses["HxOverrides"] = function() { }
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IntHash = $hxClasses["IntHash"] = function() {
	this.h = { };
};
IntHash.__name__ = ["IntHash"];
IntHash.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += Std.string("{");
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += Std.string(" => ");
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += Std.string(", ");
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,get: function(key) {
		return this.h[key];
	}
	,set: function(key,value) {
		this.h[key] = value;
	}
	,h: null
	,__class__: IntHash
}
var IntIter = $hxClasses["IntIter"] = function(min,max) {
	this.min = min;
	this.max = max;
};
IntIter.__name__ = ["IntIter"];
IntIter.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,max: null
	,min: null
	,__class__: IntIter
}
var List = $hxClasses["List"] = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,filter: function(f) {
		var l2 = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			if(f(v)) l2.add(v);
		}
		return l2;
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else s.b += Std.string(sep);
			s.b += Std.string(l[0]);
			l = l[1];
		}
		return s.b;
	}
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b += Std.string("{");
		while(l != null) {
			if(first) first = false; else s.b += Std.string(", ");
			s.b += Std.string(Std.string(l[0]));
			l = l[1];
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,length: null
	,q: null
	,h: null
	,__class__: List
}
var Reflect = $hxClasses["Reflect"] = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && (v.__name__ || v.__ename__);
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
var Std = $hxClasses["Std"] = function() { }
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
var StringBuf = $hxClasses["StringBuf"] = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	toString: function() {
		return this.b;
	}
	,addSub: function(s,pos,len) {
		this.b += HxOverrides.substr(s,pos,len);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,b: null
	,__class__: StringBuf
}
var StringTools = $hxClasses["StringTools"] = function() { }
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c >= 9 && c <= 13 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		s += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		s += c;
		sl += cl;
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		ns += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		ns += c;
		sl += cl;
	}
	return ns + s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
}
StringTools.isEOF = function(c) {
	return c != c;
}
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = $hxClasses["Type"] = function() { }
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.allEnums = function(e) {
	var all = [];
	var cst = e.__constructs__;
	var _g = 0;
	while(_g < cst.length) {
		var c = cst[_g];
		++_g;
		var v = Reflect.field(e,c);
		if(!Reflect.isFunction(v)) all.push(v);
	}
	return all;
}
var haxe = haxe || {}
haxe.Log = $hxClasses["haxe.Log"] = function() { }
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe.Timer = $hxClasses["haxe.Timer"] = function(time_ms) {
	var me = this;
	this.id = window.setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
}
haxe.Timer.measure = function(f,pos) {
	var t0 = haxe.Timer.stamp();
	var r = f();
	haxe.Log.trace(haxe.Timer.stamp() - t0 + "s",pos);
	return r;
}
haxe.Timer.stamp = function() {
	return new Date().getTime() / 1000;
}
haxe.Timer.prototype = {
	run: function() {
	}
	,stop: function() {
		if(this.id == null) return;
		window.clearInterval(this.id);
		this.id = null;
	}
	,id: null
	,__class__: haxe.Timer
}
var js = js || {}
js.Boot = $hxClasses["js.Boot"] = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.isClass = function(o) {
	return o.__name__;
}
js.Boot.isEnum = function(e) {
	return e.__ename__;
}
js.Boot.getClass = function(o) {
	return o.__class__;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		if(cl == Class && o.__name__ != null) return true; else null;
		if(cl == Enum && o.__ename__ != null) return true; else null;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Lib = $hxClasses["js.Lib"] = function() { }
js.Lib.__name__ = ["js","Lib"];
js.Lib.document = null;
js.Lib.window = null;
js.Lib.debug = function() {
	debugger;
}
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib.eval = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
var vs = vs || {}
vs.Main = $hxClasses["vs.Main"] = function() {
};
vs.Main.__name__ = ["vs","Main"];
vs.Main.__properties__ = {get_IO:"getIO"}
vs.Main.IO = null;
vs.Main._IO = null;
vs.Main.getIO = function() {
	return vs.Main._IO;
}
vs.Main.dummyStructure = function() {
	vs.Main.getIO().writeln("Initializing");
	var empty = new vs.core.Concept("empty");
	var blue = new vs.core.Concept("blue");
	var green = new vs.core.Concept("green");
	var red = new vs.core.Concept("red");
	var orange = new vs.core.Concept("orange");
	var purple = new vs.core.Concept("purple");
	var mono = new vs.core.Concept("mono");
	var poly = new vs.core.Concept("poly");
	var all = new vs.core.Concept("all");
	vs.Main.getIO().writeln("Created concepts. Inserting hierarchy...");
	empty.addParents([blue,green,red,orange,purple]);
	mono.addChildren([blue,green,red]);
	poly.addChildren([orange,purple]);
	all.addChildren([mono,poly]);
	vs.Main.getIO().writeln("Hierarchy created. Creating version space...");
	var vs1 = new vs.core.VersionSpace(all,empty);
	vs.Main.getIO().writeln("Starting...");
	vs1.print();
	vs.Main.getIO().writeln("Adding red...");
	vs1.add(red);
	vs1.print();
	vs.Main.getIO().writeln("Substracting purple...");
	vs1.substract(purple);
	vs1.print();
	vs.Main.getIO().writeln("Adding blue...");
	vs1.add(blue);
	vs1.print();
}
vs.Main.dummyStructure2 = function() {
	var emptyTijd = new vs.core.Concept("emptyTijd");
	var voormiddag = new vs.core.Concept("voormiddag");
	var namiddag = new vs.core.Concept("namiddag");
	var avond = new vs.core.Concept("avond");
	var nacht = new vs.core.Concept("nacht");
	var empty = new vs.core.Concept("empty");
	var blue = new vs.core.Concept("blue");
	var green = new vs.core.Concept("green");
	var red = new vs.core.Concept("red");
	var orange = new vs.core.Concept("orange");
	var purple = new vs.core.Concept("purple");
	var mono = new vs.core.Concept("mono");
	var poly = new vs.core.Concept("poly");
	var all = new vs.core.Concept("all");
}
vs.Main.start_cpp = function() {
}
vs.Main.start_js = function() {
	vs.Main._IO = new vs.io.JavascriptIO();
	vs.core.Processor.moo();
	vs.core.ExtendedConcept.moo();
	vs.Main.dummyStructure();
}
vs.Main.start_java = function() {
}
vs.Main.main = function() {
	vs.Main._IO = new vs.io.JavascriptIO();
	vs.core.Processor.moo();
	vs.core.ExtendedConcept.moo();
	vs.Main.dummyStructure();
}
vs.Main.prototype = {
	__class__: vs.Main
}
if(!vs.core) vs.core = {}
vs.core.Statement = $hxClasses["vs.core.Statement"] = function() { }
vs.core.Statement.__name__ = ["vs","core","Statement"];
vs.core.Statement.prototype = {
	toString: null
	,isEmpty: null
	,isAll: null
	,specialise: null
	,generalise: null
	,contains: null
	,__class__: vs.core.Statement
}
vs.core.Concept = $hxClasses["vs.core.Concept"] = function(name) {
	this.name = name;
	this.children = new List();
	this.parents = new List();
};
vs.core.Concept.__name__ = ["vs","core","Concept"];
vs.core.Concept.__interfaces__ = [vs.core.Statement];
vs.core.Concept.searchExtremes = function(concept) {
	var all = concept;
	var empty = concept;
	while(all.parents.length != 0) all = all.parents.first();
	while(empty.children.length != 0) empty = empty.children.first();
	return { all : all, empty : empty};
}
vs.core.Concept.prototype = {
	contains: function(concept) {
		if(concept == this) return true;
		var $it0 = this.children.iterator();
		while( $it0.hasNext() ) {
			var child = $it0.next();
			if(child.contains(concept)) return true;
		}
		return false;
	}
	,specialise: function(concept) {
		if(!this.contains(concept)) {
			var tmp = new List();
			tmp.add(this);
			return tmp;
		}
		var specialisations = new List();
		var $it0 = this.children.iterator();
		while( $it0.hasNext() ) {
			var child = $it0.next();
			var ss = child.specialise(concept);
			var $it1 = ss.iterator();
			while( $it1.hasNext() ) {
				var s = $it1.next();
				specialisations.add(s);
			}
		}
		specialisations = vs.core.StatementHelper.sanitiseSpecialisations(specialisations);
		return specialisations;
	}
	,generalise: function(concept) {
		vs.Main.getIO().debug("Generalising from " + Std.string(this) + "...");
		if(this.contains(concept)) {
			vs.Main.getIO().debugln("match");
			var tmp = new List();
			tmp.add(this);
			return tmp;
		}
		vs.Main.getIO().debugln("no match; recursing");
		var generalisations = new List();
		var $it0 = this.parents.iterator();
		while( $it0.hasNext() ) {
			var parent = $it0.next();
			var gs = parent.generalise(concept);
			var $it1 = gs.iterator();
			while( $it1.hasNext() ) {
				var g = $it1.next();
				generalisations.add(g);
			}
		}
		vs.Main.getIO().debugln("Sanitising " + Std.string(generalisations));
		generalisations = vs.core.StatementHelper.sanitiseGeneralisations(generalisations);
		vs.Main.getIO().debugln("Sanitised: " + Std.string(generalisations));
		return generalisations;
	}
	,addParents: function(parents) {
		var $it0 = $iterator(parents)();
		while( $it0.hasNext() ) {
			var parent = $it0.next();
			this.addParent(parent);
		}
	}
	,addChildren: function(children) {
		var $it0 = $iterator(children)();
		while( $it0.hasNext() ) {
			var child = $it0.next();
			this.addChild(child);
		}
	}
	,addParent: function(parent) {
		this.parents.add(parent);
		parent.children.add(this);
	}
	,addChild: function(child) {
		this.children.add(child);
		child.parents.add(this);
	}
	,toString: function() {
		return this.name;
	}
	,pure: function() {
		return this;
	}
	,getNumberOfChildren: function() {
		return this.children.length;
	}
	,getNumberOfParents: function() {
		return this.parents.length;
	}
	,isEmpty: function() {
		return this.children.length == 0;
	}
	,isAll: function() {
		return this.parents.length == 0;
	}
	,numberOfChildren: null
	,numberOfParents: null
	,parents: null
	,children: null
	,name: null
	,__class__: vs.core.Concept
	,__properties__: {get_numberOfParents:"getNumberOfParents",get_numberOfChildren:"getNumberOfChildren"}
}
vs.core.ExtendedConcept = $hxClasses["vs.core.ExtendedConcept"] = function(concepts) {
	this.concepts = new IntHash();
	var i = 0;
	var $it0 = $iterator(concepts)();
	while( $it0.hasNext() ) {
		var concept = $it0.next();
		this.concepts.set(i,{ position : i, concept : concept});
		i++;
	}
};
vs.core.ExtendedConcept.__name__ = ["vs","core","ExtendedConcept"];
vs.core.ExtendedConcept.__interfaces__ = [vs.core.Statement];
vs.core.ExtendedConcept.moo = function() {
}
vs.core.ExtendedConcept.searchExtremes = function(extendedConcept) {
	var all = vs.core.ExtendedConcept.cloneStm(extendedConcept);
	var empty = vs.core.ExtendedConcept.cloneStm(extendedConcept);
	var $it0 = extendedConcept.concepts.iterator();
	while( $it0.hasNext() ) {
		var pConcept = $it0.next();
		var extremes = vs.core.Concept.searchExtremes(pConcept.concept);
		all.concepts.set(pConcept.position,{ position : pConcept.position, concept : extremes.all});
		empty.concepts.set(pConcept.position,{ position : pConcept.position, concept : extremes.empty});
	}
	return { all : all, empty : empty};
}
vs.core.ExtendedConcept.forEachConcept = function(stm1,stm2,f) {
	var $it0 = stm1.concepts.iterator();
	while( $it0.hasNext() ) {
		var pConcept = $it0.next();
		f(pConcept,stm2.concepts.get(pConcept.position));
	}
}
vs.core.ExtendedConcept.cloneStm = function(stm) {
	var t = new vs.core.ExtendedConcept(new List());
	var $it0 = stm.concepts.iterator();
	while( $it0.hasNext() ) {
		var pConcept = $it0.next();
		t.concepts.set(pConcept.position,pConcept);
	}
	return t;
}
vs.core.ExtendedConcept.prototype = {
	toString: function() {
		var r = "[";
		var it = this.concepts.iterator();
		while(it.hasNext()) {
			r += Std.string(it.next().concept);
			if(it.hasNext()) r += ".";
		}
		r += "]";
		return r;
	}
	,specialise: function(stm) {
		var _g = this;
		var specialisedExtendedConcepts = new List();
		vs.core.ExtendedConcept.forEachConcept(this,stm,function(cThis,cStm) {
			var basis = _g.clone();
			basis.concepts.remove(cThis.position);
			var $it0 = cThis.concept.specialise(cStm.concept).iterator();
			while( $it0.hasNext() ) {
				var specialisedConcept = $it0.next();
				var clone = vs.core.ExtendedConcept.cloneStm(basis);
				clone.concepts.set(cThis.position,{ position : cThis.position, concept : specialisedConcept});
				specialisedExtendedConcepts.add(clone);
			}
		});
		return vs.core.StatementHelper.sanitiseSpecialisations(specialisedExtendedConcepts);
	}
	,generalise: function(stm) {
		var generalisedExtendedConcepts = new List();
		vs.core.ExtendedConcept.forEachConcept(this,stm,function(cThis,cStm) {
			var generalisedConcepts = cThis.concept.generalise(cStm.concept);
			if(generalisedExtendedConcepts.length == 0) {
				var $it0 = generalisedConcepts.iterator();
				while( $it0.hasNext() ) {
					var gc = $it0.next();
					var t = new vs.core.ExtendedConcept(new List());
					t.concepts.set(cThis.position,{ position : cThis.position, concept : gc});
					generalisedExtendedConcepts.add(t);
				}
			} else {
				var toAdd = new List();
				var $it1 = generalisedExtendedConcepts.iterator();
				while( $it1.hasNext() ) {
					var g = $it1.next();
					var clone = vs.core.ExtendedConcept.cloneStm(g);
					var iter = generalisedConcepts.iterator();
					var concept = iter.next();
					g.concepts.set(cThis.position,{ position : cThis.position, concept : concept});
					while(iter.hasNext()) {
						var tmp = vs.core.ExtendedConcept.cloneStm(clone);
						concept = iter.next();
						tmp.concepts.set(cThis.position,{ position : cThis.position, concept : concept});
						toAdd.add(tmp);
					}
				}
				var $it2 = toAdd.iterator();
				while( $it2.hasNext() ) {
					var add = $it2.next();
					generalisedExtendedConcepts.add(add);
				}
			}
		});
		return vs.core.StatementHelper.sanitiseGeneralisations(generalisedExtendedConcepts);
	}
	,clone: function() {
		return vs.core.ExtendedConcept.cloneStm(this);
	}
	,pure: function() {
		return this;
	}
	,contains: function(stm) {
		var returnValue = true;
		vs.core.ExtendedConcept.forEachConcept(this,stm,function(cThis,cStm) {
			if(returnValue) {
				if(!cThis.concept.contains(cStm.concept)) returnValue = false;
			}
		});
		return returnValue;
	}
	,isEmpty: function() {
		var isEmpty = false;
		var $it0 = this.concepts.iterator();
		while( $it0.hasNext() ) {
			var pConcept = $it0.next();
			isEmpty = isEmpty || pConcept.concept.isEmpty();
		}
		return isEmpty;
	}
	,isAll: function() {
		var isNotAll = true;
		var $it0 = this.concepts.iterator();
		while( $it0.hasNext() ) {
			var pConcept = $it0.next();
			isNotAll = isNotAll && !pConcept.concept.isAll();
		}
		return !isNotAll;
	}
	,concepts: null
	,__class__: vs.core.ExtendedConcept
}
vs.core.Helper = $hxClasses["vs.core.Helper"] = function() { }
vs.core.Helper.__name__ = ["vs","core","Helper"];
vs.core.Helper.hashToList = function(hash) {
	var list = new List();
	var $it0 = hash.iterator();
	while( $it0.hasNext() ) {
		var val = $it0.next();
		list.add(val);
	}
	return list;
}
vs.core.Helper.cloneIterable = function(list) {
	var newList = new List();
	var $it0 = $iterator(list)();
	while( $it0.hasNext() ) {
		var val = $it0.next();
		newList.add(val);
	}
	return newList;
}
vs.core.Helper.cloneHash = function(hash) {
	var newHash = new Hash();
	var $it0 = hash.keys();
	while( $it0.hasNext() ) {
		var key = $it0.next();
		newHash.set(key,hash.get(key));
	}
	return newHash;
}
vs.core.Helper.isEmptyLine = function(str) {
	return StringTools.trim(str).length == 0;
}
vs.core.Helper.containsChar = function(str,$char) {
	if($char.length != 1) throw "Only works for characters";
	var i = 0;
	while(i < str.length) {
		if(str.charAt(i) == $char) return true;
		i++;
	}
	return false;
}
vs.core.Mode = $hxClasses["vs.core.Mode"] = { __ename__ : ["vs","core","Mode"], __constructs__ : ["REGULAR","EXTENDED"] }
vs.core.Mode.REGULAR = ["REGULAR",0];
vs.core.Mode.REGULAR.toString = $estr;
vs.core.Mode.REGULAR.__enum__ = vs.core.Mode;
vs.core.Mode.EXTENDED = ["EXTENDED",1];
vs.core.Mode.EXTENDED.toString = $estr;
vs.core.Mode.EXTENDED.__enum__ = vs.core.Mode;
vs.core.Processor = $hxClasses["vs.core.Processor"] = function() {
	try {
		var time = haxe.Timer.stamp();
		vs.Main.getIO().debugln("Reading input...");
		this.structureInput = vs.Main.getIO().getStructure();
		this.sampleInput = vs.Main.getIO().getSamples();
		this._process();
		time = haxe.Timer.stamp() - time;
		time *= 1000;
		var timeStr = Math.round(time) + "";
		vs.Main.getIO().writeln("Computation took " + timeStr + "ms.");
		vs.Main.getIO().flush();
	} catch( msg ) {
		if( js.Boot.__instanceof(msg,String) ) {
			vs.Main.getIO().errorln(msg);
			vs.Main.getIO().flush();
		} else throw(msg);
	}
};
vs.core.Processor.__name__ = ["vs","core","Processor"];
vs.core.Processor.instance = null;
vs.core.Processor.moo = function() {
}
vs.core.Processor.process = function() {
	var Io = js.Boot.__cast(vs.Main.getIO() , vs.io.JavascriptIO);
	Io.clear();
	vs.core.Processor.instance = new vs.core.Processor();
}
vs.core.Processor.question = function() {
	var Io = js.Boot.__cast(vs.Main.getIO() , vs.io.JavascriptIO);
	Io.clear();
	if(vs.core.Processor.instance == null) {
		Io.writeln("You have to derive the version space first.");
		vs.Main.getIO().flush();
		return;
	}
	vs.Main.getIO().debugln("Answering questions.");
	vs.core.Processor.instance.processQuestions();
	vs.Main.getIO().flush();
}
vs.core.Processor.prototype = {
	processQuestions: function() {
		var Io = js.Boot.__cast(vs.Main.getIO() , vs.io.JavascriptIO);
		var questionString = Io.getQuestions();
		if(StringTools.trim(questionString) == "") {
			Io.writeln("You have to enter questions.");
			vs.Main.getIO().flush();
			return;
		}
		if(this.versionSpace == null) {
			Io.writeln("You have to derive the version space first.");
			vs.Main.getIO().flush();
			return;
		}
		Io.writeln("Answering questions using version space");
		this.versionSpace.print();
		var questions;
		switch( (this.mode)[1] ) {
		case 1:
			questions = vs.parse.DotConceptParser.processQuestionExtended(questionString,this.concepts);
			break;
		case 0:
			questions = vs.parse.DotConceptParser.processQuestionRegular(questionString,this.concepts);
			break;
		}
		var $it0 = $iterator(questions)();
		while( $it0.hasNext() ) {
			var question = $it0.next();
			Io.write("Version space contains " + Std.string(question) + ": ");
			switch( (this.versionSpace.contains(question))[1] ) {
			case 0:
				Io.writeln("true");
				break;
			case 1:
				Io.writeln("false");
				break;
			case 2:
				Io.writeln("maybe");
				break;
			}
		}
	}
	,processExtendedConcepts: function() {
		var extendedSamples = vs.parse.DotConceptParser.processInputExtended(this.sampleInput,this.concepts);
		vs.Main.getIO().debugln("Samples found.");
		var firstSample = $iterator(extendedSamples)().next().concept;
		var extremes = vs.core.ExtendedConcept.searchExtremes(firstSample);
		vs.Main.getIO().debugln("Extremes found: " + Std.string(extremes));
		var _vs = new vs.core.VersionSpace(extremes.all,extremes.empty);
		this.versionSpace = _vs;
		this.versionSpace.print();
		var $it0 = $iterator(extendedSamples)();
		while( $it0.hasNext() ) {
			var sample = $it0.next();
			switch( (sample.type)[1] ) {
			case 1:
				vs.Main.getIO().write("Substracting concept ");
				vs.Main.getIO().write("<span class=\"concept\">");
				vs.Main.getIO().write("" + Std.string(sample.concept));
				vs.Main.getIO().writeln("</span>");
				this.versionSpace.substract(sample.concept);
				this.versionSpace.print();
				break;
			case 0:
				vs.Main.getIO().writeln("Adding concept " + Std.string(sample.concept));
				this.versionSpace.add(sample.concept);
				this.versionSpace.print();
				break;
			}
		}
	}
	,processConcepts: function() {
		var firstConcept = this.concepts.get(this.concepts.keys().next());
		var extremes = vs.core.Concept.searchExtremes(firstConcept);
		vs.Main.getIO().debugln("Extremes found: " + Std.string(extremes));
		var vs1 = new vs.core.VersionSpace(extremes.all,extremes.empty);
		this.versionSpace = vs1;
		var $it0 = $iterator(vs.parse.DotConceptParser.processInputRegular(this.sampleInput,this.concepts))();
		while( $it0.hasNext() ) {
			var sample = $it0.next();
			switch( (sample.type)[1] ) {
			case 1:
				vs.Main.getIO().writeln("Substracting concept " + Std.string(sample.concept));
				this.versionSpace.substract(sample.concept);
				this.versionSpace.print();
				break;
			case 0:
				vs.Main.getIO().writeln("Adding concept " + Std.string(sample.concept));
				this.versionSpace.add(sample.concept);
				this.versionSpace.print();
				break;
			}
		}
	}
	,_process: function() {
		vs.Main.getIO().debugln("   Structure input: " + this.structureInput);
		vs.Main.getIO().debugln("   Sample input: " + this.sampleInput);
		vs.Main.getIO().debugln("Processing input...");
		this.concepts = vs.parse.DotConceptParser.processConcepts(this.structureInput);
		vs.Main.getIO().debugln("Concepts found: " + Std.string(this.concepts));
		this.mode = vs.parse.DotConceptParser.determineMode(this.sampleInput);
		switch( (this.mode)[1] ) {
		case 1:
			vs.Main.getIO().writeln("Extended mode detected.");
			this.processExtendedConcepts();
			break;
		case 0:
			vs.Main.getIO().writeln("Regular mode detected.");
			this.processConcepts();
			break;
		}
	}
	,versionSpace: null
	,mode: null
	,sampleInput: null
	,structureInput: null
	,concepts: null
	,__class__: vs.core.Processor
}
vs.core.Type = $hxClasses["vs.core.Type"] = { __ename__ : ["vs","core","Type"], __constructs__ : ["PositiveSample","NegativeSample"] }
vs.core.Type.PositiveSample = ["PositiveSample",0];
vs.core.Type.PositiveSample.toString = $estr;
vs.core.Type.PositiveSample.__enum__ = vs.core.Type;
vs.core.Type.NegativeSample = ["NegativeSample",1];
vs.core.Type.NegativeSample.toString = $estr;
vs.core.Type.NegativeSample.__enum__ = vs.core.Type;
vs.core.StatementHelper = $hxClasses["vs.core.StatementHelper"] = function() {
};
vs.core.StatementHelper.__name__ = ["vs","core","StatementHelper"];
vs.core.StatementHelper.sanitiseGeneralisations = function(generalisedStatements) {
	var newList = new List();
	var $it0 = generalisedStatements.iterator();
	while( $it0.hasNext() ) {
		var stm = $it0.next();
		var add = true;
		var $it1 = generalisedStatements.iterator();
		while( $it1.hasNext() ) {
			var stm2 = $it1.next();
			if(stm == stm2) continue;
			if(stm.contains(stm2)) {
				add = false;
				break;
			}
		}
		if(add) newList.add(stm);
	}
	return newList;
}
vs.core.StatementHelper.sanitiseSpecialisations = function(specialisedStatements) {
	var newList = new List();
	var $it0 = specialisedStatements.iterator();
	while( $it0.hasNext() ) {
		var stm = $it0.next();
		var add = true;
		var $it1 = specialisedStatements.iterator();
		while( $it1.hasNext() ) {
			var stm2 = $it1.next();
			if(stm == stm2) continue;
			if(stm2.contains(stm)) {
				add = false;
				break;
			}
		}
		if(add) newList.add(stm);
	}
	return newList;
}
vs.core.StatementHelper.prototype = {
	__class__: vs.core.StatementHelper
}
vs.core.ContainmentStatus = $hxClasses["vs.core.ContainmentStatus"] = { __ename__ : ["vs","core","ContainmentStatus"], __constructs__ : ["YES","NO","MAYBE"] }
vs.core.ContainmentStatus.YES = ["YES",0];
vs.core.ContainmentStatus.YES.toString = $estr;
vs.core.ContainmentStatus.YES.__enum__ = vs.core.ContainmentStatus;
vs.core.ContainmentStatus.NO = ["NO",1];
vs.core.ContainmentStatus.NO.toString = $estr;
vs.core.ContainmentStatus.NO.__enum__ = vs.core.ContainmentStatus;
vs.core.ContainmentStatus.MAYBE = ["MAYBE",2];
vs.core.ContainmentStatus.MAYBE.toString = $estr;
vs.core.ContainmentStatus.MAYBE.__enum__ = vs.core.ContainmentStatus;
vs.core.VersionSpace = $hxClasses["vs.core.VersionSpace"] = function(mostGeneral,mostSpecific) {
	this.G = new List();
	this.G.add(mostGeneral);
	this.S = new List();
	this.S.add(mostSpecific);
};
vs.core.VersionSpace.__name__ = ["vs","core","VersionSpace"];
vs.core.VersionSpace.searchExtremes = function(statements) {
	var all = null;
	var empty = null;
	var $it0 = $iterator(statements)();
	while( $it0.hasNext() ) {
		var statement = $it0.next();
		if(statement.isAll()) {
			if(all != null) throw "Disconnected structure! Two heads.";
			all = statement;
		}
		if(statement.isEmpty()) {
			if(empty != null) throw "Disconnected structure! Two bottoms.";
			empty = statement;
		}
	}
	if(all == null) throw "Invalid structure! No all.";
	if(empty == null) throw "Invalid structure! No empty.";
	return { all : all, empty : empty};
}
vs.core.VersionSpace.prototype = {
	print: function() {
		vs.Main.getIO().writeln("The definition of the Version Space is:");
		vs.Main.getIO().write("<div class=\"vs\">");
		vs.Main.getIO().writeln("   G: " + Std.string(this.G));
		vs.Main.getIO().writeln("   S: " + Std.string(this.S));
		vs.Main.getIO().write("</div>");
	}
	,ms: function(hc) {
		var rv = "{";
		var iter = hc.keys();
		while(iter.hasNext()) {
			var next = iter.next();
			rv += next;
			if(iter.hasNext()) rv += ", ";
		}
		return rv + "}";
	}
	,sanitizeVersionSpace: function() {
		this.S = vs.core.StatementHelper.sanitiseGeneralisations(this.S);
		var newG = new List();
		var $it0 = this.G.iterator();
		while( $it0.hasNext() ) {
			var general = $it0.next();
			var $it1 = this.S.iterator();
			while( $it1.hasNext() ) {
				var specific = $it1.next();
				if(!general.contains(specific)) continue;
				newG.add(general);
			}
		}
		this.G = vs.core.StatementHelper.sanitiseSpecialisations(newG);
	}
	,substract: function(statement) {
		var newG = new List();
		var $it0 = this.G.iterator();
		while( $it0.hasNext() ) {
			var val = $it0.next();
			var $it1 = val.specialise(statement).iterator();
			while( $it1.hasNext() ) {
				var specialised = $it1.next();
				vs.Main.getIO().debugln("Adding specialised statements: " + Std.string(specialised));
				newG.add(specialised);
			}
		}
		this.G = newG;
		this.sanitizeVersionSpace();
	}
	,add: function(statement) {
		var newS = new List();
		var $it0 = this.S.iterator();
		while( $it0.hasNext() ) {
			var val = $it0.next();
			var $it1 = val.generalise(statement).iterator();
			while( $it1.hasNext() ) {
				var generalised = $it1.next();
				vs.Main.getIO().debugln("Adding generalised statements: " + Std.string(generalised));
				newS.add(generalised);
			}
		}
		this.S = newS;
		this.sanitizeVersionSpace();
	}
	,contains: function(stm) {
		var $it0 = this.S.iterator();
		while( $it0.hasNext() ) {
			var s = $it0.next();
			if(s.contains(stm)) return vs.core.ContainmentStatus.YES;
		}
		var canContain = false;
		var $it1 = this.G.iterator();
		while( $it1.hasNext() ) {
			var s = $it1.next();
			if(s.contains(stm)) {
				canContain = true;
				break;
			}
		}
		if(!canContain) return vs.core.ContainmentStatus.NO;
		return vs.core.ContainmentStatus.MAYBE;
	}
	,S: null
	,G: null
	,__class__: vs.core.VersionSpace
}
if(!vs.io) vs.io = {}
vs.io.IIO = $hxClasses["vs.io.IIO"] = function() { }
vs.io.IIO.__name__ = ["vs","io","IIO"];
vs.io.IIO.prototype = {
	flush: null
	,getSamples: null
	,getStructure: null
	,warnln: null
	,warn: null
	,errorln: null
	,error: null
	,debugln: null
	,debug: null
	,write: null
	,writeln: null
	,__class__: vs.io.IIO
}
vs.io.JavascriptIO = $hxClasses["vs.io.JavascriptIO"] = function() {
	this.output_id = "output";
	this.sb = new StringBuf();
};
vs.io.JavascriptIO.__name__ = ["vs","io","JavascriptIO"];
vs.io.JavascriptIO.__interfaces__ = [vs.io.IIO];
vs.io.JavascriptIO.prototype = {
	getQuestions: function() {
		return js.Lib.document.getElementById("questions").value;
	}
	,getSamples: function() {
		return js.Lib.document.getElementById("sample").value;
	}
	,getStructure: function() {
		return js.Lib.document.getElementById("structure").value;
	}
	,clear: function() {
		this.sb = new StringBuf();
		js.Lib.document.getElementById(this.output_id).innerHTML = "";
	}
	,flush: function() {
		js.Lib.document.getElementById(this.output_id).innerHTML = this.sb.b;
	}
	,warnln: function(m) {
		this.writeln(m);
	}
	,warn: function(m) {
		this.write(m);
	}
	,errorln: function(m) {
		this.write("<span class=\"error\">");
		this.write(m);
		this.writeln("</span>");
	}
	,error: function(m) {
		this.write("<span class=\"error\">");
		this.write(m);
		this.write("</span>");
	}
	,debugln: function(m) {
	}
	,debug: function(m) {
	}
	,write: function(m) {
		this.sb.b += Std.string(m);
	}
	,writeln: function(m) {
		this.sb.b += Std.string(m);
		this.sb.b += Std.string("<br />");
	}
	,sb: null
	,output_id: null
	,__class__: vs.io.JavascriptIO
}
if(!vs.parse) vs.parse = {}
vs.parse.DotConceptParser = $hxClasses["vs.parse.DotConceptParser"] = function() {
};
vs.parse.DotConceptParser.__name__ = ["vs","parse","DotConceptParser"];
vs.parse.DotConceptParser.processConcepts = function(string) {
	var lines = string.split("\n");
	vs.Main.getIO().debugln("Lines: " + Std.string(lines));
	var concepts = new Hash();
	var i = 0;
	var _g = 0;
	while(_g < lines.length) {
		var line = lines[_g];
		++_g;
		i++;
		vs.Main.getIO().debugln("Processing line: " + line);
		var connection = line.split("->");
		if(connection.length != 2) {
			if(!vs.core.Helper.isEmptyLine(line)) vs.Main.getIO().warnln("Ignoring line " + i + " (" + line + ")");
			continue;
		}
		var childKey = StringTools.trim(connection[0]);
		var child, parent;
		if(concepts.exists(childKey)) child = concepts.get(childKey); else {
			child = new vs.core.Concept(childKey);
			concepts.set(child.name,child);
		}
		var parentKeys = connection[1].split(",");
		var _g1 = 0;
		while(_g1 < parentKeys.length) {
			var val = parentKeys[_g1];
			++_g1;
			var parentKey = StringTools.trim(val);
			if(concepts.exists(parentKey)) parent = concepts.get(parentKey); else {
				parent = new vs.core.Concept(parentKey);
				concepts.set(parent.name,parent);
			}
			parent.addChild(child);
		}
	}
	return concepts;
}
vs.parse.DotConceptParser.determineMode = function(samples) {
	if(vs.core.Helper.containsChar(samples,"[")) return vs.core.Mode.EXTENDED; else return vs.core.Mode.REGULAR;
}
vs.parse.DotConceptParser.processInput = function(string,f) {
	var lines = string.split("\n");
	var examples = new List();
	var i = 0;
	var _g = 0;
	while(_g < lines.length) {
		var line = lines[_g];
		++_g;
		i++;
		line = StringTools.trim(line);
		var type = HxOverrides.substr(line,0,1);
		var statementString = StringTools.trim(HxOverrides.substr(line,1,null));
		if(type == "-") {
			var tmp = { type : vs.core.Type.NegativeSample, concept : f(statementString)};
			examples.add(tmp);
		} else if(type == "+") {
			var tmp = { type : vs.core.Type.PositiveSample, concept : f(statementString)};
			examples.add(tmp);
		} else if(!vs.core.Helper.isEmptyLine(line)) vs.Main.getIO().warnln("Ignoring sample " + i + " (" + line + ")");
	}
	return examples;
}
vs.parse.DotConceptParser.processQuestions = function(string,f) {
	var lines = string.split("\n");
	var examples = new List();
	var i = 0;
	var _g = 0;
	while(_g < lines.length) {
		var line = lines[_g];
		++_g;
		i++;
		if(vs.core.Helper.isEmptyLine(line)) {
			vs.Main.getIO().warnln("Ignoring sample " + i + " (" + line + ")");
			continue;
		}
		line = StringTools.trim(line);
		examples.add(f(line));
	}
	return examples;
}
vs.parse.DotConceptParser.decodeExtended = function(allConcepts) {
	return function(extendedConceptString) {
		if(extendedConceptString.charAt(0) == "[") extendedConceptString = HxOverrides.substr(extendedConceptString,1,extendedConceptString.length - 2);
		var conceptKeys = extendedConceptString.split(".");
		vs.Main.getIO().debugln("Processing extended concept " + Std.string(conceptKeys) + ".");
		var concepts = new List();
		var _g = 0;
		while(_g < conceptKeys.length) {
			var key = conceptKeys[_g];
			++_g;
			vs.Main.getIO().debugln("Looking up key " + key);
			concepts.add(allConcepts.get(key));
		}
		var ec = new vs.core.ExtendedConcept(concepts);
		vs.Main.getIO().debugln("Created extended concept " + Std.string(ec));
		return ec;
	};
}
vs.parse.DotConceptParser.decodeSimple = function(allConcepts) {
	return function(conceptKey) {
		return allConcepts.get(conceptKey);
	};
}
vs.parse.DotConceptParser.processInputRegular = function(string,allConcepts) {
	return vs.parse.DotConceptParser.processInput(string,vs.parse.DotConceptParser.decodeSimple(allConcepts));
}
vs.parse.DotConceptParser.processInputExtended = function(string,allConcepts) {
	return vs.parse.DotConceptParser.processInput(string,vs.parse.DotConceptParser.decodeExtended(allConcepts));
}
vs.parse.DotConceptParser.processQuestionRegular = function(string,allConcepts) {
	return vs.parse.DotConceptParser.processQuestions(string,vs.parse.DotConceptParser.decodeSimple(allConcepts));
}
vs.parse.DotConceptParser.processQuestionExtended = function(string,allConcepts) {
	return vs.parse.DotConceptParser.processQuestions(string,vs.parse.DotConceptParser.decodeExtended(allConcepts));
}
vs.parse.DotConceptParser.prototype = {
	__class__: vs.parse.DotConceptParser
}
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; };
var $_;
function $bind(o,m) { var f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}; else null;
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var Void = $hxClasses.Void = { __ename__ : ["Void"]};
if(typeof document != "undefined") js.Lib.document = document;
if(typeof window != "undefined") {
	js.Lib.window = window;
	js.Lib.window.onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if(f == null) return false;
		return f(msg,[url + ":" + line]);
	};
}
js.Lib.onerror = null;
vs.io.JavascriptIO.STRUCTURE_ID = "structure";
vs.io.JavascriptIO.SAMPLE_ID = "sample";
vs.io.JavascriptIO.QUESTIONS_ID = "questions";
vs.Main.main();

//@ sourceMappingURL=bin\js\version-spaces.js.map