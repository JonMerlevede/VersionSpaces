var $estr = function() { return js.Boot.__string_rec(this,''); };
var Statement = function() { }
Statement.__name__ = true;
Statement.prototype = {
	__class__: Statement
}
var Concept = function(name) {
	this.name = name;
	this.children = new List();
	this.parents = new List();
};
Concept.__name__ = true;
Concept.__interfaces__ = [Statement];
Concept.searchExtremes = function(concept) {
	var all = concept;
	var empty = concept;
	while(all.parents.length != 0) all = all.parents.first();
	while(empty.children.length != 0) empty = empty.children.first();
	return { all : all, empty : empty};
}
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
		specialisations = StatementHelper.sanitiseSpecialisations(specialisations);
		return specialisations;
	}
	,generalise: function(concept) {
		if(this.contains(concept)) {
			var tmp = new List();
			tmp.add(this);
			return tmp;
		}
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
		generalisations = StatementHelper.sanitiseGeneralisations(generalisations);
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
		var childKey = StringTools.trim(connection[0]);
		var child, parent;
		if(concepts.exists(childKey)) child = concepts.get(childKey); else {
			child = new Concept(childKey);
			concepts.set(child.name,child);
		}
		var parentKeys = connection[1].split(",");
		var _g1 = 0;
		while(_g1 < parentKeys.length) {
			var val = parentKeys[_g1];
			++_g1;
			var parentKey = StringTools.trim(val);
			if(concepts.exists(parentKey)) parent = concepts.get(parentKey); else {
				parent = new Concept(parentKey);
				concepts.set(parent.name,parent);
			}
			parent.addChild(child);
		}
	}
	return concepts;
}
DotConceptParser.determineMode = function(samples) {
	if(Helper.containsChar(samples,"[")) return Mode.EXTENDED; else return Mode.REGULAR;
}
DotConceptParser.processInput = function(string,f) {
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
			var tmp = { type : Type.NegativeSample, concept : f(statementString)};
			examples.add(tmp);
		} else if(type == "+") {
			var tmp = { type : Type.PositiveSample, concept : f(statementString)};
			examples.add(tmp);
		} else if(!Helper.isEmptyLine(line)) Logger.warn("Ignoring sample " + i + " (" + line + ")");
	}
	return examples;
}
DotConceptParser.processInputRegular = function(string,allConcepts) {
	return DotConceptParser.processInput(string,function(conceptKey) {
		return allConcepts.get(conceptKey);
	});
}
DotConceptParser.processInputExtended = function(string,allConcepts) {
	return DotConceptParser.processInput(string,function(extendedConceptString) {
		extendedConceptString = HxOverrides.substr(extendedConceptString,1,extendedConceptString.length - 2);
		var conceptKeys = extendedConceptString.split(".");
		var concepts = new List();
		var _g = 0;
		while(_g < conceptKeys.length) {
			var key = conceptKeys[_g];
			++_g;
			concepts.add(allConcepts.get(key));
		}
		var ec = new ExtendedConcept(concepts);
		return ec;
	});
}
var ExtendedConcept = function(concepts) {
	this.concepts = new IntHash();
	var i = 0;
	var $it0 = $iterator(concepts)();
	while( $it0.hasNext() ) {
		var concept = $it0.next();
		this.concepts.set(i,{ position : i, concept : concept});
		i++;
	}
};
ExtendedConcept.__name__ = true;
ExtendedConcept.__interfaces__ = [Statement];
ExtendedConcept.moo = function() {
}
ExtendedConcept.searchExtremes = function(extendedConcept) {
	var all = ExtendedConcept.cloneStm(extendedConcept);
	var empty = ExtendedConcept.cloneStm(extendedConcept);
	var $it0 = extendedConcept.concepts.iterator();
	while( $it0.hasNext() ) {
		var pConcept = $it0.next();
		var extremes = Concept.searchExtremes(pConcept.concept);
		all.concepts.set(pConcept.position,{ position : pConcept.position, concept : extremes.all});
		empty.concepts.set(pConcept.position,{ position : pConcept.position, concept : extremes.empty});
	}
	return { all : all, empty : empty};
}
ExtendedConcept.forEachConcept = function(stm1,stm2,f) {
	var $it0 = stm1.concepts.iterator();
	while( $it0.hasNext() ) {
		var pConcept = $it0.next();
		f(pConcept,stm2.concepts.get(pConcept.position));
	}
}
ExtendedConcept.cloneStm = function(stm) {
	var t = new ExtendedConcept(new List());
	var $it0 = stm.concepts.iterator();
	while( $it0.hasNext() ) {
		var pConcept = $it0.next();
		t.concepts.set(pConcept.position,pConcept);
	}
	return t;
}
ExtendedConcept.prototype = {
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
		ExtendedConcept.forEachConcept(this,stm,function(cThis,cStm) {
			var basis = _g.clone();
			basis.concepts.remove(cThis.position);
			var $it0 = cThis.concept.specialise(cStm.concept).iterator();
			while( $it0.hasNext() ) {
				var specialisedConcept = $it0.next();
				var clone = ExtendedConcept.cloneStm(basis);
				clone.concepts.set(cThis.position,{ position : cThis.position, concept : specialisedConcept});
				specialisedExtendedConcepts.add(clone);
			}
		});
		return StatementHelper.sanitiseSpecialisations(specialisedExtendedConcepts);
	}
	,generalise: function(stm) {
		var generalisedExtendedConcepts = new List();
		ExtendedConcept.forEachConcept(this,stm,function(cThis,cStm) {
			var generalisedConcepts = cThis.concept.generalise(cStm.concept);
			if(generalisedExtendedConcepts.length == 0) {
				var $it0 = generalisedConcepts.iterator();
				while( $it0.hasNext() ) {
					var gc = $it0.next();
					var t = new ExtendedConcept(new List());
					t.concepts.set(cThis.position,{ position : cThis.position, concept : gc});
					generalisedExtendedConcepts.add(t);
				}
			} else {
				var toAdd = new List();
				var $it1 = generalisedExtendedConcepts.iterator();
				while( $it1.hasNext() ) {
					var g = $it1.next();
					var clone = ExtendedConcept.cloneStm(g);
					var iter = generalisedConcepts.iterator();
					var concept = iter.next();
					g.concepts.set(cThis.position,{ position : cThis.position, concept : concept});
					while(iter.hasNext()) {
						var tmp = ExtendedConcept.cloneStm(clone);
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
		return StatementHelper.sanitiseGeneralisations(generalisedExtendedConcepts);
	}
	,clone: function() {
		return ExtendedConcept.cloneStm(this);
	}
	,pure: function() {
		return this;
	}
	,contains: function(stm) {
		var returnValue = true;
		ExtendedConcept.forEachConcept(this,stm,function(cThis,cStm) {
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
	,__class__: ExtendedConcept
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
Helper.cloneIterable = function(list) {
	var newList = new List();
	var $it0 = $iterator(list)();
	while( $it0.hasNext() ) {
		var val = $it0.next();
		newList.add(val);
	}
	return newList;
}
Helper.cloneHash = function(hash) {
	var newHash = new Hash();
	var $it0 = hash.keys();
	while( $it0.hasNext() ) {
		var key = $it0.next();
		newHash.set(key,hash.get(key));
	}
	return newHash;
}
Helper.isEmptyLine = function(str) {
	return StringTools.trim(str).length == 0;
}
Helper.containsChar = function(str,$char) {
	if($char.length != 1) throw "Only works for characters";
	var i = 0;
	while(i < str.length) {
		if(str.charAt(i) == $char) return true;
		i++;
	}
	return false;
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
var IntHash = function() {
	this.h = { };
};
IntHash.__name__ = true;
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
	,__class__: IntHash
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
var Logger = function() { }
Logger.__name__ = true;
Logger.write = function(m) {
	Logger.log(m);
}
Logger.debug = function(m) {
}
Logger.debugInline = function(m) {
}
Logger.error = function(m) {
	Logger.log(m);
}
Logger.warn = function(m) {
	Logger.log(m);
}
Logger.logInline = function(message) {
	Logger.sb.b += Std.string(message);
	js.Lib.document.getElementById("output").innerHTML = Logger.sb.b;
}
Logger.log = function(message) {
	Logger.sb.b += Std.string(message);
	Logger.sb.b += Std.string("<br />");
	js.Lib.document.getElementById("output").innerHTML = Logger.sb.b;
}
Logger.clear = function() {
	Logger.sb = new StringBuf();
	js.Lib.document.getElementById("output").innerHTML = "";
}
var Main = function() { }
Main.__name__ = true;
Main.log = function(message) {
	Logger.log(message);
}
Main.main = function() {
	Processor.moo();
	ExtendedConcept.moo();
}
Main.prototype = {
	dummyStructure2: function() {
		var emptyTijd = new Concept("emptyTijd");
		var voormiddag = new Concept("voormiddag");
		var namiddag = new Concept("namiddag");
		var avond = new Concept("avond");
		var nacht = new Concept("nacht");
		var empty = new Concept("empty");
		var blue = new Concept("blue");
		var green = new Concept("green");
		var red = new Concept("red");
		var orange = new Concept("orange");
		var purple = new Concept("purple");
		var mono = new Concept("mono");
		var poly = new Concept("poly");
		var all = new Concept("all");
	}
	,dummyStructure: function() {
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
var Mode = { __ename__ : true, __constructs__ : ["REGULAR","EXTENDED"] }
Mode.REGULAR = ["REGULAR",0];
Mode.REGULAR.toString = $estr;
Mode.REGULAR.__enum__ = Mode;
Mode.EXTENDED = ["EXTENDED",1];
Mode.EXTENDED.toString = $estr;
Mode.EXTENDED.__enum__ = Mode;
var Processor = function() {
	try {
		var time = haxe.Timer.stamp();
		this.processFormInputs();
		time = haxe.Timer.stamp() - time;
		time *= 1000;
		var timeStr = Math.round(time) + "";
		Logger.write("Computation took " + timeStr + "ms.");
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
	Logger.clear();
	new Processor();
}
Processor.prototype = {
	processExtendedConcepts: function() {
		var extendedSamples = DotConceptParser.processInputExtended(this.sampleInput,this.concepts);
		var firstSample = $iterator(extendedSamples)().next().concept;
		var extremes = ExtendedConcept.searchExtremes(firstSample);
		var vs = new VersionSpace(extremes.all,extremes.empty);
		vs.print(Logger.log);
		var $it0 = $iterator(extendedSamples)();
		while( $it0.hasNext() ) {
			var sample = $it0.next();
			switch( (sample.type)[1] ) {
			case 1:
				Logger.write("Substracting concept <span class=\"concept\">" + Std.string(sample.concept) + "</span>");
				vs.substract(sample.concept);
				vs.print(Logger.log);
				break;
			case 0:
				Logger.write("Adding concept <span class=\"concept\">" + Std.string(sample.concept) + "</span>");
				vs.add(sample.concept);
				vs.print(Logger.log);
				break;
			}
		}
	}
	,processConcepts: function() {
		var firstConcept = this.concepts.get(this.concepts.keys().next());
		var extremes = Concept.searchExtremes(firstConcept);
		var vs = new VersionSpace(extremes.all,extremes.empty);
		vs.print(Logger.log);
		var $it0 = $iterator(DotConceptParser.processInputRegular(this.sampleInput,this.concepts))();
		while( $it0.hasNext() ) {
			var sample = $it0.next();
			switch( (sample.type)[1] ) {
			case 1:
				Logger.write("Substracting concept <span class=\"concept\">" + Std.string(sample.concept) + "</span>");
				vs.substract(sample.concept);
				vs.print(Logger.log);
				break;
			case 0:
				Logger.write("Adding concept <span class=\"concept\">" + Std.string(sample.concept) + "</span>");
				vs.add(sample.concept);
				vs.print(Logger.log);
				break;
			}
		}
	}
	,processFormInputs: function() {
		this.structureInput = js.Lib.document.getElementById("structure").value;
		this.sampleInput = js.Lib.document.getElementById("sample").value;
		this.concepts = DotConceptParser.processConcepts(this.structureInput);
		var mode = DotConceptParser.determineMode(this.sampleInput);
		switch( (mode)[1] ) {
		case 1:
			Logger.log("Extended mode detected.");
			this.processExtendedConcepts();
			break;
		case 0:
			Logger.log("Regular mode detected.");
			this.processConcepts();
			break;
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
var StatementHelper = function() { }
StatementHelper.__name__ = true;
StatementHelper.sanitiseGeneralisations = function(generalisedStatements) {
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
StatementHelper.sanitiseSpecialisations = function(specialisedStatements) {
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
	this.G = new List();
	this.G.add(mostGeneral);
	this.S = new List();
	this.S.add(mostSpecific);
};
VersionSpace.__name__ = true;
VersionSpace.searchExtremes = function(statements) {
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
VersionSpace.prototype = {
	print: function(printf) {
		printf("The Version Space is now defined by: <div class=\"vs\">G: " + Std.string(this.G) + "<br />   S: " + Std.string(this.S) + "</div>");
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
		this.S = StatementHelper.sanitiseGeneralisations(this.S);
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
		this.G = StatementHelper.sanitiseSpecialisations(newG);
	}
	,substract: function(statement) {
		var newG = new List();
		var $it0 = this.G.iterator();
		while( $it0.hasNext() ) {
			var val = $it0.next();
			var $it1 = val.specialise(statement).iterator();
			while( $it1.hasNext() ) {
				var specialised = $it1.next();
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
				newS.add(generalised);
			}
		}
		this.S = newS;
		this.sanitizeVersionSpace();
	}
	,__class__: VersionSpace
}
var haxe = haxe || {}
haxe.Log = function() { }
haxe.Log.__name__ = true;
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = window.setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.__name__ = true;
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
	,__class__: haxe.Timer
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
Logger.sb = new StringBuf();
Processor.STRUCTURE_ID = "structure";
Processor.SAMPLE_ID = "sample";
Main.main();
