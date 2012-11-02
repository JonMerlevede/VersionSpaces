var $estr = function() { return js.Boot.__string_rec(this,''); };
var Concept = function(name) {
	this.name = name;
	this.children = new List();
	this.parents = new List();
};
Concept.__name__ = true;
Concept.prototype = {
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
		var rv = new Hash();
		var $it0 = this.children.iterator();
		while( $it0.hasNext() ) {
			var child = $it0.next();
			var specialisations = child.specialise(concept);
			var $it1 = specialisations.iterator();
			while( $it1.hasNext() ) {
				var v = $it1.next();
				rv.set(v.name,v);
			}
		}
		var toRemove = new List();
		var $it2 = rv.keys();
		while( $it2.hasNext() ) {
			var conceptKey = $it2.next();
			var concept1 = rv.get(conceptKey);
			var $it3 = rv.iterator();
			while( $it3.hasNext() ) {
				var concept2 = $it3.next();
				if(concept1 == concept2) continue;
				if(concept2.contains(concept1)) toRemove.add(conceptKey);
			}
		}
		var $it4 = toRemove.iterator();
		while( $it4.hasNext() ) {
			var val = $it4.next();
			rv.remove(val);
		}
		return Helper.hashToList(rv);
	}
	,generalise: function(concept) {
		if(this.contains(concept)) {
			var tmp = new List();
			tmp.add(this);
			return tmp;
		}
		var rv = new Hash();
		var $it0 = this.parents.iterator();
		while( $it0.hasNext() ) {
			var parent = $it0.next();
			var generalisations = parent.generalise(concept);
			var $it1 = generalisations.iterator();
			while( $it1.hasNext() ) {
				var v = $it1.next();
				rv.set(v.name,v);
			}
		}
		var toRemove = new List();
		var $it2 = rv.keys();
		while( $it2.hasNext() ) {
			var conceptKey = $it2.next();
			var concept1 = rv.get(conceptKey);
			var $it3 = rv.iterator();
			while( $it3.hasNext() ) {
				var concept2 = $it3.next();
				if(concept1 == concept2) continue;
				if(concept1.contains(concept2)) toRemove.add(conceptKey);
			}
		}
		var $it4 = toRemove.iterator();
		while( $it4.hasNext() ) {
			var val = $it4.next();
			rv.remove(val);
		}
		return Helper.hashToList(rv);
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
	,getNumberOfChildren: function() {
		return this.children.length;
	}
	,getNumberOfParents: function() {
		return this.parents.length;
	}
	,__class__: Concept
}
var DotConceptParser = function() { }
DotConceptParser.__name__ = true;
DotConceptParser.processConcepts = function(string) {
	var lines = string.split("\n");
	var concepts = new Hash();
	var i = 0;
	var _g = 0;
	while(_g < lines.length) {
		var line = lines[_g];
		++_g;
		i++;
		var connection = line.split("->");
		if(connection.length != 2) {
			if(!Helper.isEmptyLine(line)) Logger.warn("Ignoring line " + i + " (" + line + ")");
			continue;
		}
		connection[0] = StringTools.trim(connection[0]);
		connection[1] = StringTools.trim(connection[1]);
		var parent, child;
		if(concepts.exists(connection[0])) child = concepts.get(connection[0]); else {
			child = new Concept(connection[0]);
			concepts.set(child.name,child);
		}
		if(concepts.exists(connection[1])) parent = concepts.get(connection[1]); else {
			parent = new Concept(connection[1]);
			concepts.set(parent.name,parent);
		}
		parent.addChild(child);
	}
	return concepts;
}
DotConceptParser.processInput = function(string,concepts) {
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
		var conceptKey = StringTools.trim(HxOverrides.substr(line,1,null));
		if(type == "-") {
			var tmp = { type : Type.NegativeSample, concept : concepts.get(conceptKey)};
			examples.add(tmp);
		} else if(type == "+") {
			var tmp = { type : Type.PositiveSample, concept : concepts.get(conceptKey)};
			examples.add(tmp);
		} else if(!Helper.isEmptyLine(line)) Logger.warn("Ignoring sample " + i + " (" + line + ")");
	}
	return examples;
}
var Hash = function() {
	this.h = { };
};
Hash.__name__ = true;
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
	,__class__: Hash
}
var Helper = function() { }
Helper.__name__ = true;
Helper.hashToList = function(hash) {
	var list = new List();
	var $it0 = hash.iterator();
	while( $it0.hasNext() ) {
		var val = $it0.next();
		list.add(val);
	}
	return list;
}
Helper.isEmptyLine = function(str) {
	return StringTools.trim(str).length == 0;
}
var HxOverrides = function() { }
HxOverrides.__name__ = true;
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
var IntIter = function(min,max) {
	this.min = min;
	this.max = max;
};
IntIter.__name__ = true;
IntIter.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,__class__: IntIter
}
var List = function() {
	this.length = 0;
};
List.__name__ = true;
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
	,__class__: List
}
var Logger = function() { }
Logger.__name__ = true;
Logger.write = function(m) {
	Logger.log(m);
}
Logger.debug = function(m) {
}
Logger.error = function(m) {
	Logger.log(m);
}
Logger.warn = function(m) {
	Logger.log(m);
}
Logger.log = function(message) {
	js.Lib.document.getElementById("output").innerHTML = js.Lib.document.getElementById("output").innerHTML + "<br />" + message;
}
var Main = function() { }
Main.__name__ = true;
Main.log = function(message) {
	Logger.log(message);
}
Main.main = function() {
	Processor.moo();
}
Main.prototype = {
	dummyStructure: function() {
		Logger.log("Initializing");
		var empty = new Concept("empty");
		var blue = new Concept("blue");
		var green = new Concept("green");
		var red = new Concept("red");
		var orange = new Concept("orange");
		var purple = new Concept("purple");
		var mono = new Concept("mono");
		var poly = new Concept("poly");
		var all = new Concept("all");
		Logger.log("Created concepts. Inserting hierarchy...");
		empty.addParents([blue,green,red,orange,purple]);
		mono.addChildren([blue,green,red]);
		poly.addChildren([orange,purple]);
		all.addChildren([mono,poly]);
		Logger.log("Hierarchy created. Creating version space...");
		var vs = new VersionSpace(all,empty);
		Logger.log("Starting...");
		vs.print(Main.log);
		Logger.log("Adding red...");
		vs.add(red);
		vs.print(Main.log);
		Logger.log("Substracting purple...");
		vs.substract(purple);
		vs.print(Main.log);
		Logger.log("Adding blue...");
		vs.add(blue);
		vs.print(Main.log);
	}
	,__class__: Main
}
var Processor = function() {
	try {
		this.processFormInputs();
	} catch( msg ) {
		if( js.Boot.__instanceof(msg,String) ) {
			Logger.error(msg);
		} else throw(msg);
	}
};
Processor.__name__ = true;
Processor.moo = function() {
}
Processor.process = function() {
	new Processor();
}
Processor.prototype = {
	processFormInputs: function() {
		var structureInput = js.Lib.document.getElementById("structure").value;
		var sampleInput = js.Lib.document.getElementById("sample").value;
		var concepts = DotConceptParser.processConcepts(structureInput);
		var extremes = VersionSpace.searchExtremes(concepts);
		var vs = new VersionSpace(extremes.all,extremes.empty);
		vs.print(Logger.log);
		var $it0 = $iterator(DotConceptParser.processInput(sampleInput,concepts))();
		while( $it0.hasNext() ) {
			var sample = $it0.next();
			switch( (sample.type)[1] ) {
			case 1:
				Logger.write("Substracting concept " + Std.string(sample.concept));
				vs.substract(sample.concept);
				vs.print(Logger.log);
				break;
			case 0:
				Logger.write("Adding concept " + Std.string(sample.concept));
				vs.add(sample.concept);
				vs.print(Logger.log);
				break;
			}
		}
	}
	,__class__: Processor
}
var Type = { __ename__ : true, __constructs__ : ["PositiveSample","NegativeSample"] }
Type.PositiveSample = ["PositiveSample",0];
Type.PositiveSample.toString = $estr;
Type.PositiveSample.__enum__ = Type;
Type.NegativeSample = ["NegativeSample",1];
Type.NegativeSample.toString = $estr;
Type.NegativeSample.__enum__ = Type;
var Std = function() { }
Std.__name__ = true;
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
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = true;
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
	,__class__: StringBuf
}
var StringTools = function() { }
StringTools.__name__ = true;
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
var VersionSpace = function(mostGeneral,mostSpecific) {
	this.G = new Hash();
	this.G.set(mostGeneral.name,mostGeneral);
	this.S = new Hash();
	this.S.set(mostSpecific.name,mostSpecific);
};
VersionSpace.__name__ = true;
VersionSpace.searchExtremes = function(concepts) {
	var all = null;
	var empty = null;
	var $it0 = $iterator(concepts)();
	while( $it0.hasNext() ) {
		var concept = $it0.next();
		if(concept.getNumberOfParents() == 0) {
			if(all != null) throw "Disconnected structure! Two heads.";
			all = concept;
		}
		if(concept.getNumberOfChildren() == 0) {
			if(empty != null) throw "Disconnected structure! Two bottoms.";
			empty = concept;
		}
	}
	if(all == null) throw "Invalid structure! No all.";
	if(empty == null) throw "Invalid structure! No empty.";
	return { all : all, empty : empty};
}
VersionSpace.prototype = {
	print: function(printf) {
		printf("The Version Space now contains: <br />   G: " + this.ms(this.G) + "<br />   S: " + this.ms(this.S) + "<br />");
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
		var toRemove = new List();
		var $it0 = this.G.iterator();
		while( $it0.hasNext() ) {
			var general = $it0.next();
			var $it1 = this.S.iterator();
			while( $it1.hasNext() ) {
				var specific = $it1.next();
				if(!general.contains(specific)) toRemove.add(general);
			}
		}
		var $it2 = toRemove.iterator();
		while( $it2.hasNext() ) {
			var val = $it2.next();
			this.G.remove(val.name);
		}
	}
	,substract: function(concept) {
		var toRemove = new List();
		var toAdd = new List();
		var $it0 = this.G.iterator();
		while( $it0.hasNext() ) {
			var val = $it0.next();
			toRemove.add(val);
			var $it1 = val.specialise(concept).iterator();
			while( $it1.hasNext() ) {
				var specialised = $it1.next();
				toAdd.add(specialised);
			}
		}
		var $it2 = toRemove.iterator();
		while( $it2.hasNext() ) {
			var val = $it2.next();
			this.G.remove(val.name);
		}
		var $it3 = toAdd.iterator();
		while( $it3.hasNext() ) {
			var val = $it3.next();
			this.G.set(val.name,val);
		}
		this.sanitizeVersionSpace();
	}
	,add: function(concept) {
		var toRemove = new List();
		var toAdd = new List();
		var $it0 = this.S.iterator();
		while( $it0.hasNext() ) {
			var val = $it0.next();
			toRemove.add(val);
			var $it1 = val.generalise(concept).iterator();
			while( $it1.hasNext() ) {
				var generalised = $it1.next();
				toAdd.add(generalised);
			}
		}
		var $it2 = toRemove.iterator();
		while( $it2.hasNext() ) {
			var val = $it2.next();
			this.S.remove(val.name);
		}
		var $it3 = toAdd.iterator();
		while( $it3.hasNext() ) {
			var val = $it3.next();
			this.S.set(val.name,val);
		}
		this.sanitizeVersionSpace();
	}
	,__class__: VersionSpace
}
var js = js || {}
js.Boot = function() { }
js.Boot.__name__ = true;
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
js.Lib = function() { }
js.Lib.__name__ = true;
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
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = String;
String.__name__ = true;
Array.prototype.__class__ = Array;
Array.__name__ = true;
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
var Void = { __ename__ : ["Void"]};
if(typeof document != "undefined") js.Lib.document = document;
if(typeof window != "undefined") {
	js.Lib.window = window;
	js.Lib.window.onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if(f == null) return false;
		return f(msg,[url + ":" + line]);
	};
}
Logger.OUTPUT_ID = "output";
Processor.STRUCTURE_ID = "structure";
Processor.SAMPLE_ID = "sample";
Main.main();
