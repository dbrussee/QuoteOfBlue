// Written by Dan Brussee
// Version 2.0: Released <unreleased>
//
window.B = { version: "2.0" }; // B2_0.js

// Cusomize these settings to work as you want them
B.settings = {}; // Sub files change these settings as needed
B.settings.fontFamily = "Geneva, Verdana, sans-serif";
//B.settings.fontFamily = "Montserrat";
B.settings.fontSize = "10pt";
B.choiceValue = null;

$(document).ready(function () {
	$(".BDialog").dialog({ autoOpen: false, resizable: true, modal: true, beforeClose: function () { } });
	$('form.block, form.BDialog').bind('submit', function (e) { e.preventDefault(); });
	$(document).tooltip({ track: true });
	//$(":button").button();
	$("input[type='text'], input:not([type]), textarea").attr('spellcheck', false);
	$("input[type='text'], input:not([type])").attr('autocomplete', "off");
	$("*[class*='BIMG-']").each(function () {
		var parts = this.className.split("-");
		var kind = parts[1].toUpperCase();
		kind = kind.split(" ")[0];
		if (B.imgdata[kind] == null) kind = "ERROR";
		if (this.tagName == "IMG") {
			this.src = B.imgdata[kind];
			this.style.height = "1em";
		} else {
			this.outerHTML = B.img(kind);
		}
	});
	var lst = $(".BDialog.BLegend");
	for (var i = 0; i < lst.length; i++) {
		var div = document.createElement("div");
		div.style.cssText = "position:absolute;bottom:0;left:0;font-size:.8em;text-align:left; padding-bottom:1.5em;padding-left:1.5em;";
		var h = B.img("LEDYELLOW") + "<i> Primary Key</i><br>" + B.img("LEDOFF") + "<i> Required</i>";
		div.innerHTML = h;
		$(lst[i]).after(div);
	}
	if (typeof init === 'function') init();
});
B.loadBComponents = function(path, listOfComponents) {
	var thelist = listOfComponents.split(",");
	var prefix = B.version.replace(".","_"); // Current version file prefix
	for (var i = 1; i < thelist.length; i++) {
		var itm = "B" + prefix + "-" + thelist[i] + ".js";
		var script = document.createElement('script');
		script.src = path + itm;
		document.head.appendChild(script);
	}
}
B.clearSelection = function () {
	if (document.selection && document.selection.empty) {
		document.selection.empty();
	} else if (window.getSelection) {
		var sel = window.getSelection();
		try { sel.removeAllRanges(); } catch (e) { };
	}
};
B.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
B.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
B.getDateParts = function (d) {
	var ret = { M: 0, MM: '00', D: 0, DD: '00', YYYY: 0, H: 0, HH: '00', NN: '00', SS: '00', sss: '000', ap: 'a', DOW: 0 };
	if (d == undefined) d = new Date();
	if (d == null) return null;
	if (typeof d == "string") d = new Date(d);
	try {
		ret.M = d.getMonth() + 1; ret.MM = B.format.LEFTZEROPAD(ret.M, 2);
		ret.D = d.getDate(); ret.DD = B.format.LEFTZEROPAD(ret.D, 2);
		ret.YYYY = d.getFullYear();
		ret.H = d.getHours();
		ret.HH = B.format.LEFTZEROPAD(ret.H, 2);
		if (ret.H < 12) { ret.ap = "a"; } else { ret.ap = "p"; ret.H -= 12; }
		ret.AP = ret.ap.toUpperCase();
		if (ret.H == 0) { ret.H = 12; ret.HH = "12"; }
		ret.NN = B.format.LEFTZEROPAD(d.getMinutes(), 2);
		ret.SS = B.format.LEFTZEROPAD(d.getSeconds(), 2);
		ret.sss = B.format.LEFTZEROPAD(d.getMilliseconds(), 3);
		ret.DOW = d.getDay();
		ret.MMMM = B.months[d.getMonth()];
		ret.MMM = ret.MMMM.substr(0, 3);
		ret.DDDD = B.days[ret.DOW];
		ret.DDD = ret.DDDD.substr(0, 3);
	} catch (e) {
		say(e);
	}
	return ret;
};
B.format = {
	RED: function (txt, bgclr) { return B.format.COLOR(txt, "red", bgclr); },
	GREEN: function (txt, bgclr) { return B.format.COLOR(txt, "green", bgclr); },
	YELLOW: function (txt, bgclr) { return B.format.COLOR(txt, "yellow", bgclr); },
	BLUE: function (txt, bgclr) { return B.format.COLOR(txt, "blue", bgclr); },
	BROWN: function (txt, bgclr) { return B.format.COLOR(txt, "brown", bgclr); },
	BLACK: function (txt, bgclr) { return B.format.COLOR(txt, "black", bgclr); },
	COLOR: function (txt, clr, bgclr) {
		if (bgclr == undefined) bgclr = "";
		if (clr == undefined) clr = "";
		var h = "";
		if (clr != "") h += "color:" + clr + ";";
		if (bgclr != "") h += "background-color:" + bgclr + ";";
		if (h != "") {
			h = "<span style='" + h + "'>" + txt + "</span>";
		} else {
			h = txt;
		}
		return h;
	},
	DECIMALPLACES: function (amt, places) {
		if (isNaN(amt)) amt = 0;
		var rslt = Number(parseFloat(amt).toFixed(places)).toLocaleString();
		if (places == 0) {
			var parts = rslt.split(".");
			rslt = parts[0];
		} else {
			var parts = rslt.split(".");
			var dec = "";
			if (parts.length == 1) {
				rslt += ".";
			} else {
				dec = parts[1];
			}
			while (dec.length < places) {
				dec += "0";
				rslt += "0";
			}
		}
		return rslt;
	},
	ASLINK: function (html, onclicktext) {
		var oc = "";
		if (onclicktext != undefined) oc = onclicktext;
		var spn = "<span class='anchor'";
		if (oc != "") spn += "onclick='" + oc;
		spn += ">" + html + "</span>";
		return spn;
	},
	DOLLARS: function (amt, places) {
		if (places == undefined) places = 0;
		return "$" + B.format.DECIMALPLACES(amt, places);
	},
	COMMAS: function (amt) { return B.format.DECIMALPLACES(amt, 0); },
	INT: function (val) {
		var tmp = parseInt(val, 10);
		if (isNaN(tmp)) {
			return val;
		} else {
			return tmp.toString();
		}
	},
	LEFTPAD: function (val, chr, places) {
		var newval = val.toString();
		while (newval.length < places) newval = chr + newval;
		return newval;
	},
	LEFTZEROPAD: function (val, places) { return B.format.LEFTPAD(val, "0", places); },
	TRIM: function (txt) { return B.trim(txt); },
	UTRIM: function (txt) { return B.trim(txt).toUpperCase(); },
	UPTRIM: function (txt) { return B.format.UTRIM(txt); },
	SECONDSTILL: function (tilltime) {
		if (tilltime == null) return "";
		// Only minutes / seconds
		var now = new Date();
		var diffDate = new Date();
		diffDate.setTime(tilltime.getTime() - now.getTime());
		var ts = diffDate.getMinutes();
		ts += ":";
		var s = diffDate.getSeconds();
		if (s < 10) ts += "0";
		ts += s;
		return ts;
	},
	ELAPSE: function (d1, d2, includeMillis) {
		if (includeMillis == undefined) includeMillis = false;
		var millis = d1.getTime() - d2.getTime();
		return B.format.ELAPSEMILLIS(millis, includeMillis);
	},
	ELAPSEMILLIS: function (millis, includeMillis) {
		if (includeMillis == undefined) includeMillis = false;
		if (millis < 0) millis = millis * -1;
		var dys = Math.floor(millis / (60 * 60 * 24 * 1000));
		millis -= dys * (60 * 60 * 24 * 1000);
		var hrs = Math.floor(millis / (60 * 60 * 1000));
		millis -= hrs * (60 * 60 * 1000);
		var mns = Math.floor(millis / (60 * 1000));
		millis -= mns * (60 * 1000);
		var scs = Math.floor(millis / 1000);
		var rslt = "";
		if (dys > 0) rslt += dys + "d ";
		if (hrs > 0) {
			//if (hrs < 10) rslt += "0";
			rslt += hrs + "h ";
		}
		if (mns > 0) {
			//if (mns < 10) rslt += "0";
			rslt += mns + "m ";
		}
		//if (scs < 10) rslt += "0";
		rslt += scs;
		if (includeMillis) {
			millis -= (scs * 1000);
			rslt += "." + B.format.LEFTZEROPAD(millis, 3);
		}
		rslt += "s";
		return B.trim(rslt);
	},
	TEMPLATE: function (tmp) { // B.format.TEMPLATE("{{LNAM}}, {{FNAM}}", {FNAM:'Dan', LNAM:'Brussee'}) => "Brussee, Dan"
		var rslt = tmp;
		for (var i = 1; i < arguments.length; i++) {
			var dta = arguments[i];
			for (var key in dta) {
				rslt = rslt.split("{{" + key + "}}").join(dta[key]);
			}
		}
		return rslt;
	},
	HHNNSS: function (d) {
		var parts = B.getDateParts(d);
		if (d == null) return "";
		return parts.HH + ":" + parts.NN + ":" + parts.SS;
	},
	HHNNSSsss: function (d) {
		var parts = B.getDateParts(d);
		if (d == null) return "";
		return parts.HH + ":" + parts.NN + ":" + parts.SS + "." + parts.sss;
	},
	HNNSS: function (d) {
		var parts = B.getDateParts(d);
		if (d == null) return "";
		return parts.H + ":" + parts.NN + ":" + parts.SS + parts.ap;
	},
	HNNSSsss: function (d) {
		var parts = B.getDateParts(d);
		if (d == null) return "";
		return parts.H + ":" + parts.NN + ":" + parts.SS + "." + parts.sss + parts.ap;
	},
	HHNN: function (d) {
		var parts = B.getDateParts(d);
		if (d == null) return "";
		return parts.HH + ":" + parts.NN;
	},
	HNN: function (d) {
		var parts = B.getDateParts(d);
		if (d == null) return "";
		return parts.H + ":" + parts.NN + parts.ap;
	},
	YYYYMMDD: function (d) {
		var parts = B.getDateParts(d);
		if (d == null) return "";
		return parts.YYYY + parts.MM + parts.DD;
	},
	MMDDYYYY: function (d, sep) {
		var parts = B.getDateParts(d);
		if (d == null) return "";
		return parts.MM + "/" + parts.DD + "/" + parts.YYYY;
	},
	MDYYYY: function (d, sep) {
		var parts = B.getDateParts(d);
		if (d == null) return "";
		return parts.M + "/" + parts.D + "/" + parts.YYYY;
	},
	MYYYY: function (d, sep) {
		var parts = B.getDateParts(d);
		if (d == null) return "";
		return parts.M + "/" + parts.YYYY;
	},
	MMYYYY: function (d, sep) {
		var parts = B.getDateParts(d);
		if (d == null) return "";
		return parts.MM + "/" + parts.YYYY;
	},
	MMDDYYYYHHNNSS: function (d, dsep, tsep) {
		var parts = B.getDateParts(d);
		if (d == null) return "";
		return parts.MM + "/" + parts.DD + "/" + parts.YYYY + " " + parts.HH + ":" + parts.NN + ":" + parts.SS;
	},
	MDYYYYHHNNSS: function (d, dsep, tsep) {
		var parts = B.getDateParts(d);
		if (d == null) return "";
		return parts.M + "/" + parts.D + "/" + parts.YYYY + " " + parts.HH + ":" + parts.NN + ":" + parts.SS;
	},
	MDYYYYHNNSS: function (d, dsep, tsep) {
		var parts = B.getDateParts(d);
		if (d == null) return "";
		return parts.M + "/" + parts.D + "/" + parts.YYYY + " " + parts.H + ":" + parts.NN + ":" + parts.SS + parts.ap;
	},
	MDYYYYHNN: function (d, dsep, tsep) {
		var parts = B.getDateParts(d);
		if (d == null) return "";
		return parts.M + "/" + parts.D + "/" + parts.YYYY + " " + parts.H + ":" + parts.NN + parts.ap;
	},
	MDYYYYHNNSSsss: function (d, dsep, tsep) {
		var parts = B.getDateParts(d);
		if (d == null) return "";
		return parts.M + "/" + parts.D + "/" + parts.YYYY + " " + parts.H + ":" + parts.NN + ":" + parts.SS + "." + parts.sss + parts.ap;
	},
	MMDDYYYYHHNN: function (d, dsep, tsep) {
		var parts = B.getDateParts(d);
		if (d == null) return "";
		return parts.MM + "/" + parts.DD + "/" + parts.YYYY + " " + parts.HH + ":" + parts.NN;
	},
	MDYYYYHHNN: function (d, dsep, tsep) {
		var parts = B.getDateParts(d);
		if (d == null) return "";
		return parts.M + "/" + parts.D + "/" + parts.YYYY + " " + parts.HH + ":" + parts.NN;
	},
	DATE: function (d) { return B.format.MDYYYY(d); },
	TS: function (d) { return B.format.MDYYYYHNNSS(d); }
};
B.keepChars = function (txt, charsToKeep) {
	var orig = txt;
	if (charsToKeep == "#") charsToKeep = "0123456789";
	if (charsToKeep == ".") charsToKeep = "0123456789.";
	if (charsToKeep == "A") charsToKeep = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	if (charsToKeep == "a") charsToKeep = "abcdefghijklmnopqrstuvwxyz";
	if (charsToKeep == "Aa") charsToKeep = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	var rslt = "";
	for (var i = 0; i < txt.length; i++) {
		if (charsToKeep.indexOf(txt.charAt(i)) >= 0) rslt += orig.charAt(i);
	}
	return rslt;
};
B.stripChars = function (txt, charsToStrip, ignoreCase) {
	var rslt = txt.toString();
	if (ignoreCase == undefined) ignoreCase = false;
	for (var i = 0; i < charsToStrip.length; i++) {
		var c = charsToStrip.charAt(i);
		if (ignoreCase) {
			while (rslt.indexOf(c.toUpperCase()) >= 0) rslt = rslt.replace(c.toUpperCase(), '');
			while (rslt.indexOf(c.toLowerCase()) >= 0) rslt = rslt.replace(c.toLowerCase(), '');
		} else {
			while (rslt.indexOf(c) >= 0) rslt = rslt.replace(c, '');
		}
	}
	return rslt;
};

B.whichOneOf = function (txt) {
	var a = txt.toString().toUpperCase();
	if (arguments.length > 2) {
		for (var i = 1; i < arguments.length; i++) {
			var b = B.trim(arguments[i]).toUpperCase();
			if (a == b) return i - 1;
		}
	} else {
		var itm = arguments[1];
		if (typeof itm == "string") {
			var lst = itm.split(",");
			for (var i = 0; i < lst.length; i++) {
				var b = B.trim(lst[i]).toUpperCase();
				if (a == b) return i;
			}
		} else { // list passed in
			for (var i = 0; i < itm.length; i++) {
				var b = B.trim(itm[i]).toUpperCase();
				if (a == b) return i;
			}
		}
	}
	return -1;
};
B.isOneOf = function () {
	return B.whichOneOf.apply(null, arguments) >= 0;
};
B.isNotOneOf = function () {
	return B.whichOneOf.apply(null, arguments) < 0;
};

B.trim = function (str) { // Eliminate space before and after text
	if (str == undefined) return "";
	return str.toString().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};
B.utrim = function (str) {
	return B.trim(str).toUpperCase();
};

B.is = {
	IE: function () {
		var ua = window.navigator.userAgent;
		var loc = ua.indexOf("MSIE ");
		if (loc < 0) loc = ua.indexOf(".NET CLR ");
		return (loc >= 0);
	},
	ALLDIGITS: function (val) {
		var txt = val.toString();
		for (var i = 0; i < txt.length; i++) {
			if (!B.is.ONEOF(txt.charAt(i), "0,1,2,3,4,5,6,7,8,9")) return false;
		}
		return true;
	},
	ZIPCODE: function (val) {
		return /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(val);
	},
	DATE: function (val, min, max) {
		var d = new Date(val);
		var t = d.getTime();
		if (isNaN(t)) return false;
		if (min != undefined && min !== null) {
			if (new Date(min).getTime() > t) return false;
		}
		if (max != undefined && max != null && max !== "") {
			if (t > new Date(max).getTime()) return false;
		}
		if (d.getHours() > 0) return false;
		if (d.getMinutes() > 0) return false;
		if (d.getSeconds() > 0) return false;
		if (d.getMilliseconds() > 0) return false;
		return true;
	},
	EMAIL: function (val) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(val);
	},
	NUMBER: function (val, min, max) {
		if ($.isNumeric(val)) {
			if (min != undefined || max != undefined) {
				var num = parseFloat(String(val)); // We already know it is numeric
				if (min != undefined) {
					if (parseFloat(min) > num) return false;
				}
				if (max != undefined) {
					if (num > parseFloat(max)) return false;
				}
				return true;
			} else {
				return true; // Just checking if it is numeric
			}
		} else {
			return false;
		}
	},
	INTEGER: function (val, min, max) {
		var int = parseInt(String(val), 10);
		if (isNaN(int)) return false;
		if (int.toString() != val.toString()) return false;
		if (min != undefined && min !== null) {
			if (parseInt(min, 10) > int) return false;
		}
		if (max != undefined && max != null && max !== "") {
			if (int > parseInt(max, 10)) return false;
		}
		return true;
	},
	CHANGED: function (obja, objb) { // Main use is with form.get() data before / after a load / save.
		var usedkeys = {};
		var valA = "";
		var valB = "";
		for (var key in obja) {
			usedkeys[key] = ""; // Identify this key as being in obja
			valA = obja[key];
			valB = objb[key];
			if (valB == undefined) {
				if (valA != undefined) return true; // key in A does not exist in B
			}
			if (valA != valB) return true; // Values have changed
		}
		if (typeof valA == "object") {
			if (typeof valB == "object") {
				if (B.is.CHANGED(valA, valB)) return true; // Sub object is different
			} else {
				return true; // One is an object... the other is not
			}
		}
		for (var key in objb) {
			if (usedkeys[key] == undefined) return true; // key in B does not exist in A
		}
		return false; // Looks the same to me
	},
	LASTDAYOFMONTH: function (d) {
		if (d == undefined || d == null) d = new Date();
		if (!B.is.DATE(d)) {
			return false;
		} else {
			if (typeof d == "string") d = new Date(d);
			var d2 = new Date();
			d2.setTime(d.getTime());
			d2.setDate(d.getDate() + 1);
			if (d2.getMonth() == d.getMonth()) return false;
			return true;
		}
	},
	NOTONEOF: function () { return B.whichOneOf.apply(null, arguments) < 0; },
	ONEOF: function () { return B.whichOneOf.apply(null, arguments) >= 0; }
};
B.stringToElement = function (str) {
	var div = document.createElement("div");
	div.innerHTML = str;
	return div.firstChild;
};
B.img = function (imgname, width, title, onclick, otherStyle, id, classes) {
	if (classes == undefined) classes = "";
	if (classes != "") classes = " class='" + classes + "'";
	if (otherStyle == undefined) otherStyle = "";
	if (width == undefined) width = "1em";
	if (width == "") width = "1em";
	if (B.is.INTEGER(width)) width += "pt";
	var sty = "z-index: 1; width: " + width + "; margin-top: 1px; margin-bottom: -1px;" + otherStyle;
	if (title == undefined) title = "";
	if (onclick == undefined) onclick = "";
	if (onclick.length > 0) onclick = " onclick='" + onclick + "'";
	if (id == undefined) id = "";
	if (id != "") id = " id='" + id + "'";
	return "<img" + id + classes + " src='" + B.imgdata[B.trim(imgname).toUpperCase()] + "' style='border: 0; margin: 0; " + sty + "' title='" + title + "'" + onclick + ">";
};
B.imgObject = function (imgname) {
	var img = document.createElement("img");
	img.src = B.imgdata[B.trim(imgname).toUpperCase()];
	return img;
};
B.imgsrc = function (el, imgname) {
	if (typeof el != "object") el = document.getElementById(el);
	el.setAttribute("src", B.imgdata[B.trim(imgname).toUpperCase()]);
};
B.bgimg = function (el, imgname, height, position, repeat) {
	if (typeof el != "object") el = document.getElementById(el);
	el.style.backgroundImage = "url(" + B.imgdata[B.trim(imgname).toUpperCase()] + ")";
	if (height != undefined) el.style.backgroundSize = height;
	if (position != undefined) el.style.backgroundPosition = position;
	if (repeat != undefined) el.style.backgroundRepeat = repeat;
};
B.bgimgcenter = function (el, imgname, height) {
	B.bgimg(el, imgname, height, "center", "no-repeat");
	//el.style.backgroundAttachment = "fixed";
};
B.imgdata = {
	ADD: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAq0lEQVRoQ+2XwQ2AMAwD22lYhyEYiyFYh2ngjwJSYiVV0fFu2to+Quht8qdPfv+GgNEJksAvE9iX43oK2841Je2UTRHg4JIELLNACIQcDoCQaBZdCIRASHQAhEQDX7uQNQ6IZ4XLv0ZxBIRtdRSSgMOslKWhBJSb8D/gcI9hji+xAxdrKQiBEAiJDoCQaCBdCIRASHRgdHnKS1wpCgGVbpdNo5WiQKjSbeusG1uQjDHz3JgZAAAAAElFTkSuQmCC",
	BLANK: "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
	CALENDAR: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACi0lEQVRoQ+1ZMWhTQRj+rkmFklp1EMlSU4mlXSQRLZQOxtTduDlWcBGs2MHJQRycK12yiEI3p6Z700akCEFMcNAqRZ+gRQhiikKxTfLLixXfa+5x7457JA8vWy533/99//f/f+COIeQfFnL++D8FLK29yDBqPbHdI9Z37crFyZKKkzpwlBxYKq5bjOHkPmkrl50aURKgAUdJQGF1nZyEc9mpruF4Bt7JpBKNyKF5RkiBIeEkvHJ33pXwSw/mVAyAEIdgEUM12tydGyhVLV4QroA2+b7+CmPs6MFDjUYTpXsLruXM/VuIRiNSImRwiKgebe2leSK4An5MTxQYcJnH6M3nb9jKL7p+Gr45g9H4MSkBsjgELB8ulnMHg/AFZM9/52XfPvz83RZ+LT514cRmrmLydFxKgDQOwRpcLXcMC66An9MTriZ1MmsHzj8GYrE/y7UaYndm1QRI4gwWyx18pQXY1teGk9i7fqPNv/9RHvEvH5RKSBZHiwC7+d5/rWN7ZxeNFuHE0ABOHR9SamJZHC0CpApd82YjQHNCpeF8O1DZ2PScQtJRNR5IjyX9TSEjQGPWnVDGgb/ZePbytSvHF86daX/Xte5loDYHdBH1wjECRFMo9A4ENGSEsNp6QBgpoA3aBIS+hIwAwf+GGaOiMRpQjwphtTWxMFJAG7QJME1smvhfjXLvhURNHPoSCqhHhbDamlgYKaANvgW82tisM+BIQDyUYInw6ex40vVOYQN59UABHtfrStH1HFpOjyX9Xa9X3n5MEGtWe8UFArYZRVLp8ZGOVxrPJyZbBFjzIRFSjgc9Pbn0iWKXDWOogiK3eeQ9S8gnfk9sU3pd7Anm+ySMgG67YRzotgO/AZIZzkCtt5PGAAAAAElFTkSuQmCC",
	CANCEL: "data:image/png;base64,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",
	CHECK: "data:image/png;base64,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",
	CHECKN: "data:image/png;base64,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",
	CHECKY: "data:image/png;base64,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",
	CLOCK: "data:image/png;base64,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",
	COPY: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABg0lEQVRoQ2NkGOKAcYi7n2H4esBp6df/VIidBfuiuROpYA5OI3DGAKUekONnYnj08R/IYpp6gmYemOrNydB55CfNPUEzD8wP4GT4+ouBoesobT1BUw+A0g+tPUFzD9DaE3TxAC09QTcP0MoTVPGAnyoLNYr6BQVm7CTXGYPCAwIcjAwffoDrTZI9MSg84KPBynDkwR+yPDEoPBCozcrw6y8Dw1EyPDFoPABKP+R4giQPXD5wGmtmrU61pCgTg2IABkj1xKDzAKkxQZIHcAUzpcUocgyQGhOD1gPoMVFgxo7VrSR5gFZ5gJgMNOoBfKFEaR6gWwzQKhPTzQOk5IHONTeJcRdWNeUh6hjidM8Dg9IDQz4JDXkP0CoPYEvz6IE1qPMA3Tww5JPQiPLAkC9Gh7wHyK6GcWikSik0pPIAKSE44dRPjMkQUpIQTYrREe8BUgKAGLUk5wFiDIWpwZaESNFPjNpRD+ALpdEYICINjSYhIgJpQJQM36UGAxKcZFg65GMAAJ7NTkDVBQSZAAAAAElFTkSuQmCC",
	CUT: "data:image/png;base64,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",
	DIAMOND: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJMSURBVHhe7ZpZTsNAEEQDZ+QA7Pt2Y/Z9OwAfUCW5pNbgSYIzntVPKkUxJHE97Hx0M5uYmEjJRpcmYfHvLs1JOESekJ8uz92xJnDLNyXBV16hhCOkSnTP28L6DnCPVfed4CvP4/N+VgV9lz2f2/v9AHlE7O+8IMdI0SxTXlQn4T/lxT7iSnhFipMwpLyghAfEvpYSTpAiWKW8KFZCiPJiDylKQsjyghLuEfueb0h2EsYoL3wSTpEsGLO82EWylBCjvKCEO8R+1juSTELM8iIbCSnKix2kT8IZEoWU5QUl3CL2HKJIyKG82EZcCR/IaBJyKi98Es6RoORYXlDCDWLPLaiEnMuLLWQUCSWUF30SPpHBEkoqLyjhGrHnTAkXyL8osbzYRFaSUHJ50SfhC1kooYbyghKuENvlj4T17nERfHEtrHWPXnxXAae2peD7618iS0EJXFPZN+C0tgQJK5cXPgkcWOZKsPKCi0pXAgeVOUoIXl5QAjc09o1zkzBaeeGTwIFlakYvL7ieciVwUJlSQrTyIicJ0csLSuCGxn4wJXBgGYtk5UWfBA4qY0hIXl5wPRVbQjblBSVwQ2NPiBI4tQ1NduVFnwQOKkNKyLa84GZmLAnZlxeUwOWEPVFK4NR2KMWUF30SOKgcIqG48sIngQPLZSm2vOB6aqiE4ssLSuBywhbhoHKehGrKC58EFnWprrzgZmaRhGrLi6b/WVr4ijZRXvB24JrKFrap6rL3wc1Mn4QmygtXQlPlhb4Tqr7nF8HizZafmEjObPYLRKw9H80dXNAAAAAASUVORK5CYII=",
	DOWN: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEZ0lEQVRoQ+1ZXVLjRhD+2kWFpFbykhNEnCDeG3hPgDlB4HHtB8wJwp4A82DziHMCzAmWG2BO4NkTBCxvbeyl3KmRjFcajaTWD5UitX61NDPf9NfdX38ivPIfvfLz4weA/zqCtUXAGy5aaPABGC0wPCK0ouCYMQVBgTDFmm5Uz5nWAb4SAO/yqwd+OgG4QyCvyIEYrACagHYu1IdfVJF3o8+WAuCd8x5+8s+J6KjsxvHo8Bgr91Sd0kPR9QoD8EbzDhhXRLRXdLOs55n5AYRj1W1OiqxbCIA3nOuDp946M24CWjRYYU0Pzzzf5Mce1ppm3CHCQdohmXmses1jKQgRgIAyu4srAjrJhfmRudHH6s1ESoGQgl86ROsBQG/NNRmYYOkcS9aTARj517bDM+MjVs5AspHtRkMgiz4R/rSBUF33MC8SuQDstAluvV1XKdQUI1rfmtFgxoXquf0sEJkAdMIS6DpWMYB7LJ122VtPO8ymJE8I+D2+Hx9mJXYqgE2pnMWrDT/y0vUkh98f+Rw9yKzr5kf78qtH/G0ajURQnVbuftqe6QBG8zGB/ojXa3onpU0ZAHqvkE58Z0ThL9VtWqufFYAOJ/HTzJACH1XPPctLquf/ywIIQfhnZmIz7ezbOrYdwNAfEOHk+2Hl1KkFwDnv0a6vpca2xKYltB3AaD6LahtmOlY9Zyy9ff1clQhsqHRExFfPe2rtpLrNffMMCQBWDi6dXyWJG128MoAgCou/83LQAiDOPy0PVM+1dODseFQFsMmFSVR2MOhUdZ1BdGcbgPhLJehTB4UCAKNFn8DnWxpZLtMG4C46jDDhvfrg3hbhf20ALv02MT5FAExVz32XGQEz9Mzy2l9nDqT1BLMhJiJQB3frioBknf8/gDwKeRbJIc0XBqdKhNIU8kb+NKoIJUlsviMBwMC96rox58J8zzOT2PJOLWVUK1ez9WeDkEmTsmU0JqSkjczWwdNA5NHy+T1v6JdpZBY5K5QS3nAR0y82AFJdFUa1hJQIStdwrkD02/cGIhdzWUmdl7RRwInLYP486zUT5plITudNRYnkMwqB/l+StFvqhMZZbBosJqcrDjTJpJYlbYT71QaaUEhVGymjSS1N2rTan+VOZA71yakoe8BOUGm4COZY6TAUOBPrb3dFjITitoq2yRs7h1UcZVt1Cg//dJ2w5VHSVtny0UolfgAa76UORV5nDrxTrD+ZhnFlYyutoWzLK+EM/zgXRcfNWLX5eXFCjITbIW2guWZTkFihhzm2ucqhLd7oY/nmRgokNIu/HIDXA5tNH7jcK+dIsp4IQBadovQIXGVtr+uvL0yPMXud+C2YWiBu213ucCUJbaJ7FgKwKa8dAsY2WzyP67kCDzh60Q8cMe7u+gPTeiwLQN86Vs6ZhDLmHoUjENMrYenTzkEnqp1EQJg/c/A1Z2dQpSRXAmCIrxYIbTC3QfCSNjnuwfozK92CcVtXCa4NgOjWX+ChHwBe4FILLfnqI/Av3WvYTy2cZ04AAAAASUVORK5CYII=",
	EDIT: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACaklEQVRoQ+2Yz2sTQRTHv2+LppRaQkGh9JcgeGglplftIbl4UQT/giiKHsSbFQ8eCp6k5OgP1EP/Ay/eRDY2K0hBKIqHag8RpBcTaS4K0fTJLgS36+5kks7OTCELe1iYffP5vLdvd2cIB/ygA86PgYDpCg4qoLoC35aW8mi3XSKqseNcmVpZ2RDNYVUFQvBZH5qZdzA0VBRJWCPwwn2bH61/fzD3rnounPFuElYI+PDE7AKUHWk2vXnv9aKshHGBMHwHOk4CwMZkubwQ7QejAvwU+UYm98ybfHQSDo2F4aISDDSnyuWgN8KHMQEfHrtwAWR/ZE5tVqefTCRJ+PBwnEJcMxsRCMN3spko0ai/mlv37iS9ibQLxMEnSTD7mUfhUvFs4rdAq4AIPirBRNwN3r9Hm4AMfEeiMZx7X519fE2U+c5YLQK9wCNoWBToOoS/ENoE0oRP/RFKGz5VAR3wqQnogk9FQCe8cgHd8EoFTMArEzAFr0TAJPy+BUzD70vABvi+BWyB70vAJvieBWyD70nARnhpAVvhpQRshu8qYDu8UIBdHMdnrIExHd1MirnuaRkoEU96SOKamNcOXcYfuout1gR2sWfXLBLdGLy4Am8OrwJUQps3BRJG4cUClUwNhNkg2/ESxuETBR4uzy/OjP+sXji9/e9p2SthBXyiwP3bC89ffpy5eu/8B/wn8aU1AsJF2X0b6W7sc2BsE9+6cWZrvXb0hB8zkMhtfwVxJTjbvytURK3P+ZTfFitQKhV2xoZb9WNHflXGR1urN5c/ecpnVhRQy9aiItbYMAOBNLMrE3tQAZkspTnmL535U0AyK8OcAAAAAElFTkSuQmCC",
	ERROR: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALYSURBVGhD7ZlNaBNBFMffZNON2sYPsAiCR0F70IPaihQUm5MepFACBRHiRVEQwYN4FHpSKwiKglBQtCkqVC96SvUgaIweBNGC6Fk0+BUF8zXjzO5LSd3MZjOz60bZHyz73isb/r/OdnZDISIiIiJUCJ6lfE8NDRPKThIC23m72p4GTpExeAqkPpnMvXiEs5a4CpR2Dx4Hws4SIHEc/VUYsBqjcHr5w8IEjhxIBUqpbWnCyEVe9tuTkGDwLQbk8LK5/AxOFhHDswNCIc1P4YYXEFhBgY5h50AqwC/ciFX4uGSRCwAZwKILkGdxEfg30BcwDCzCQU+Ah08cOwXmgUM48E58aNg6dFEWICtXQSJzxArRs2cUzPGDAD0m/tQdcY0QF4euhLKAObYf4qm92PHs+9JcIoOdHHGNmTlq33r8EHXz53SKskCt8ATo23nsbNqthBWei4vVa0B6e61DFWWB+svnULlzwykhVoKH/FOiVXioVqzPqN67hYPO0foj9ioRVHiB9F3ox8ggw7ItxuatVsDY+g04sRHh6OcimKPj2uH7cs9aZvVFQCCTgPIvgMQSbDiKv3mZgNYt1IzsdvIjvBu+CQgWJD5+wEkTtA6V2ayv4QW+CghI/xq+LfZh10TMAJJYKt1iVfFVYGG3aSXAkW2xOvgm0HKrrNWAFT9hY+O3hC8C0n3+9nUoX73g+WGngrZAu4dUp0/sTtES8PqEDVJCWcBr+AZBSSgLGAObFofnVKanXPd56cNOA2WB8qUzUMs/xo6Hv3YFqg/uYidHSJQvTwL7+sXqq/dnoZKdslZPBb13IfxKSedfeQrfTGztOjB27IQqXxEvBP4yFzSBv8yFxf8rwBh7g2UXwF5j4cBlBcg7LEKHMfIeSwduAjf5pfZeFyYMfgJhWewcSAWSc/kZSuE8tqHBb+VzyVxhGlsH0m20QWlkyy5gxolu/RdTRERERJgA/Ab7IzxTVNuz0gAAAABJRU5ErkJggg==",
	EXCLAIM: "data:image/png;base64,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",
	EXPORT: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABnUlEQVRoQ+2XMVKDUBCG/5dC2xzBIyQncDiB4wk0pVBoGgc6OxibaAGWcoTcwNwgOYJHSKsFzyGZOMYEYdmFiC4Nzb73/m//5QcMOn6ZjuuHAhzawWIHksgeWtzW+a6/V6sCtObS/3OgtdbyDtIY5fWPv7pZB+LwbiXRC9b3Bq7mAOLwEsY8rzRbO4IXpA3ob+hTIr4fANkLDPprACyBngPvdiENIe/AU3iCzMw/xW8U5xA9O8RV8CoJIQswmfRx9JZ3frBXpMUC78cOxuOlFIQsQBxNYXBWIm4K1z//fQBx9ACD60rCLB7h+TeVakuKZBz4mjhVVQklEx8gTxyTzavq3qqzvSE3mXgA3+OSSiGQTPUByhKnKgwzmeoDJOEMMKdVdZbUzeD6Tp296gEkYQqYizoHFq6xSOH5I+qe9QB+OqXsX7rgz4oqfFOvADudUwdow6QjpCNEm5idah0hZgPZy+UdYEuibSAPoO8BdYDWgb/3HmDyU5fLP8RUBcx6eQBNIZol6oCmEG1iWvgaZQqiLpd/BqgKmPWdB/gA0FWKMa5R04EAAAAASUVORK5CYII=",
	FAVE: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACrElEQVRoQ+2ZQXLTMBSG/1cmne7oDUgXTLwjWeAsoSegnAC4QW5AuEFuALlBOQHpMmaRsHNgUXODssvQIY+RXBOncSw9I8XxTLWNbP3f+5+epRdCwwc1XD8eAOp20KsD/DV4qQDpeTzxBeoXIAq+aIAwPm8cgI4+QwOAcO7LBW8OcBp9nUIAJr5c8AKwEf0sdzy54AdgM/oZghcXnAMURj9DaOGMenHickO7B4iCTwDe7BA5pjB+e7AAPAvauMV1qUDHLjh1gMujn3E5dcEZgFX0PewFdwB20XfughMAUfQduyAG4Fn7FLcnz8Bo4whtrLgLUBeEtqi6MBKA5ziiOVZIQEjQWn6jXnIjeU8hQKFIotPc0UCyRpW5EzDf2MBtAHDUGaU1XIs9wMHKnTGFi8H6hJKTeRf5SwAvDlC9knSF1vIin2bFKSSrKPtiLfx+7NzElh+lWsWnV42ScSAQpV9uYxmtGcJ47DACKINqgjCKN6ZQPrv2DGElXgSwRyesxYsB9gAhEl8JQENMO5cgeuW0hjJ/pv7iQvpOq018/6XNB4g6M30CdTp4TuGiJ31lNQeigKUL2cynMBbrET/A0dMu8GhmI0g+50+Pwh9zyXMVAALVFvkoWcR6Lq9eU/+7Og1bDznANBiC8N56BclExgfqx0PJI3KAKFC9fl/3hSsK46whbMUhB5gG11b3X8ZPENJoMpRrT4yKGAn14zPjvNwEOYCxAvEvMI3upwLr1OMBQI/LBEorkQigtHGLVDiOl6NdnQV9Zf19MigFEbbhZQBRUQUyC9/6kv8DKSwG7yiMVYPYasgAtivQGC0Mq7bM7xpiap+su9nCSiQDWFeg/xK+7YjuamcgokokA1Cn0GMaVI24KScyRyT/IYgATALq+P0BoI6o59dsvAN/AQd8LEAOCJrAAAAAAElFTkSuQmCC",
	FAVE_BW: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAC90lEQVRoQ+2Z4ZEOQRCG34sAESACRIAIEAEiQASIABFwESACRIAIEIETAfVUzVTtjZ2d7r7pvfqUqbq6Hzvfdj/T073v9BzpHxlHO3DcLTbeZdraA+RNAXhwyCAXJf0sAJcknWTBZEfksaQXxfknkl4eKsg3SVeK818k3ThEkOuSPjeOAwLQ9JG5tUjy+43Hx5JSkj4LhCRnW/F/OUh2kn76yAJh1V93vH0oqZbkaUBZIB8k3ep4+VHS7WkE5UUZIFQpttXWuCrp+0yYDBC+FY8GTr6SxDdm2sgAWX47eo4SDaIybcwGQSC+NXp3T9I0ITkbBMfuGEHeS6rK2PiT/rSZIEuBaHVsmpC0gtxsPKMyVQ1VH1FueyW3B0Yp5m85yJ+2on0arUwFodJcK5PRSO0XefSevZ+jEKpm+0oFrCA4DkyrjfZ20GsP7UYZP2m31vL84H3p3vNPnW/WcoRKgha6sLdnRnu/SrU7lVu9ZCdPgKl5Y7SRPo18QJD+dabZqlrkDTDW70I2Bd8dIFbP/Zbya9FO2RDPJT3bMmIB4fesBEB75w35QAEanl+sIMCQN0iQy9nLX97/oyS16YzvAeH95A3VIrsI8CWnepr7YF6QGoy1xsKsQIUaFFEQnM4oAsOk7q3WWUAyohKKBnBnAbGcBL3bLXxyjIJYGgxeiDo/1JiIgmSKy1DfKwriOdJ6IxM6AkdBuPPIOnyF2qoRkLUuu3fVR/PdXfsICOLt6ciT8hytVLvvnjOO+1IoAoJEaZsRa1yt7PYcC5AorkZGBOT3IBqIPapar/mGhkIVjMSnyzfX5CLktjqJ9HTZeiOxR3SYt9UjpmPftoq6a+gF6ekrokAumA0Xj9g+5M5adFyNbi8Id4JUreVA6AE4ikJvNYkOW7EtIK7LUw9I2xLtNgKMFa2dttbwMLdUPSDL67Sw3DZALsu7uWPvAWEvIxYBmnrbtAKHHexhx3QL7AGhbE67zzBEhilmmx4Qo+3zmfYf5HzWvW/1D5jCfTMXNqETAAAAAElFTkSuQmCC",
	FINGER: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACl0lEQVRoQ+2ZsW4TQRCG/+EihCxF2AUSCEGAgiINWLqUCD8AEnkDLNFAFb/BjV8A7CfAfgAEBalJaCh8UpKOIgI3QRZWwCRgbIfcoDtjZJwLa9/uBU7cVdbuzs5888+u5s6EhD+U8PiRAvxtBVMFpMGPQVgeKkEVsp3qSaqipYA0mDG/6CB3C/D6wIdVYNAu0xLzSUHoAbj8CZceZHHq9DDe/g7Qetokm68mBUBw7g6QuTaMd38T+PgKZLNWYmaB13IkLkuYsxRgBglSBdISmqFcQpOlY58eYp3s/bRND3F6iDXLKJYSgoUcvsMBoRjEJ6hhDuXgd8g45bkTlSMeAEgVoJXfg/LHgpb76LhFHBUsJgB8BnB2Iqt+ln1/IeNSDwMju1xSKRMXgMrv5HwoMNmcU230rwCExjlNV/t/Asjq/YXuN3mduXL5gkpinflYFOi9eFgadPYewROaX7yuE5/S1jiAuOWVr2+bFa/XD5wnCkBcfgKgeNDZQ+99K1kA4rL/3efZSPP9N9uA5yVHAWnwBgg3RwD99i4G7d0EAUx8fZDBAb5sv0sQQIPXQLg9fm30dlo4c/G88ibRWWDsFpIGF0B4OR7MYbcLK5PRiU9pawwg6Ihd5zlAd5VeDS4wC7DBWRxiE8CCwRiP30qwTktcUPmaqRcKKyWVg+jzUo2lnRbXqRzt3aOHeaylhTzl2Vf8j89MCox2EpdrAO6pNteYr5PNw9fROACCQ+3/uUFwVA4izG/BQmHa9+RICowp4bcYvhqTr4kR4g5M/OCL05TOyIEWQKDE8HaqGCipOiyUps28MYBfavggHorwsAxCFsANpQyCdQBrmEON8txUrg9ZoK1AFKcmbVIAk9mMsleqQJSsmbT5AQ1oBUAAuEDgAAAAAElFTkSuQmCC",
	FOLDER: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACISURBVEhL7ZbBCYAwDEWrOKAHN1JwPXfQPTQ/WhEJKEnjQfLgSSwln/aSpl/SkD05k6sg1kcS+0wgRAq4i30mJlJqfBf7TEhNS3lee3UseDPgk9Nb/BSmI/lk1xOh9oD711x+QASpiSA1EaQmgtQgaNlLtzEBOAMTMM8kL5Hx+AqyWOwF9ZKUNjDZbwmftjpNAAAAAElFTkSuQmCC",
	FOLDEROPEN: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEPSURBVEhL7dUxagJBFMbxjSa9hYWFAQsPYOEJRBHsvUeOEEiRI+QQFiksBAsbsbKxsrGw8AgWKRJI/p/sSnb2KegbOz/47bLD+Gbf4GhyjyePeMMOvwaNv0PzXNEi1gIhzXNlBatwSPNcsYpe6+w2Wx/wMrfZmuhlbrM1MZZvLNF+SAdunYUu4VtkPlCDJw2o1l4P4QIyQYy8QPXGpcNjMaP07k0/vX/qEnazxjO86eAHh3pWR1Po4HnTRRnHemFHA3hTgb7WuXr/F5nhCd4MkasXbp3a1CHzppfec/WybjRQ14AzVXyhUG8LLRTj7LQwh+oVjsgrsq5i0curs0K02Km/8ktsoJ+uJu6JkST5AyVT1gy5PqK/AAAAAElFTkSuQmCC",
	FORM: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABSUlEQVRoQ+2ZvxLBQBDG92ZI5Q1U0qnQeQC8gk5tPJBR67wCHoAKVbqoPAFVYuYUGH8S3J/NmfClzd7uft9v75JMBOX8EjnvnyDg2wRBAAQsHUgdoWkYrQSJumVu1uWS5Lrje43npKkCZmEsWaszJWv7xUS/EMBkrlIaEFCyKcMgEFA1t1kuUMlTjU6P20dEy93x4aYxgd4oeNvNuF99uN+qFOy6v6yebyHAzEiOETpERAuuETKTwb/KeA/wt2KWEQJUfePYAzhG793O/XNAdXSucRwjhGNU13UX8ThGXbj8roYxgUkQv8zbrRad6YKAYfv2nj+Ynd/V7wl8el7oonr+zrAm8PMCdB3WjbcmkFYQm1gDgzEBjRqZhkJApvYqJP8fAtMwWgsSNQVTnIVIkpuO7yV+uuAnnzMELwqBAAhYOoARsjTQevkJNBzeMftD39gAAAAASUVORK5CYII=",
	GEAR: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAACmUlEQVRYR82YjVUbMQyAYQPYIEwAbJBO0DIBYYLSCUonaJigYQLYgGzQdoJmg7JBqy/vfM8RlmTufCF6z+9IzpY//dkKx0cHLseN+OZKz7qR3qMWgD8F5kIBPcnnqxaQYwHx3LMBcinf/xoLOSXgB4EbHer3ADwR8IUMnisZG8/LHiB59bVTdC9P8kqLF+KSB4EiJVLOvsjfzDNTwQJEAYpQmOSmsziHfAughkt6XMgS4ExWUpk5XAkSuGsZCyNEK/n+Qca605V7Ti8xq74EeCerCa0lS3nxSQaG1MhGJuElfRTlazGCUL+SEuCtzPpes3PDOZyZpRwvHtRWrjTk2VFVyu1+glUk+4J04aD0jpmpIUO4CJD3JDYV3VoomrOueFzd0U3yQ1YvKuhI8N/dvHN5UuWRfJMJd9GkCPCvKCidh0kvNwCh0jcBnsc472jBi1bHs04b5IAoy2H47B03UZjQ9Scw0HIgBtMN9UXyWBmWXGFNkpMeeHKIbO9yPDiXYfV0nuJTeYkXPcGLpMkQGQ0Y5W+C+jeETtaMBjx4D06Zg313k8JU+uETRaZFFWPkRm2E3v7YyvOIYtFCdU95DpImrkSJfvA3yUzM47CdQggjleoeVZEHAav14hAjQsgIcNEBDtm8do0L6QHuAy4ZYUJagLRLVPA+5YtsttQbWoDczfNGdBvRw3lHwXmNQ7E/tAC97iaFg3bsY2eI1ffp28ZKGyqZ9gpjdsQCZEP9nwUWlnIFT1vd0PbCV3tqSOCYp5ve7TKvSDSklchvBWRfcvyzDOAIbREuAuT9TAYWo2jVPZVD3H6y5EG93v0cnYM1yoZ4sEZvGOJaJaSC9dP0IDyIIaWq73/41FpamtcixEkvoc5lPQYsrf0PPQ2XKaEZBKMAAAAASUVORK5CYII=",
	GROUP: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAOhSURBVHhe7Zo/yE5RHMdfsihhUBYZUIRMymIwGBSDIilGoyQJxaAMRosyGA1GA6V4i5Eo5U8GZDAYDIQYFL6ft3Pq169z7z33ec69nnI+9em8z73n/J7ffZ5zfvfP885VKpVKpVKpVCqV/5JFoS3FMnlc7pDb2SCeysfyqvzOhgxKxRmVQ3Je/mnwgTwsuygVZ1RI+rNMJWylD32bKBVnVNbLtm/MS1/GeErFGZ1z0ib2S16Qa4LsZ5vtc1p6SsUZnVvSJkXSHrbZPozxlIozOi+kTWqb9LDN9mGMp1ScXiwO7TT4U+nv0FpItotScXpR4gN4E9rIvtBa9oY28ja0llJxRmeS4sU2T6k4o7NJcnFiE2vzoWSMp1Scf8IumUrSyzdI3yZKxRkEPu1L8rb8JD9ITkNMU/aR0HuZShjZl5N0bpyufIrCjck3mUoIf8qTkpsY1iWJkFBMim3sy6UrTm4+RbghU2+S8q5cIodk1HxOyVTgNs/KoRg1H9aRn2ZMRW5FV0lOTUfDNtuH6Vd8DYrR86HA2EAE5o08K6UvWhSi0oyeD9XVBml7CME+25eC1QTfxiTVe6h8GnkpbZDNsokt0vZ9JT1LJWuYS17b1/pOnpHLpad0Pp34tZSabhHWn+3LN+uZtnqXzmeBtpshHkJa2i5idoY28ii0Ec7bFKhc9kh/Hi+ZTxY8bbGfIoUldTHDNj+tWeORUtW7VD7ZbJA+cd70oIyJcxD+zUh8q4yUqt6T5sN9g82nF0xdGyxH/5yuZPU+Ju3+HKe+ZX4iU4FT0tdDAbJ9+hQvZovnvrR92nwtWy+F24ogj6i4jFy38CoP+jLGPt76GNrI6tCmWBHayNfQRiiMnOJyWSvPS07BvbkoU59qjoyNMI3tPtZsE34JsHwikyzH6GXZC04j/vET3pT7JVMV+fu69P0Yu1tCierN74PT5IOcWrNh7djBTON4QCk4J9PHjuFAWX8lqnfJfDo5IO3AH/KI7IKD+CLt2FjxT0i7Pcd4Chwin1aYVnYQr3O5Ju1YLn8jk1bvofJp5Jm0g1hXufAs344lFvDJp9Zwm/FSeIh8WvE/T7NGc2FN27HE4kDstj4ytnQ+o0IxsglE+1Tvtpuemcf/0DFJ9c6atrMIB2oPBNsOPpKaNX3W/cxwRdqDmKZ683oQSvw63IT/95U7oc3hXmgjg/0rzJAfwMbQRp6HNgeuAyx9bsgqlUqlUqlUKpVKpYO5ub+wYCXyYoU5UwAAAABJRU5ErkJggg==",
	HALT: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAB60lEQVRoQ+2YzVHDMBCF344b4MKZ0AGZmDslpANIB+kApQOoADoAKiAFOJNJBXDnQgOZZSzi/MqytJaJwkjHWJL32/e02phw4oNOPH4kAJOCPFdnWOIJwBDAKzKMqK++u1C7EwW4UO8AbjYB8xvlkxIm+OgKgPcjpVzpd4VWRwxgC4QLVQ8QWB05gCWQBoBaOIm/2gDYsix6lgB8MiC1iW2dz/uruVFZSFKh4gIQVKjYALwrVALYPnjr29Z+kQUtsUmBpAAAF+vV3RHJQv/KQsjQ10BLzA8kFz6r7PUnFpL0Mk1rEkBdhkxdZVM2Jc+TAierABdqCMY9CFcApmBM6FpNKyCrhb5mv9POBxt+19/2MiaykA4eeDnIPmFEA/WsP48YGrb1fNdgTfMCAXwA6Bnts4KIHeCg5d2BIYzA+tOheUSgwCeAC0nZ02siADCfAVeiYwOsDml5WG9dY96ZFwNAK4hYAMQQMQGIIGID8IaIEcALIhzAgnJVtjK1w/s/MRe6lbBXp2AA/Ej5ZBwUwEsJUQ3eWpThkvqqvFTDKVDt5KREK4Dm7Jfbe1toO6YOIRq9X8XRCkDbaaburI2dtwpumQ8GoCHmqocljwEqeyhJE7gAeIqMHpo8v5+P1gp4JzjwggQQOKHe2/0A7bLYQDwbfBoAAAAASUVORK5CYII=",
	HAPPY: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEkElEQVRoQ+1Zz28bRRT+pok3DqlT1w40aYXqopo4rdrUErERrUQQQggJSvkHCBw4cMufELjABdRDbxz4ceBKOHEoEqn4pbgScYqqbESqOlRBdUkd/0jl2I7z0OzGSevM7M5OHFlB8cnSzHv7vve9783sW4Z9/mP7PH4cAGg3gwcMNBigmVgEVbwM0BUwFgQoCLAL9jqlAZYHUR5gkzBwg8XNTCvY2zUDNB0bA6Px7WBVw6I0iF1lSfNrVQvRPm0AVuDABBgiuwkABM7EhC4QzwCsUqnRd94z7gaT0vCxd7yWlicAlIpeAA79BPAa34sf18jGKyzxV1rVuzIASsXeA/ClquNd7nufJcyvVHwoAbAz3zGj4rB1e+pxFSZcAWzW/MzelY0MMuXhY3E3TbgDSA3y4Df7+fbD1h6VsVp8hFqlBtogGN0GeoMBGN1djiR4s6M0S8zHnRw6ApDVPQ8il10R+u0bCEtBaNo56sEZwHTsrqjPL/+zjEPh13D4+Q/hO3oOzBdE9cHPKN7+FCim0He8TwhOy46QYUnzlIwFKQCnrpOrxBG69K3Q58OpNxHuuSNc07UDIGXBAYC49nlk1cgXMJ6+hB9uF/H59SwKa3V89NZxvHG2F9V/f4GR+UAIQNeO36VkWhACsDsP7krFMzJnLY18YmIpX7P+nx3w4/p4FFQrgKVfFJvq2nFvPpwSdSQxALdDSxDImQE/fhyPAvUS8EdCGYCSne1NWEZiANODk2DsbSkDsW+AwIhVQp/xEirX8fFlu4RQugmY74pNde24N6LvWXL+SrNjGQNTAL/bS37BV4HoNfGiOQaUUuI1XTvb2w2WMEcVAcgFvOWAB9M/BjwVAzoCduaXrsmDbxjq2kmELGOApNlv4wJLmDvi/Z8CmB5Mg7HhNiZ756OJZllyfsedTE/E7UHmQcRubbQdADy2Uenb13q1jlu/PkR0+AgCIeersyrOpYVVZOaKSL5+DJ1Gh8zMw0HmcJVYmM1jYbZgPeTcS2GcOH1YNU7hvsf9xV4IInLmiNifb+0oi2fySueAdfA5CHnuZg6LcyXL1zPPduP8xbBT5oQBlUvr+PP3ZeTuV9yTIREwN9S6TnNDTjsHsl4jdBoMkaFeRIYCrkB44BmziKU7q1ivEvw9HTh/sQ+hfr8Tk96v0zYLsQwYTso882Bu/baMlaydxQYj4f6uHfoo5SrI3itvZZzvPTkUsLTkUPcAYZElTenwTOuVshlQ7v6aJcIH98pKejjxXA9ODwfRHehU2a//Summhean8w6V/buM4koVxVz1ieXekIHQsS6E+/2uZbZl6FD7jT3uUwl7lMiny5L2oJJEnT1UgK8SEXWex725ArBY2M+DrQbafT1a3AZhDXen9q6cqABsjKqMFJU10Fy99pcY4q+crb2tEs3CqIy61XxzPEoaEEnQKimyPnBIzwkl6RIWwTChOo1uGYAntEE07pkRnnHGruoGrl1CsqxuzpJGQZsf+YiCW6DsYO2PfIxNwocpt6mzEntOdyFVB+3ep62Bdgfe8hJqF6ADBtqV+cZz/wO9ey1P+doZ1AAAAABJRU5ErkJggg==",
	HELP: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAR0SURBVGhD7ZlvaBxFFMDf7N1eK7kLVdFYc/auNigIhbS1FaG5CoIYEKT2Qxvpx6JNquZDit8r6IcqaKFpaxH8oKhFadEvCoKQtmJplMbih9IGbNoLJK3UNndpmtztPuftvSbZ3P6Z2UsbD+4Hx86b3Zt5b+fNezOz0KBBg/pG8LVm2g5Mpi3TehnB2CLQTqMQaVn9WOUujAnEPAojL8AeiJViPw33NuX5Xk3UZEDmc1xuTBZ3oQHbZUObuVoJBDgtbDi26nryyMA+UeZqbSIZ0HbAbi7Fi68bILpkCzmujgbCSRvwa7Oc/Gq415jgWmW0DSBXKZv2CfnHZ7lqUZAj8nu8ZGzVdS2Dr0pk+wvby6Z1fLGVJ6hNapv64CollEcgc6iwQwB+IUDEueqegIBlOTe6/n6r+TuuCkRpBOityCjy4b1WnqA+UMDH2f6bSiMRakD24EQOBPaJSli8Lzh9CaPP6TuEUBfKHioM6vh824MGvPZ0HDLNBrSmBCRiAKMFhLz8/TJShlNXLX4yHJrYl3tSG1n0JNCATP/EbkOIwywGkkwIeHuDCZ1rgr3s3LgN+89MO0apYCN2j+xpPsJiFb4ulD482SqV72IxkJh8DW+2hytPrGsxoHt9Ah56QC1+UK4hXViswtcA07K3yotSknoxG4dXn6pW/sYUwpUJm6U5ck/EoPNJxXggEyXr4omvAXJ50MnFUDY9Xt3MvtPTsO34FOz84Q688/Mdrp1jw8rQ+DFLkC6erWQOFtvlpaMihbMy6W7mz2s2DFyxwGI3H5J+/2vePXlb5X9ogiuB0ME6VeFpgAArJz00xWIoax9xN/PXdQvKCzxnfNI9aVcsFzCjGJCEgJQQ6PlCvcfRiAWGroXkvrzt+n16rsR35qDJO5/z19TDqYMQm7jkwtsAtO+u4xcFmrCrV7i7+m1U0wCAFr668DbA5+EovLAqBu8+n2CpwvC/Nnx/UXcLYGsYIOBRLtXEK21x6N2YcPLEXc7LCf7J4MzsBNdAawRqhlym77kEPDwvYVFe2H9mxjFisfAxwBjnQmR61puuN39rGmU+mPZMbIp46uQ3AjUZQPF9XYs7yNObr0F54v4ZkE65k9SlGzb8MaYddRbg7RXeBiCe5VIkmtxBB/6Rvn+7OjXo4aOT55Iwc7TYLkp4kjIgVy0piFBAU+RG3kgOcdUsniPgPCjgFItLj9TFS3nCbw6A3Fj/yMVIdMgl83u5ZU40op1ZLQTp4mtAPGacoEMnFrV4aXUc3t+yzMnCO54x4QNZjozUoUS6+OBrwKXuplE6MWNRi4X7A0pqtFeOAumQl7qwWEVgq7QXpY01i8qMFd3rhCm57Bkt6OcA6jtoP0yEvxYb+xBwkCUlvr1QOX2g9Q4tHz4bmnGM0MHpU/bNoi9Ks6ty3Icf6Z4N0UnFVAm1F26ImJeq7b28J3WMq3xRDg91fbRIjPSkvgEUO3XdSQenbdmHqvKEdoD+vx2vR8owdf2BYz51+4nJi6X6yNegQYO6BuA/Vem39Q51crkAAAAASUVORK5CYII=",
	HOME: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADGklEQVRoQ+2YTWgTQRTH3yQgxqxtiKCpG0092CB46MmLKPSiRFSiF5EebA6KBxWFIgpFYykoUqioBz8OiYh4s0XFYC/x4sVTDoJET9GsrYI1Dan1oI7MxombzezOTna3IbBzSjZvZv+/9968eRkEXT5Ql+sHD6DTEXQ1ArOyPEgA9yhKwS1Q1wBysjwCCGVU4RinEoqSdQPCFYAm8VS1SxCOAzDFuwjhKMALWZ5CCJ2legNb4+rH5Q/FRvZgjG/sU5RzTqWTYwA5Wc4AQiNa8QP3H6lf3x8fboIAjLMJRUlpIV6/+YL1UDt3bODq4xpY8ZRefHh/EjaNjoGvp0ed/qdahU+TE7DwfOb/cjqIjgDkQ6HQsiRlEECSKiPiY+PXmdylS+ebIDDATKBWSw1VKpUVB1DFB4N5hJBa68kwE09tWiAwLgSWloZWzRa/r1gKscRHTpyCvpNnrGQczN25CfP3bms3dqH34atBkOopR4creyAXifRjv39a6/lY+hqEDx62JJ4aLTx9AqX0hcYcX/8ASON3QQvhOABpDX4hlEcAIfrmdsQbQUBwrQrh21Ivv44C6MX7JQmio2PCnteHiUSiPDkBv2u1+k8aCMcAWOJJjV8d38ZMm77T9fqvH3O3hpnPfxbfqWeFHmLXkd3cMs81IK0BRmiKpg3xvJl4olAUgMxhQUCtym0CTQH0fY0V8e0CMCHIQ04TaAigF0/6GuJ5erqalZx2IkDXI6c2o/UwjAQTIBeNXgaANF1URLydCJhCAKQT5fIVveNaAIyaMiuep4vbiQAnEi1NIAug8U/KSmsgdHoJGrc0gYz9wE4hWc6GDxw6ZtSUCeqwba72T8+mHyQUpdGu00UNN/H81x8t/bltJTYWiKxfw9TqAdhwqtBU1yNQORoTEhR6XBKy9wB47vIiwPGQl0JeCuk80JVVqHfjZlj8/FFF6UqA+N4kFF/Wb+c8gH8p6VgvZOUcWNEUYt1VmlWidRe38wpV0+/frr4Vsje6YjGMgAfA8a8XAd4m7voUEtphHTTmXi12UJulV3sAltzkotFfkLi0QIdE8CcAAAAASUVORK5CYII=",
	IDEA: "data:image/png;base64,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",
	IMPORT: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABwUlEQVRoQ+1ZUU7CQBCdQfm2CfDvDcQT2D2B3kBM2sQ/PYJH0D+TNrHeQE+w9QTiDfwHkvqNMmY1jaQB2t3O1hS2P03D7Hvz5k1fAiC0/MKW9w9OwH87yO7AIExpk6hJ5LNysoKpxp0AzZ10DmgOjL2c3QH2DksA2QW4l1jTQudAcWCtXyHNDahdzr5CtTvSBGAX0PoVcgLcCmlOYOti1L0DmhuwmzE6CGQCiOeaw9pcTvQ4icVIF9PYgX4oUwQ80SVcVU9AL9NI+CZYxgK8kfS6XUgB8MiE+O8Mvc3n4GeJyExwjAX8/gIhhwSgnDgwISegDwTwJ5EYm5xXZ2oJyEUA4KtZA3Rcp3kWAQqkF8pRB/BBR8QC6GIWiUTnzKra2g7koL1Q3nYAr6o0tAC6m0XiukptWQ2bAEXUD+QTIp5uIiWi52kszsoaq/o5q4DyZKqXOFZXKAf3LuXh/heMi8mkEudzD4bZvXivOt0qdawO5ITFeOWIy3VirAgoJhNX4jSyQssk/UDeqOdpLH7uNi5rDthotnEHmhCxvQ6UfTVsYrrLHOv+W1vrgBPAbNHuOcA8QGtw25tC1kbGDNx6B74Bnf+zMeNz7UcAAAAASUVORK5CYII=",
	INFO: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAPMSURBVGhD7ZlNbExRFMfPudOGMo2NKCKmQyMSIhpCovGx8LGR2LBQJLohbSUsaikidqKi0mmJBYuqFYlELMVHfIZUwkoUIw3FQpiWGnqPc9+cwZ1505m+15k+0l/y8u75z8yb879fufc+mGACf6DcfRNpH1iKSm9GwPlAVE2Ic1iemfoU+pGoDxBfE1AvaXU1vi/8RD7zhS8DJmmlaC8RbcZUwgXDv+nj31zVGs/4MePJwLxTX+p0CHdwGjs5iUqRPcFGEpxGVwh0V2/ztLsiF8yoDKw9TGVvZgwc5r9t4e4wWeSxgWiI0zk+90P4yM0j+FPUvBRsIBpLLJHEd4lUFLhFLhCq1nhTuEekESnIQLQjsZ4ffZC/vlGkosImriulWl82hq+JlJO8BiKnvizEEN5GhOkilQQCGCCNq/MNcCV3V0y3USE8WerkDVyzYZ7h2qKdgytEciWngejZRFWqz8MmkcaDNUC6JdL5qVriLHK3QBL2FXvAFsg2RWXNUs7C1cD82NdVXPs8zwcFqo90JtZJYOFqYBiGd3LtRyX0RP2icnjcMNW5GpaUi+oVnK0I6iWwyJqFZHlQ0Byci5WzQ3BxS4VEKbZf+QYP3g5L5A1edtRmzkpZLaCU3i1Fz9RWhaT0BzdttLjlZhmoadOTiKBOQs/0vM+u6acf/dW+weRW0/Z8koQOlgFdPljHi7PlEnrGdJVj95PwaYic68TDJNzp82/A5JYsn2VVsG0AiGefseF0TxKWnRt0rvbHSVH9ozJytAwgQY0UA4uzYfqLzEGc3kEFGSvHohnglaR1jR00ggFEXv8EnpFagBex/xiZXahf7kHGytE2QPBeSsElI8f/qwUI4YUUA0tmjpYBBTjqc5lSk5mjbeDHuztE9EjCwGFyMzlK6GAZeLF/wXdeTlhfCBImN5OjhA6Zg5gXdOq8FAOHW26u50LVsUQHIjRKGBTOvmqq3CPl32S1gCEEoS7ucK8kDAJvNUK3lC1cDfQ2T+GRjhckDALd8cbKG1K2cDVg0IQxAhp3E7yNvKSxLCZhFjkN8O6/n0C1moNWkUoPwT0N+kS8seK1KFnkPdyd15FYrAHumbNKkUqCc7gLekO8adp9kVzJ2QJpXjZVPkNS5lDpVkopAURcYbQ7X/KGvC2Qprr980pA1cLT61aRigLX+mVN0PqmwNdNBRswRM7RZPVt4CgP7gO8uS4TeUzgZ/7kZ57UFeFD8QYcEjkvozKQxhy0ylmluaY6oleIBnkr223m+VxT5Uh4MpDmn33N6sZ4veieYAJfAPwCUgBp11ke9IgAAAAASUVORK5CYII=",
	KEY: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACc0lEQVRoQ+2ZwXUTQQyGP9EA5MolcOQWKiAlJBWwUwGkAh4VYCpYp4KEDkwF+MYRc+FsGmB4M9n42Xh3VjPWbvDL6j0/P9sjjf7RL420Fo5c5Mj953ED8DVnPOEUOMPzAuLrWfzcLktgDawQVsCSP/wUR/i+SLIj4GvOEd4BF0U7divd4vksjkWO3SwAvmbWOJ+zR+7amVRcaZXUAHzNBcKN1vBB6zyX4rjV2MgBEHgb+D6GrKTipWYjFYCYrMK3ToOea4jcDYm5Ehff98TXm0QPyR5y6W3C5mtNcmsBvEf41LWZVGXl2M/xCQBX4pj1RUELYJ46rYEAXIujsgKwQHiTOK0TcbG+qyXSSfiRsPlVHOd9BrURWCM8TRhb4HFd3P9Xr3G+jnnQLWupOLEBkOJq3w4H/K6hpi4CE4CyMNhFoKYvB8o8TGl5fouLjWFSdBSqSVehvl1KfveYVqHkPVDiX6+Ox/QeSN7Evc6ULPCY3sTpXqjEwT4dj10vFPbydZyixulGfZzSQsPXK6okbgCMOQ+o6BP8UgNoQAw/kSmT9z40WQAaEKF/CV1i6OftKOX5Asy1k1gxgG1Sbg0oAcyHXsLuKPMxPpWApbYJbLOfHYEuJ9uGk++/7la/er6vpWkTNAcyAbg/pccVgcxKk6LS+BQydD77HkidRAaF5lLhNAmqWTN+BO68MgPxUACYymjDr4eJgGEijw/A0PmpCu30Zi3PjhK90FSFTNrpAyLwH5bRmvAvQXhgu5FOChkmslkVaqa1HRCtAAydN61Cm7Z6KxJ7AIydHwTAdiR2AAzg/GAANF2k1RrTHLByKsfO0QP4C6yQAECw9mNGAAAAAElFTkSuQmCC",
	KEY_BW: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADqUlEQVR4Xu2bgW0UMRBFfyoAKoBUAFQAVADpACoAKgAqACoAKghUAFQAVABUAFQAetJasgZ717Ne+3bvdqRTouS89v/+82fsS8504nF24vi1E7Ar4MQZ2FNgRQK4Kum+pAeS+J7XrWF9XyX9Hl7vJX0Yvq9e/hoUcFfS4wG4BxBEvJb0yTPIvveQBAD8mSS+1gQEvJhLxKEIeCnpSQ3qxNhXkp56n9mbAPL6zYjcv0lC2uwqOU/uE3gBY1ELHnEzA5Sxjzz+0JMAAHyMjC3GgKmhiB+FO3hDEjuOadqAtHulJPQk4DKx8z8lPZybv4Mi3kq6blhACRclZPYigN3C6eNA7kgaqdcEyiJlbFpQISZ9pgcBgET6Fnyo8TXg47FI35JAKoyWyR4EAD4udcge8LU7b4lDCZAQpwPgISEbrQlI7f7kriRWi+lROuPOkJJnTdM9X2sCMKPYqXF7ypgnAP9lKIPxOBR0O0GCa86WBCDJXwbpuaPUhaEWUPzIFKEQ9t3Mey2Xci0JoLzR9ITA9ecYHyRCZipIAUi1YQ2R5ohy+V+0JMDuHP36c4/2h/ci9SuZcRgqO26DeThnhMimXksCcOA70SLmmB/DvSnAGGuGn3OHrpYEYFyx5DGs0Nt7hMAOM86q4M/w/FT7zLzMH4LxzN81Bf6a2WrIDr1/XAanzg5F89csamoXixYw9ZCK3xfN35IAa17ZUlQBMjfUpkC2ArUkYCkTnMPPwU3Q9gCAoHXlVNgjbBl8Nxy7u5hgCjwTcz6npPUIW4G6NUI58NkFNGDjYK3wGsDDp715Gj2ALWWCawF/kOPwWsBzYCL347NBtgUOqVergLWAB481Pn42ef6oIWAt4HPX7U0vRdcCnpznzsEeiYtvnuYooBa87dGRKpcV3Bd4PhjhjjB1vea6bvcSUAsesCkC4mNr+GgMIOHmmN6e43D4aCx3s8TOs8biG2cPAUuAnyKgpi8qynk7QSkBS4FvQQCljt5/1t8JlBCwJPgUAZQqLjdSH3SOKQK5c7iaBby0D1gafIqAsAmUM0yN/A6vcA0W/ACTBDA+UZznYyyOKaAW/JjZxWsqUWGNN4yOHZs8BcBzqjs6AjzgPWa3GQV4F3p0CqglwDu+Wd6XGlDRtfLIKmvHb4aATUg9x6anCuTeuxNQqNWj9YBdAUYBq9zpnh5wtAQUpvq2/g/JUwV2AgoZ2FOgkKhVvG1Tu9WCsZ2AFqxu6Zm7Ara0Wy3WevIK+AdLMdhBG1dWVgAAAABJRU5ErkJggg==",
	LEDBLUE: "data:image/png;base64,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",
	LEDGREEN: "data:image/png;base64,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",
	LEDOFF: "data:image/png;base64,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",
	LEDRED: "data:image/png;base64,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",
	LEDYELLOW: "data:image/png;base64,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",
	LINK: "data:image/png;base64,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",
	MENU: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAsUlEQVRoQ+2WMQ6AQAgE737qJyytLP2EP9XYa0EYYoC1Z3PMEGSO5N9M/v6hBv42KAMy4CSgEXICdJfXNbBsx+XGAwac+/oK+9OAGgDpP1H9DMAAw+LqbqEwZHCwDMBAzXEyYEYGF9Q1oFMCHpV+p0T6EYInICyu7hYKQwYHywAM1BwnA2ZkcEFdA+l/ZGoAnvV+xxwMMCyu7hYKQwYHywAM1BwnA2ZkcIEMwEDNcekN3KU+MDFWrj5uAAAAAElFTkSuQmCC",
	MINUS: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABYElEQVRoQ+2ZPU7DQBCFZ5z0cIOExlCGihNQYx8ByRR0cBLoKILEEWzqnIAKl5jKOQGhhwwKcoSQdouHZ+0Yjev5ee99W3mYBv7xwPWTGeiboBHYaQIPR/n0c803xDQjomnHYmsSKkeRXJ+/pLVvt/cJNeKfiWm/Y+G/1wmtRpEc+0x4DczjvGDms17FN8tF5PHiNU1cWrwG7uPirff0fxTXWZUcYAYOC9mF9Lcasipxhu0nYAZ0+RkB3TzxaUYAz0y3wwjo5olPMwJ4ZrodRkA3T3yaGoHTuxN8O9CxuHxyVpuBbSyDJwC8BtVStSekqgoYZgaAsIKUGoEgsQJDjQAQVpBSIxAkVmCoEQDCClIKE5jH+YqZ94KogYfKMqtS533i//5e3xw4PtZU9k1BRN7HEc3gA8eGcmPilr9PTDyBybdqkKUIleOIrv50Ymq1u8NmO7N2GLZzlREwAi0T+AKIrcAxk8no3QAAAABJRU5ErkJggg==",
	NEW: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACKklEQVRoQ+2Yzy8DQRTHv3MQTuI/wE3igEv/AAQHEf4Cu4kz9U84l6sI/oOKi920KxIS4VIJLkIrfgQRoQfqV54M0WjT7o7pzDTL7nH3zbz3ed/3Zl7LEPKHhTx+/F2AxM4zKVRnKR5rtBXuV9yqqgKqAFqaGO4Ln7nQAqEdYLijAZu5N20Q2gHGOhvw8g5saYIwAsDrRxeEMQBdEEYBdEAYB1ANURcAlRB1AyiHiMcapaYC7QCit28EUJ4pVaNEpEBABqIeEC2RILuoiaMmDqqRgO9RCUUl9F9K6Ow+hdvHA+QLJ8gXsp/YzU3teChkl4ghuT7urPwmF8Yusqv8NvZvFvD0cu0bHwE5RjSdtt2kCIgRgP2reWTvVkXiKdoQKOFZ7nTQIu0AMsF/B02EWc924n4QWgF42eyez1T0nxpfK3nfvzxUOU6iMb9y0gqQOprA0+tNTQC8JzzLaa+mgjYAftpkLueqqi+sAN/BRwVtAJmLBM4ePFUAy2nbtSptpg1g43gS+edc0Wd5xoNOl9KeoEzacnuMAqwejpT4qw0ASFtOxWRrUyD0ACpLiIj2PNvtNlpCoW/i0B+jXG4lFxnh1LOdNuMXGXdY11Ei6JwW/d67OJhgDFOi9j/tahrmZBxWWyMDIRI89yf1l7YMXN/iwCiBcTVa/dYT4ZSB4jX/oJEJUmQNBwEwSkA3Y6zra1ajPQZkACRFA//2ZUwBETgZmwhAJmsq13wAZXS6QJplqvsAAAAASUVORK5CYII=",
	NEXT: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAETklEQVRoQ+1ZW1LbSBQ910WFTEVyyAqmWcGQHZgVYFYQ+Iz9gVnBkBVgPux84lkBZgVhB5gVuLOCgOXUjB3Kd6pbYPRoqVuyXBlPhU8s9b3nvvrcI8KG/9GG+49fAH52BivLgOhN91DjAzD2wBBE2IuCY8YIBAnCCAu6lm1vVAX4lQCIz38L8OMJwE0CiSIOMVgCNARtXciPv8ki70afLQVAnPMOXgXnRHRU1nA8OzzA3D+Vp3Rf9LzCAER/0gTjkoh2ihrLe56Z70E4lq36sMi5hQCI3kQ5nhl1ZlzrsqixxILun+v8qT92sFBlxk0iHGQ5ycwD2a4fu4JwAqBLZnt6SUAzfTA/MNc6mL8ZupZAWILfm0SLLkBvk2cyMMTMO3Y5zw1AP7gyOc+MT5h7XRdDpoiGQKYdIvxpAiFb/qEtE1YA5rLRUW9UNQpViREtbpLZYMaFbPudPBC5AFTDEugqNjGAO8y8RtmoZznzNJKHBPwRt8eHeY2dCeBpVI7j04YfeOaLqp1/dliBIP4ximZCT6e5v5tlMxtAfzIg0If4vKb3VZVNZiZ0OfFtIgt/yVbdOP2MAMJIPI4TVOCTbPtntqaq4nfRC86Sjc20tWu6sc0AekGXCCcvzqxWOqI/GWRFMGs60XagqMZyxGY1tBlAfzKOchtmOpZtb1A2urv9gDWZm3v7rv0jetMjIr58tqm4k2zVd5M+pACEIy1RgzPvnathE0gFQP1fNyRq+y59pIYIbU+/2XrQACBef4oeyLZvuIHd8/EMYBlNx4yKXjCM0g4GncqW141aNgGIv+RoLA9OEsBTNqycR/SnHQKfvwBPB9ME4Da6jDBhX370b9zjnX7SBCAEkd8X4nPQIMaXCICRbPvvczNgSHdq9mc5VAZkXl+Y+nHc8mNBT2Ug6VzyBeVklQBsfWHz5/8PgDlNH6rNQDazLVVCoh+MooxwrU1sYbapJgbuZMuPqR0/b4yCMwnakp2WHKMxIrWBF9n6qATgvsmVphJ6TPYmEkS/20ac69zXZK7gJpckc2D+Om7XU+KZE522bUU2IGXoNF4FsW2wGJ3e9IVGRVRF7T+zUuaoE7lLfXoryl+wbaVk+10rE4sft0WEhOKyimKQta3DVRRl4xqpnX+8SsnyKCmrvFwmplJy36xsUdflqr4tYPElKRivLGwtQSQ2o+V4JZzhH++i7LqptafX0xNipNQO1wvUKi3qCIUa5sCkKoeyeK2D2ZtrVyChWPz9ALzommR6rXLPvSOX85wA5JVTbOlWqrKS19XXF6aHmLxO/BZMeyBumFXu8CSXssndyGw1G+qlGJhkcdu7+b/zAwNHa/3AscyELoGgm7wnygJQUcfcO3MpmaSNQiWUfDmc249KOWhGuZMTEOavrL/mbHVXGckrAYg6qkchoQHmBggiLZPjDqw+s9INGDcu4pZLICoD4GJsHc/8ArCOqBY5c+Mz8C9G99dPFG5qWwAAAABJRU5ErkJggg==",
	NOTE: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAICUlEQVR4Xu2dW8hmUxjHf2OcT0NSImRGbgg5zORs0igl5xyupDQOcYmEFBKKKIfIlQuHnImLcRi5khlnuXAcRFJynEEx9J9ZW9s772Gtbz373Xvt91n19fX1rfXfz/o///2sw37W3vPwMmsMLABOAE4Els2btd7PYH83B5ZUDgcWA/MrHlwA/VTEouBw3eVLAd31Q4sLoB8C+F9YBxbGdssFEMtUt+qNDespproAUthqt250WE8x0wWQwtZ06845rKeY6QJIYavZumZhPcVMF0AKW/Z1GwnrKWa6AFLYyq87lbCeYqYLIIWt9LqthPUUM10AKWzF1W09rMeZubGWCyCFreF1OxfWU7rkAkhha2Pdzof1lC65AOLYKiqsx3XJh4BxPBUd1l0AKQz0MKyndH+Wh4DehnUXQA9n6ylOBT4BVoSfZ8e17XME6NVsfYIAfgReAV4KTl9Tq//PLAlgVsL6X8Abtbt8FbB+hKN7LYCZma0PhPWVwK+Rw0KvBOBhPdLrfRoCPKynO73eovgIMLYDedy03rqarWvy9mpCWE8x3AWQwlbDdTVbl6OrJVp9tt7UpV0ATTEbgTs4W18N/B3RzrKKC8CSzQgshfVqPa7Z+i8RbZqs4gJokl2gjbCe0iUXQApbEXXrYV13ujZhph3WI8z8r4oLIIWtEXU/rU3cuhDWU7rkAkhhK9TtelhP6ZILIIKtKqxXk7euh/WILvkQMImkksP6pL75TuAQhn4Kj0ynuQmT4qim6s7sENDnsJ4ilpkSwKyEdRdAjYGnaku0L1KYmZG6vY8AfU5rs9CoC8CCxYIxXAAFO8/CdBeABYsFY7gACnaehekuAAsWC8ZwARTsPAvTXQAWLBaM4QIo2HkWprsALFgsGMMFULDzLEx3AViwWDCGC6Bg51mY7gKwYLFgDBdAwc6zMN0FYMFiwRgugIKdZ2G6C8CCxYIxXAAFO8/CdBeABYsFY7gACnaehekuAAsWC8ZwARTsPAvTXQAWLBaM4QIo2HkWprsALFgsGMMFULDzLEx3AViwWDCGC6Bg51mY7gKwYLFgDBdAwc6zMN0FYMFiwRgugIKdZ2G6C8CCxRYxNhvzOZgYs1wAMSy1VEdfQDkEOAw4ANgX2APYDdgO2DJ831kvvNJLp78Hvg6fj3kfeBPQ73GvqnUBtOTcUZfdFTgt/BwLbJ9p38/h9XfPAPoZ/JaQCyCTYKvmcvZlwfFbWIEO4KwDHgPuDJFB/3YBNER2LOxRwM2ABDDNog9GXg18NO6iJbxha6yCwxg5TWJjr7UzcAdwfos2au6gecbI4gKIdWdavSOBR4C90ppNv7YLwJ7zc4CHwgzeHt0Y0QVgS+i5wMMthvzk3rgAkikb2eDo8Em4pmb4dpbWkFwANrTuCHxQwpg/2F0XgI0AbgWutIGaLooLIJ9vLfe+BbbOh5o+ggsgn/NLgXvyYdpBcAHk864dt1PyYdpBcAHk8/4VsGc+TDsILoB83n8vdfxX110A+QLQE7ht8mFaQVjnAsjnfQ2wdz5MKwhrXAD5vOujVafnw7SC8KQLIJ/35cD9+TCtICx3AeTzvgD4JuTw5aNND+E3YHcXgA3hNwLX2kBNDeUG4HoXgA3fSux8F1hkA9c4ir6wejCw1gVgx/XhwOsF7Alo3+IY4C2LfYD5wEFj8tr1gEQHG/4cyGuXAvX4VHnt+r1+jB9KyglUuvcTgHjpYtH5gTOA5yrj5hIBdgFODenNxwF6Fp5T9Fn3l0NOu/bVNTmpl5IEILvFjfIBu7Y5pA0rZSw9Xyc3RQBKb748rHl1YqWJIiMfBe6KzWvv6G7moSE/vytzAkVc5Sq+Pei0GAEcEfLaj2/C42Mwo/LaOyoAdWsHQIkiF4VhcMr0bbichlbtUVw15MTQhgrjBLATcDtwQYskT8xrb9G2WIfq7N9NwEmxDYzqvRiWpu+MwxslAN31GsdK2OOOiWJGnGbBaFjQ0TCF4qbmB9XRMCWobJjlTyrDyDs75LVvNalxR/5figAqujRpPjnMpZYCmlTnlB+AlYCeSbwQVlvReIPkSZ3Ka9fSrZRSmgDqvMr2/cMRcR0P30/bs+F4uDaXqkihtbtWR9+F/MOPgQ/DXa6zf5NWSiN9WSdPx5mkpKZm+E0JqmQBNMVJNG5FnsKSXjRQwpg/2DkXQLS7N61YkXdLWCpkQLXW1AWQQb3IU167Hmc2NTPNMC+qqQsgiqbhlUTeJcC9GRhtN3UBZHhA5Om9Mtq/LrW4ADI8J/K+LPFQY63PLoBMARSd117AVnCGe5pvqrunZAHI9m2bp6m/Vyh9CFBO/j79dU/zPZMAng7JHc1fzf4K2v8+0x52dhAlgIuB+wrtsp61P1Co7Z0wWwJQXrtecFDaWLo2PDjRO3S9zJGBagmlhIVr5ojRVjPZfF1bF+/LdSsB6NHje8DCQjr2WchrH0wgLcT87phZ30RZHPLau54I8kd47+6q7tBYriWDu2g65fp4x/Pazwrb1+Wy3iHLh22jSgTKCuraW6+06XMeoGxhL0YMjNpH1zEnvXe+K5ssn4dkytVG/XaYwMC4BylaHt4GXNhijqDy2h8ErkhNdnQPxzEQ8yRN37PRBw+WxUGa1VoRlqZ+15tRuilQjACqVktCXrsmYU3NDzTD1yT07nBwtMGuO7QYSBFAxZhODOnFiJos6riY/s4pOhz6Wshr18FF/e1lSgzMRQB103R+4MDMvPZJx8OnRMVsXuZfb9CcCD65looAAAAASUVORK5CYII=",
	NOTFAVE: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACr0lEQVRoQ+2ZQXLaQBBFf1tkHVMl1sEnCD6B42UqJWKfwM4NuEHIDbhB7BOEoEplGXwCkxNYWUMVZI/crhEogBGaaWUGoSprw4LWzH/dPT0zLULFH6q4frwAlB1BpxHgcfhOAVIjGLoCdQswCX8lAH5wXjmAxPuEBACMc1dRcBYBXng/SSEAQ1dRcAKw4f00dxxFwQ3ApvdTBCdRsA6Q6f0UwaudUP19ZHNB2weYhDcArnaIvCU/uD5YAJ7+bCKeP+QKtBwFqxHgfO+nXFajYA3AyPsO1oI9ADPvW4+CFQCR9y1HQQzA02/HgPcW8VETxE0wWgC3AGrKqgtHAI1AGIEpgvcYAfFvql/OJONkAmSLxPHa0UAyRxFbdXqdmcBtAPAk7AF8BZASe4APzwBSVayTitsEUOkx9/ogOjtA9QDzHWrxxXqaZaeQrKLsizVz/9i5iA03pVLFJ5elPAUHApG7c2vLaMkQ2mOHFiC5EZazJrTitSm0nl57hjASLwLYYySMxYsB9gAhEl8IYAEx6AP00W4N5e/kty+kYxot4ueDVh9gHN6D1CnU4sMYUSM4lY5YMAIhSycysSc/EOsRv8DTHy3Ej/cmgsQ23tEp1T+MJO/JASaDa4C+SiYR2F6SH/QF9vIPHDwOuyB8lkxibMv4Qo2ga2yvO8xlDcTjwdDZfYH5jhrttCFsxFEkhR4M779/AF56k9TvG70ijshvn+jtVhYFALQV6C8YveepsEw9dRV8nSdQWolEALmNWyARjtq8t6uzkDQL5rUOCLtBhG14GUB2BdIK39rJVyAZxYA/kd9WDWKjRwawXYFu4dW6RVvmy4aYWh+rbrawEgkB/lWg/xK+HZGkq70AEVYiGYA6hXqvOkU9rsuJNCKSbwgiAJ2AMv5/ASjD6+tzVj4CT4tFLkA6nL+ZAAAAAElFTkSuQmCC",
	PASTE: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACnElEQVRoQ+2ZP2gTURzHv7/kQESkDoKL0hQH1xREEAQdapEWsa0O9s9QNA5OJiAIDg4OgiCkHaSDFTrYVERbS7FD66A4CCo0q4OYoosgeCCi1kt+8u7M0RzvrveaXJOr76bk8u697+f3+/7ee7lHiPlFMdePhgHkZ+ZSZFXyIErbQWEuspHI5Qb7S1EGqSEAjnheAWFPjViGyQZ1RgnRGIAHs08JOMOMlzBo1IaweIoIxxmYz40M9EWVhQYBPDEJ1MZJ6qhG285KmT8CKGVHBjqaAnDi/GjKoGSegDSIUkJEb0+PRAsDIFi/OHU1c3ZVNLhTmD1mVPAKcH7zXs8WF51bzCUGihaXcy8eTinXi28GbPGJ5AqBanwtB3DlmVYCp8U3o4IFwFMT6yhcgH/3GGxalXKnKoQvQNdQxva1N3L+ALJIy6Mv+vQC2MkA5p8XJpXqJQDg4rdq9Cdu3cDB9gM2y/j03AZ2FqLFFVxeV4b77VYfVj/h8vWbrp2WZ+4r1YvvKCeHMlUlWJq+54qeeLSAtT9WXTW5e9dOXOg75fbRPXzJ/bxcmFSaWJQBPn/5iqXX7/D9x89NQQjx3UcPY/++vc0B2JTqDR7a0gxoAEkEdAZktvCbhbalhcbfrkXBVdNn9sgO6YypPI3KlGqAEPnTGQgKkraQtpAkAirrwLaz0O3H70OYIrjJtXOHmrcOxB6g7vBLOtDrgMo6oGohr99lY21pBmIPoGug2UWsaiFZxvQ68F9vJWJfxKo1oNeBel+rtOR2umswYxKhTcCtf70em7cSfgccMoDe7N0o6ra+/wPO+ZhRrGYhSGFLAgjBzjmZMQZwmkDtfhAtCxDWF2NvfrunOWGfUW2nvJ1WGUADhIhWpBkIMX5kTf4CcpaQQBqUGi4AAAAASUVORK5CYII=",
	PENCIL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACQElEQVRoQ+3YzysEYRjA8efd2rWH3Sg5SKKWciQHKaU9KiXlD0AOiHIRBzlIOThwcHBQuJHLXhxQzG6Jk6Ukhz0QDgqtNtma7CuyYsf8eN953vedLXvded/5ft53d2YaAkX+IUXeD/8A1TuofAfoMqx+LAIZhD6exVAK+Irv/Qpf40EoAxTE5xefGaEEYBLPhZAOsIlnRkgFOIxnQkgDMMY7RkgBcMY7QggHuIy3RQgFIMVbIoQBkONNEUIAguIBKKyTIcjfuT9R6ACZ8egA2fGoABXxaABV8SgAlfGuAarjXQG8EM8N8Eo8F8BL8cwAr8UzAbwY7xjg1XhHAC/H2wLoAdTCi38PbvU6npdOpmP+eKrknd/yaZQm/L1AfauQyaXQEIjx9jsQD8QASNfn6mAgkOPtAVogDYSUfm+vG4SAeEsAPfA3gs+XNPw2eRCC4q0BiZIxoLDw55+LBSEw3hoQL9EAoN306uAEITjeEpDZCdFQULe+ulkhJMSbApZmW8fO7ysX5jt3gQshKd4UMDcdPd5PRVoi5U/AjJAYbwroH+p5vXkuC34cwIS40Q8L39vw3mGdjjPciVdmm2o2L5qvfk5giqD0GQhoQGgM3nSNROHXOKcRbo4zABZn2ua2LxsmCyf9gYgDgRi85TQS1U/dnBxjrAEwMd6ROrmriuQnry5NZ+srHs/CgezGyNTRIsZJMecwAIZHu9PhYPahMpzZCvlelgemkteYJ8SeC/3dKHag3Xz/ALsVEv190e/AOyh+IkBLZKAwAAAAAElFTkSuQmCC",
	PIN: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADEElEQVRoQ+2Yz24SURTGzxlCIbE1k1hidFHBGBNc0aXpwqH1AehCXbiQPoH6BPYNmu5MXBR3UhfUvfxrQtyWjVRjComJUVsTGvwDEueYGTsEmpm5d+7MMDTC+nDn+93vnO/eGYQz/sMzrh+mAEE7OHXgv3eAMnEZIlgAlR7jy9ae0w0JtIV08TNYBsQUELWBKO0UIliAe1cfAcDGYNcFIIIFuBPPgiRtjbSNQ4hAAZqKLMfkufq5SHhBFCIwgIYixzEULgBA6tJsBM5HZ0bnl9OJQADeK7GUKpE2vLKhWhRi7ACN5QtZBNwYFu8GYqwAjeX5dUR8Ypf1Fk5UcbupmP1vbACNlVgOAR7wHFSXZ6Nf5qLhi/9qqQ49UnCn1Q4EQEuaXihc1oaVRzwQ1CNqX4nH5AxIkgw9NWclXlvPVwf0YQ2BlvN84oGOpT+oXK8ccl8pfANo3J5XUIWC2bBaOUFI6eTrowqXUydFrgBIO0kRH+p3Gb1dYQckdXP/ayeOeOqEZagiUteSpW85J+JdtRDdTeQA0XQoO93+20/fuzd4xRDA82TxMMtbP1wn5ICdeGPxn73+h4+d7jWWKCKqJktHphHJ+q+wA3rrnL6EmTyNCXGSOIlK2zQifQPQ2901hPPE8fwccAMhkjieA4g6IZo4vgA4gWj/+l3//KO3J5o4vgEUirXslXe7W4vVZ+y5U9VFp++9dosKxejwgpp4RP26AAv7u8CGoFeYb2bYpHwVrgCGxRuPY0NQC/PNBJ88dpUwgJl4fR4I1jJP74PlOUFwjNsHgzcxtkT7CiEAO/GrK0v6fcYyYoksX05EYBwD8Ig3hJhCoJrGFy1HN07PhtiJeAuITcwfaB+zPPtxOyAifgQCUcHtptCN07UDbsR7ttUWCzEdmGTxGpMtwKSLtwUolN8oSKr2NWHkp+W8EZV+twfP+pYOFIq1dUQY+Qg1aeLtHSjVKghwa5AkE7bzhi47B1qA0AKCCkhSZTV907PDh6c1eGuYKcS7UFB1U4Cgdp45A0EL433+tIV4d8qvur8NuYFAiQkJ+wAAAABJRU5ErkJggg==",
	PLUS: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABYElEQVRoQ+1avVLCQBDeDfT6BkITLbHyCaxJHoGZUNjJk2hngTM8QmLtE1iRklCFJwB6ZZ048QcnN1xIyJHwpb7cft9+3+7dZMNU84drjp9AwLSCUOCoFZhc+Z2PDT8QU4+IOhWDjUkobFkyGszcWBVbaaEU/JSYzisGvh1OaNWy5FpFQklgbPsBM/eNgk+Di8jLcO46WViUBJ7tYGk8+7+IYy9yuvkIXAZyDNn/xuBFTmay1QqcOoHbp5sfAV/v3gqLWbkCIPBPMyiQ18SwECxU8ByAhWChplror7fztlad9aprR2kHGQjskOHgCujYIFmDNoo22tQ2ihrQzQBqADWArxJbVVDaXWjPGiz82ukRGNv+ipnPCqeulA1k4UVu5nyiuZ/XkwHH+4ZC0yqIyLptUS/3gCNRPiXxyF8jJr4oxQ3am8hChMK2Rfd7jZi04xheiDGrYQHwq4FpAeqvwCfMWv8xyqGS3QAAAABJRU5ErkJggg==",
	POINTER: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC6ElEQVRoQ+2YsW4aQRCGZ9KCZKeCLntPYKdHilPhzklnV8ZPwFFB6YgCqIIlSqRABQ2S3UFFCj+AHwDEJBV0tgWUmWguLEKWHeD29rCl2wqh29355p+ZnV2ENz7wjdsPEcCuFYwUiBQw9EAUQoYONJ4eKaCU+gIA3xeu/EpEd8Zu3WIBYwUcx7kHgD3Zk5kfAOAoTIggAFiMz+fzUKlU5OcjM38KCyIwgH6/D91uV0OIGhdE1NgiGnx9GiiAWBA2ROAAGqJWq/FsNkPbSlgBEIjBYACu62oIl4iufMXImknWADRELpeD6XQqOdEgoougIawChAFhHUBDlMtlGA6HgSsRCoBASBi5rqshrgFAyqwcgkYjNIBnIKTl+GwKESqADYjQATRErVaDXq8nOWGkxE4AdNBLYgsEAPxm5hM//dNOAcRyDeG3k905wBOIOyL6uE1ZCg1gPB57jZ7OAWk1ZMj/k8lE2/xrNBqpVwmw2qW+YOADM0vPtFULbk0B8bDEd71eX9p7dnbmeZyZmwAg1UdfP+/9JLAsbAVAjM9mszyfz7FYLEIqlfIgtAoCQESZbULlpW8DB7i9vYVSqfRnPp+/k00PDg6gWq0uY19UWHSnDhGRKUSgAE9uYzeIeCIGtlotSCaTnq2NRgOazaYXRkGoEBjAyqVejLsiIlcpdS0Q6XQaCoXCUoXT01OeTqePAKBeQy+0fFYRC1evkEqpI0Tsx2IxaLfbEI/HPYiVw+sbEV2ahJGxAvKwhYgS5PvPlUHHcSTOP5yfn0Mm8y9vpRJJLjCzVJ/3OwVYt7lSKoOIPxKJhKeCHisqGD2/GCuwAcA+IooKe5Inx8fH3hTpRjudzjJf1q1jrYxusrFSqoqIWSmph4eH3nmg2wdmlvdUuaH5GtYVEKuUUgoRR6sWMvMNAFSJ6KcvyxeTQgFYQMgrtgsAEk6XQRxism5oACZe/t/cCMCWZzddN1JgU0/Z+i5SwJZnN133L4CJCU9honI5AAAAAElFTkSuQmCC",
	POPUP: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABx0lEQVRoQ+2ZMU/CQBTH3zOUuEkixtV20kUxYXKQMlAHFjBuJuro53DxKziiH0BJDINlAHYS0YWthMFJY3RxoMQzVzGxWkgOr5cWH1uTu9ff//9/70hbhJj/MOb8MLsCcqXaLSBkIpEQg06rWtwMYhmbQK5cY5GAH0G0roqBrCRAVUr/L4G640ZqBgqGJjYDJEDycFACkg0VLkcJiFp22X4E+/7Z27azvgjlbFq0hG+90gS6D29wet33AZzs6bCSnp9ahFIB3P1q+8kHW8qmYTe7FA8BsU+A28xTuBnNwP7WMmyvpqZ2n29U2kJ/Ih2zmQSE4apITeUJHJx1fXwXx2sivL/WkgBR+yiBH45RC1EL0Smk+KGeTiE6hejFlujBO3m98j8yufj0QCPbT/F6wi1kO4MOAm6I30r+DgbszjKSgZ+7pH7ks51BBQEPJ0lgwM4tI3kkS6ZUARzKdtwmAuSCABlAyzI0UxY8ryNdQKPHUi7jIvztx9tAQ83M6/gSaQFeCj2WwfdhExAWPFgGr2wuYVo6dmTCh5LAF2C955rAoOFdI+QLutaUDR+qgM8kht6wWnqiEgZ86ALCgv5eV/oQq4CeKQEfNYYAQAUcu4sAAAAASUVORK5CYII=",
	PREV: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEQ0lEQVRoQ+1ZUVLiQBB9TVm6WybonmDDCVZvgCcQT7DwKXyIJ1g9gfgBfsqeQDyB3EA8AeMJVgnWLmjRW5MAJmGSTEisXSz5nWGmX/frnu4Xwor/aMXtxweAfx3BzCJgNYc7yPE+GDtgWETY8YJjRg8EAUIPE7oWNaOXBfhUAKyL3xb45QjgEoGsJAYxWADUAa2di8PPIsl/vXuXAmCd8TbW7TMiKi97sT863MbYPBbH9JD0vMQArNagBMYlEW0nvSxqPzM/gFAR1XwnybmJAFjNgTQ81OvMuHZokWOBCT3MeD7Nj21MJM24RIT9MCOZuS1q+YouCC0ADmU2hpcElBYP5kfmXB3jzY4uBVwKPpWIJg2AtoJnMtDByKjonKcHoGVfqYxnxinGRkPnIpVHXSDDOhF+qECIqnkQF4lYAGraOF4vZlUKJcWIJt1gNJhxLmpmPQpEJACZsAS68lUM4A4jo7is18OMmZbkDgHf/PfxQVRihwKYlsq+v9rwI49MK2vjZwZLEMTPPW8knOo0Ngthd4YDaA3aBPrur9e0mxVtQiPh0IlvA1H4Kap5ZfVTAnA98dIPtAKnomaexCVVFutW0z4JJjbTWkH1YqsBNO0GEY5ejUlOHas1aId5LQ6kpC9t2LLVmJfYsIRWA2gN+t7ehpkqoma04y6W69PSeCObuX7VjK1yEVQqE/HlbF32TqKaLwT3L1zglrQAB0fGF53EdV5cTG5miZ8KgBOF4a+4HFQA8PNPtgeiZipeYL8vrObQ5zG5mgaAE82m3fG2HQw6FlWj4b1ZBcD/Jw36SL4HK1YmAFrDOoHP5jRSOFMF4NY7jDBhTxya3YhWwOG7aj11BC7sIjFuPAB6ombuRkag0LI5jndueP1810nwuD1BwKp8DO5ZiEAQgMqLKr7HGaezrrorzp73D4BZ3T6EdZA6ng7bkwmFrJbd83aEsUm8MewGO8iZgZknMXAnqqavYLzLMuprpFbwIUvXSngnqzQUchu6JVoJyd9CcyBA9PX1AUnYzE3zIhWAYGvCfN+v5RfEM612Om4qUr7SKdtprNu+aTBZO73qA43TKvxPI2WEOhE51C9ORdEDdppHzHGaFIsnz7dJhITksoqUyXNrB2kUZWXOOMa/XC3I8lhSVpldoqYSPwC5vawUirDONrWwNQcRmIzm5ZVwgj/Guc64GTpPfBoeEWNB7dB9QLWG7umg3lapyq4snqtjtHmtC8QVi5/2wZOGSqZ3VO6xUdY5TwtAFJ18w49UlaW8Lr++MD365HXiLTDtgLioVrndk3RoEzmRxVUSVy9FWyWLx/03ep0fGSi/6QeOeSQcCtgN1SC/DAjpdYyNEx3KBM9PRKHgn926/SKVg5K3d9ICwXzPztectUaakpwKgNdQpxQSimAugmAtyuS4A8vPrNQFo5tVCc4MgJbX32DTB4A3cGqiI1c+An8BEmuqT9G3gfAAAAAASUVORK5CYII=",
	PRINT: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAB+0lEQVRoQ+1YsVICMRDdpbFEfwCxshQba6CzEQs/gOstsNLOsdNKCq3vPsACbOwOahuxtIP7AbzShnVyeg6XRAgcl3CanbmZFMtm33ubJRuEnBvmPH+wAEwr+L8UaD9/kA7GWwcbysQqO7LELQBF+awCvxFlS8iWkMiAUheq1+tR+zy6flLkMJ3b48VhFMD3/bn5zXVggSyABQVJrUCz2SwDwC0AVBCRrY0ZEQ0BYAAAZ57nsXXChBL6Tv4FETeNZS3ZmIjeAWCfByEAcBynAwCNdUp+Kpeu67rH07nJFBivC/vd0y0AImjcM/LZkoae5+3MBOA4jpYbp4rCEQBWDnfjH3fXdROky0pobQDIQFoAKtJn6WMVyJJdldhzFYjvPSrBTPjwFzyhC1kAGcvyPxUIwxDYp9OKxSKwj7elFAiCIIpTunrVgiG43Pvar1RaDYBYAZ0AVqpATIPumVgmt0oJsburWHwGhnoJgJHv+4kJUfgfqNVqHUSUDjQyBW4e3lKfi/OT3USMeCbmAxNRt9frzR5oqtVquVAosBlUUMEwgHAymVT6/X5iLpY+qzAQiNhGxAoAbBs+AyMiGhBRi0+e5aX0LhQD+JNvo8ucAb7m+VrX+ryeewCpW5AkgFYFLACdCmTBdtqYC7XRtJtl8XsLIAtWF4mZewU+AY1P/DFu4PAfAAAAAElFTkSuQmCC",
	REFRESH: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC+klEQVRoQ+1ZXW7aQBD+BqXPjRTz3OQEJRdovCcoOUEjBZ4LJ2h6gpJnuxI5QekJlp6g5ASlzxiJPhcx1Vp26oB/ZhesgoqlSJE8P983M+sdZggH/tCB48f/TeDsVrcbDXoLoJX82SR0AmCy4sZoHr75aqOYlXXKQAL8E4BzV8dretPVivvzz2pka8+awFlXDxqg97aOJPLMNIjCq75ENpWxIlAn+BTQCnw/D1RPSkJMICmbLxuGmR9AGMwCZWpa/DS7ugVGD0Tv1pVWK76WlpOYgNfRUyJ6lTpj8C8CfFvg62ANEQbGBHqZeTedBf6FJBoiAvnR58ttwacA42yAvmcBS7MgItDs6OGzVDM/zEJ1I4mQVMbVh4xAV08Aev0XzO6iX5KFySzwL6sCICQw5qyhWeCL9Kqcb54Hez8iIM2uvWFb8K7yRwKukduV3jEDu4pkauf0Rp+a/xdDtZDY3rsMeB09AhFHgX99cAS8ju4RkWnTwcz9KFSDKhJ7k4G8dgKovjD3goCp+5MT+kGEuP6fGkbGYrnki7LzsEEgNvYC07XusDCTpitd/sa59NDlGfK62nSjV3nvmDGOQl8VAcjNgNfRPhHpqvpLalVFoRpLZHPBd/QdEX0o02fmj1Go7vJkCkvI29KwhNAuAlV6BkpTC/4WBcqXAM2TKar7IntccB5KCRSdB2b+uVyitU3d5wF1aRorv0KunzeXzNRCwABxuWD2ikBCIh46RaFqu4CT6NSWAePctsmSAF6XqZWACyBbnSMB24jtWv6YgaKIukTGJTsufiovMgOk+U8GW/w4C5RZnJQ+MgKHPlo8+OFuchM/H68zFkSstp1Qx+N1Jp39NWaaxShUovWVqIQMgcIFBzAE+N6WSNIkmlXVxpRbOlo3uMQEYhI17sfSk1rbiil1UCcJW/DWGXgicavbRBhkV05Vn7uy96bmmdGT7sWytqxKaB1EfC4IbZBZdGcXIBI6/Ag2i26MXICnHrYiIIFZt8yRQN0RrrL/B7MVskAq79KcAAAAAElFTkSuQmCC",
	REQ: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACrklEQVQ4T31TXUiTURh+zn6+bZZWZqFumpqiCGqRGnQhSkhgYVsXdiUu66K6CENI6HdJFEGg91E6u4tqMyLwDxMq8Bd/qJw/beqEgU6tOTe/79s58X264Sx67877vM/zvu9zziHYFZPXKvOVOt1DouIKmUptoKIA6ve5Bf/6EPH5HuS97R/fSSE7DzP1F21EpTGuj/Vjc9EJJvAyTFRqKBOSoEg5Crq5YT/xut8U5skCzOnUOp8/mg7OOQy+4c+7h4o6K1IyQePi3Rt5uVllltagLCB15j2Lxt3kuOJSmfx74FOUCEtMBdXo7Kc6HCYye89cBJ4OLLe3/dU5x9qLEANGqssQq4yGhdRsiCGhmEzduNAZmPpWHnQ5oio0+jQUdDvlnK0kHfolVxQe2rMPgm5vF5m9e8XtbW/TS4ZJI8fkHAOnT8OB0+chiUjhc7uwarcCvjVsTI7KKzGFAv4E/SKZvl3LVt69lAsTjDXIeNL6XxNHG8zw2qzySr/ik0Act6rZ2vtXEZK2sgb5T/8t0lNvhuONFekccFAFrMYeAvlRV+X2ddv0TBQiIocbmpBmrouaZOxFM7403oyQGSFY0cYtkvHq0k5h4We56JmPECT3w1cYTjo77Bi5bkIKt5XZVHIIQNFFJmorCkUhMMgP9kYEJPclAwebLODi9qPgch2Wv4+i89xxZGq2ylZUOlBBLJIf0nDVSRtd9RrpwowMZjxuQc8zC7zuOSSrAU3yEeTcaUbfVRNytcC6ksOmSO0VDtEkC/S2WLQxHz5OM6/HQLZXcfGQydz2b+EZMM8DiTEcAiHqXgqKWZdc2HrK4fh6JttGGYwKrweKgA+EUhmSDOMVaviJEkwQ5M5hTpSAlOwrMeQxRhopo4UipQYqiIAQdEMUh0Ji6P7ZSX5iZ9M/A5Io6rqiVyIAAAAASUVORK5CYII=",
	RUN: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEPElEQVRoQ+2ZS2sbVxTH/2f0cOxqFAWS2G5KM1pk1UWlfaHyri6U6hs0XlpaRII6q0IdugkE6tlIWcb9BHVIod1ZpR/AUkrXvoZSaLORPIZg2dYpd2TZ0niu5qFXDLkrMXPn3vM7z3uuCNd80DWXH+8BZm3BmVqAf/3CAEe3QJSxFcFcB52WafU34VcxMwPoCh/bAyE1ICyjCTrJ+oWYIcBXOwC+Vmj6Ja2+yvuxwiwBmgBuKoQUtPoqfX0BmA/oy1+Mdx3g3XMho3qYB+OFrTmiOiADEnV0qAniOphaopiQz2EHMWLyt9ONWsBJZupBbFStLQJKXmZnoAaKron1eXEOYYK5m0Zt6JOSX+HtT7w29HpvPH9roHP6MxG6QvgczLyNtl4WZZLBHHqMBNBzGSK6yOUM/A6mEgg5gPMEfK6Sjpmb0MgU6/qTsAShAYzqUYnAW/0bM+OJKOqb/c+MLU4hbu33QzqFZVBZFBJmGIjQAOmqxZcbcouJ8mJdrzmFMCpHD4m4G9iKwWAhCklfed+5RGgAo2KZRHhku8xxIu/my7b256w9AnnmdGbK9jJUEEuEBvCziVGxNonwvZ+5DP5JFJIP/cztnzMxAG/f5xYDOwT6RgpkB3RbTwfNSpMDqB5u94Rz06oMeLQTJs1ZAiC7mDHTmigmtoNYYSIAHz/977NIcv6PIWHb4mPdkNrudzNm1EVRz84e4Mc3/0Ru3FhW5/9LTUtXo7hVB9H94ZkKpijo5bFlIdVm957+/V08efMHdcpEQxT0gartJ9XaLkZYcabqsbpQqrSXSn64+G8koceVAC5CyLlG1aoNrdqKdD1WgOWNhhm/99EjLe4uv6wZoqDngvi419yxASx9+2eONN6N3VlE5IMF133DZJnpAWw0BBHd1xYWEL+7qADgJqCthKm4KpCxWGDpcWOTQBcVN5LQEbt9Ww2hxbKyH/DSrp/3IwPc2fgrE6WzPedm2tx8Lb68mO0Vqf73Mt+jnVgJWnXdgEYGWNp4XSO6cuZvvG2f5VIPHhhEnZorBFATBX3Fj5aHzVECyKCE1nnh5yTp2MAWvmlm7U7L7tj4dIeAT52CyK5MFJNro0CoAc6DMsjiDG6dcTT35tknduPeG91j9ZHM8y4QV5ugIHuqAR43mnR+yPKzoEr4QQjLdDvgMUXTYYN6uAtRZ1umRi8AZj44QzTv1Lzbd24Vl48Tt8IG9MhB7AV3xZUc/XHYRqa37nQBztvQSyjZS8cyYd1HrjM1AJmNiE/3HfXgyi1GEItOF6Bq7RLkXVFv8EVTE1To/vlTsYDx3MoRY3dQ+8Hbx4lUYj/aM6qH+wMFkflgv5j0vGrxs/bELeB6g6doavwI7JwzBYBB7Y+7qZk4QLpyKPob9rA3cCrrTBzAqBxlCB35bwwY2mbQex8vt5o4gJcAo75/DzCqBkf9/tpb4H8tRsBA8NHL+QAAAABJRU5ErkJggg==",
	SEARCH: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEn0lEQVRoQ+2YQWwUVRjH/98Oi7RN7CJSopYUEsuhGoTEGA8mLYlcWmMwcvBinEZuHOgNOIHxAN7KwYNGM0P04AGFaOoFkrYexBgSwSiJENMSioYtpFugLLKd+cw3O28yszvtzJvd6pbwksmmnfe+9//N973ve+8RVnmjVa4fjwH+bw9m9oBpmgUi6mfmPQC2yENE8gtmngbgPUR0hpknbdsurQSsNoBpmiLyCBGZOoKY2QbwgW3bAta0lhpAvrgvfKSR2Zn5KIATzfJIKgBf/DgR7YiI7+wGPbsdtLEX6NgA6tjgveaF28DCbfDsVfBfvwLzM5FhzHwRwK5mQCQCmKYpokW8eKDanu5Frm8Q1LUtlTO4eAXu5e+BW1eD/swsa0IgBCZzWxbA//JTYfH08rvIbXk104Tu9HnwhS9rIbY24oklAWrDhvNtMPoPgAqbM4lXg8QbzvlPQZVyNdwaDKflAEaJ6ICaOPf6YVChu058VzuhpzOH9evIe6TNPWDvuTbvonif68Z4IfXDibAnJDvJ4tZusQCSKoloSlmLC5uOPOGVZwx0dSy/jIoLjJ//drBQiYLEhJOEknaKjZ19eHhYcvZ7asEaA9HMWVhH2NWzBmtzQMUBfpt1UCwzSg+qIuV9VxvhxY0G8gbw0AXGry0G79WHcSZGwwv7pGVZWrVF7NQB+BV2Lgid/pFqmvRbPge80Zv3xE+VXPxy00HFjfe89N25ycDWQs6DOP1HJdIxJpTW6y7oOIA9RHTam6mzG8buw3XqXus2cK8CXLzppIrZHZsMb32IF2qbc/ZYUCeY+S3bts+kMup3qgMIhw/1DSLXN6RjT7uve3kMLDWi2rTDKA5gAkC/WMvVhI+2uhQDpFq7k6Oq56RlWQMphgVd4gAkE/R4AIMfgtqf0rGn3ZdL1+GeO+6Nk5pg2/ZOHSNxAEG+M/Z+rGMrc1/n1P5grGVZidub8ESPJMB/HEIzcM8dUx/1kmVZ0R1vgl8fyUUcVOFVmUZN00wsZJlXa8zApheypK1EM8XX1ADoZiDRkmkz1yyIFdnMibg02+lGIdzpn8AXvgjMMHPzttM+xFEiOqJmWOpAkwWkNnSYubkHGh9ALq5kX/SSV+a9I+VI7KlMB0LEOz9+Ej5SXgewXXcbreZMPNQTkRS2zmBAQ4f6aNj4+x/5GbZtW9K3dkvcd8i1iu+JAMK7VnlhKHLQWW5mL2R+H4tcqyjxRFUJzJwJIhEgLpwCsXKx9ZxcbG0D8m1BeHFpBqiUwbNXwDdiL7YkbDYr8cpe8W75o7FTXx3ScUMqAAUBYCS8sHUmUn1lwQKQA4AUTEv9/8bcPcyXH+LJJ9Z8fvbbr/eltZ0aQBn0U6xcgVQP/enbSbkXDd88mKZpCoQSr0zpQGgDhEDkqnGAiNT1uvztZSwAlwDI1eE0M8sZd2KpLDO0953jt+6WD9Z+h7QQmQHSf/jknrvffPuzO/8svp8FoiUARHhWiJYByArRUgBZIFoOQBeiJQGWgmhfa/w5/t03z4cXe8sC1ELEiZc+LQ2gIBaZB2q/vPJCywMkVZHHAElfaKXfr3oP/AsiYj1PT0SxfgAAAABJRU5ErkJggg==",
	SPINNER: "data:image/gif;base64,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",
	STAR: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAD70lEQVRoQ+2Z/5HNMRTFz1ZgVYAKlgpQASqwKrAqQAWogK0AFaCCpQJUYFXAfEzOTDa++ebHN3k7z7h/vTcvL8nJPefem5sD/SN2sAMc98Ma72autQsgbwKA430GcijpRwBwVdL5LDCzPXIi6UXY/BNJL/cVyFdJ18PmP0u6tY9Abko6k/QzbP5KAAKg4TaTWoj8oaRXYdePJZ1KmiL6mUAQOWK/EYBAM8SO6IfbLCCc+mtJXyRBMQxKHUl6JMkheRigWUA+SLqTbNrgPkq6OwxBmGgGEKIUNELkfHbugGbfJCF66MbnYTYDyDNJTzPCdgB4Lolxw2wGEOcO6AONYoNu0A5vOAgMATMaCAXiW0nfo0SYbhQQ1yQ9kDSskBwNxNRZK0dctgzNKSOBxAXimpgdDPDUsEKyFsjthB9sxjWUf4JW5Iz3knwHyfEfSt0LuSWlF9RLI9qnkpAMhKqUZIUtbbI0T/x7DfetpZZ547ExWJLuiYFAC8BQGy1ZeiJLp0bmJmekkSq3WSIY6zrze9zSQaaM8Fh0hubOU2rF9weEi2inXYYa3QFo7jYuOi8ElCWNcFLwlgzMKUOVoVm4EYDpTljHe1QMUPOC53Ni5w94BN3gEcDUUqZjn6t/4WABgUfQAx75606zFrX4I2CILtiUqrWA2oUmw4iGfF+kek34de3EZAAD0C6Ma4D1UKzNaoCwaSYkqlk31FGzggBMoB6zHghAxftLLRDAMDFBgDoJEIAZff9mDUAAhnoNUVet0QIEMCyA6B0ECIHF06rkIV4nvFrUiLza661AvCcXh3yHcgDaYgCAQlhXMdkLhAUdBMj6nN4Ww8tk76Koc4tsAVJTsteC21zabwHimyDdwypBrqByM6/75tgLJG4wIM4RhrC7GxO9QJxxa+4etSB9R+mqIHqBtCxqj5VC6abD6QUSt0PXKmPuN35KQNCE1pyZrl1t1R4gFuZap4RNUSulYZkwC3Vy4N1haQ4gPUBKoZKuOzkGSnF3cOFHuEbMnDi/u0sfe6g7pPcAcfJKRYmn8IKvrmnZnV4LmIeKIA7d1klzku0B8iscYdzKoUXqFiiUY0O5ixiFILqh+HSFQEbH4pZS096aBgfOU536uQANUCfZC9AFQKUIxYYZBw0xvIJ3AO/nh6WWazZStALhJP3yRORyoVfyQm4DHAS6sHeYH0/7pcvzF3NRKxDeBNP2TXehF9GJDUPP2JoeT1uAxPxlwWwjoHh8ywPihodHVLdUW4C4O0hIhQJD3zcibHGPoKZr+eevLUDgMomOiDS7z8U6rAe9qnTSAgSPDHvPqKRf9ZotQCrXvpxh/4FczrnnV/0N/bTfM/EJmqgAAAAASUVORK5CYII=",
	TABLE: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA9UlEQVRoQ+1YWw7CMAxz9sONOBdH4VzciJ8GdQw0ISqtSUrY5P7sKy/brbsKdr5k5/2DA2QzSAb+loHr7a7Zza3rX86nr2ppSogDBNNHBloItID+lOCo+M17YFQDXgA4gBdBbzwZ8CLojT84AyJAKUD9ZixVYJoAVdiMrCbIav4F2NKDaYB6m0vC/s23qkJEjAyIQEuZE2SsuXmXhFZd04kb93keo14EsuMPbmS738R04gD3oBPTiZ8yGuXkPEZpZA0Etr4rUUKU0K8kFOCprhSmf2JXxeBgDhAMaHe6bga6KyQF5LyXBA7LAQLBNKUiAybYAoMeb5RcQOuc74gAAAAASUVORK5CYII=",
	TRASH: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAJ10lEQVR4Xu2dacxdQxzGldpaFW3pB7WUID40QmylaEgIKhGUiNpKP5DYlU8VKbE1RWppY0lVCCIhtiiNtIRYYgkJvkhRtbWopShKeX6cSa7be+45955zz3LvM8mT933ve2bOzP//nJn5PzPnzpCNnAbaAkMGuvVu/EYmwICTwAQwAQbcAgPefPcAJsCAW2DAm+8ewAToWwsMVcsOFyYJo4VNhL87aC0PxzphufC88F4HeWtzab/2AHvKA7dEBNgsozew0Y/CfcJVwi8Zy6tU9n4kwG6y8DPC7sLa6Klfr59/RZbvpBcIzqL32Ep4RDhX+L1SXsxQmX4jAN3+w8JJ0ZOK03+LiEB3DhG6SdhpU4Gh5Arh7m4KqWKefiPAfjLyEmFjAYf/JKwR/ox6gqw+2FIFrBCOF37NWlgV8vcbAS6RUW8V/hB+EBi7cX5IWdrL0EF+fk4RPqyCA7PWIYtBst67F/np+k8Ufo6efHqBvBM2Ywj4OO+Cyyiv3whQhg1rfU8ToNbuy155EyC7DWtdQhUIQIy9tzBRGC9sLxBydROvV90Z2Jvo4VPhHeFVYVmZlS6TADj+BOF8YV9hROR0HN+Pzg9+xuaEqbTxW+EF4XbhjTKIUBYBdlVj5wjHRY0mbMMgCDWNKMMmRd0ziEvDdEPk5fnCtVEPUVQdStkSdqBad7/QKNUSqyOvAsiAgtetaleY8TLeCALQC7JWsYWwjbBYmC6sylh26uxF9wB7qWZPCmMjZ+Nk9HridiTbvBS71AaowIWBCJurLmOEl4WpAipmz1ORBIDhiwTk2uBsGonzEWz6edxP60jWMiDBA8KMtJmyXFckAa5RRWcKjHc4HJkWnT6s0mVpRz/lDSuPrDou7XXDiiLAzmoIIc9IoVGn7/dxvlv/sej0tnCW0LiW0W15sfmKIgDd2ezoieep/77XDcvdUsUXSKgIAd7t5a2LIABdGluqDhMY84l9mfg5tbcAvcAdEXpmqyIIgLL3ujBKWB09/e76k11KeEhEcF7ypd1fUQQBUPloCLN84tu+2lPXvekTcxIRfCSw96BnW9CKIACx/11Rt8/Y34s1+kRr1vAChk4eGLag9Wz3UREECEIHPgi7amroj1KqjL16GiYXQYBSLOebprOACZDOTn17VZkE2ENWnSYMekSAD5gYzxWQxQtNZRLgaLWUtYEwNyi04RW6GT5AG2EzzMqi61UmAY5UY1kZzPLCRtH26sX9UPwgwAThm17coF2ZZRPgCVUurAgO6mogBPhOmBwRoVAOVIEAsB99YJAJgEKK4AMRCk0mQKHmbnkzegATwD2AewAPAR4CUvXHYdjKizCUl2dZNKKT8jwEpJwEYiheGAkLI2ynzhJCstwavj+AtXeI0O1CVWPdKIfy0tbNBEhBAFbGCBfZTs7WMox8qHCmMDxyZKruI7oIIrFEzZdJfCXsJJwhsGG1UxJQN/Y3LhReE/ibzS/Uje3eSUqnCZBAAJzNvrhLI6c1Ovoo/XGjEN60SUMCnnzexmGZlf2JIUEk3tA5oAMSUDfKuDhyfuP9j9Uf1wlJQ4wJkEAA9suzpQwCtErsNTikyZlxRMAZdPs8nR+0uIhy5kXXxJXR+Dl14/uIroy5eIE+50WYRqI1X2oCJBCAbvROgf1xrRLf3HWOwDeCJKWwyeLk6J7N1zMUPC0EoiSVx1h/s3BPzIVshT9dYIiISyZARgLMUv4LhC+EpM0TEOBr4ZQYwrB9/UWBISfNylwSAXjXj5dfv2xTNxMgIwEw8uXCcoE3jtqlJAKMU2YmmRAJWTYpnEsiwPUqg/kBdYvb12cC5EAAJnSfCUkbTtMQgJk8iZW5pB4lDQEuiwgQt6/PBOhzAoTeKY6cJoAJ4MWgdsvBSVEAc4AqDwHuAWJmZewIYkNI0n4AEyBhZpvl33XYD2ACZPFwQl4T4P8GIgzMOwrwEOAh4F8dwFFAExE8B/jPIA4DHQY6DHQY6F3Bsbq7owBHAW2Xgy0EZSCIw0CHgRnoky2rowBHAZaCHQZ6LcA6gHUA6wDWAawDWAdQT+jXw1sEFhaCskVbbXNbB7AO0EN6tS/aOoB1AOsA1gGsA1gHsA5gHcA6gHUA6wDWAVpHDdYBehioWQewDtBDelkH4PVwvxcQwwMLQRaCLARZCLIQZCHIQpCFIAtBFoIsBFkIshDkHUHeEVSsLmMl0EpgsYxruJuFIAtBFoIsBFkIshBkIchCkIUgC0EWgiwEWQiyEGQhqNiw3EKQhaBiGWchaAN7Owx0GOgw0GGgw8C+DAM5OHKG4C+LbjHT6GQxiDMDOTuwVcLIbL3O49Aojo17PbpJ2kOj5uj6e2PqNlufh1PD/G3hTUZKSwBO53xcmBlj5If0+QnCCiHp1DCiHo5vO1X4pEV5E/TZYoEzAznJJOnUMN5a4v58W2mr9Jg+PEb4vE3dPAmUcdrNATAQB0dzOuhHTVbmsOdnBUiyMgUByM7ZwQ8KN7Tw2EJ9dprA048ok0QA6saJpWcLzYQ6SJ9xCulQYZUJsKG10/YA5OS0b8bR24Q3BZ5kTujGieMEzuTDaXFn8zXenbzgUYHTw3HODsJFwjSBU0M56nW1kESAUDecT93eEjibcJLAodY7CvRK9Cbtzg2EbFOiezbWtee/lykEHaHWPSXQ+HY9QDACT+7WkUEx8tjIkThsrQAB2h3S3GhM2k1ZPMF092OEkQLDA07H+ZAg6eTQ5rpRFk88hCKlqRtt4WhZzjNe01jJIn4vkwDj1cCXIodi8DTGZszdTuDETq5fHxmZbhjj8XfahPNxOuB38gKeVAgZd9RrXPmt6rZOF4e6xbWP3u19gUOmIUyhqUwCjFBLXxG2FXh60xCA+jLeDxPoEXAYTz9OS9NdNxuXp4+yIBQkoAehy+Znmvo0lhfqNlwf4tRAJurXrm4Qh+Ho6kI9H92sTAJQhbnCVIFZcicGx1kg9AKd5G22MzagLH6GXiCLLzqtG2S5UFia5abd5i2bAPuo4hweySy/8O6vW6PlmI9e7APhLIGeovBUNgFo8KzIAIy7g5RCNEL0wVyolFQFAjAXmC/sL6QJ40oxVM43DfMF1E1UztJSFQhA45kI3iRMFJh9dzKbL814Xd6YMZ85ywKBOVCpba0KAbAlM/HpAjLtaIE5AbPnLBO8Ln2UezYmhugDpGXCPGFR7nfposAqESBUfxf9Mlk4WEDsgRh1TjzhaBQ4fonwnMCktxKpigQIhiFGHyUwR6hyPZMcSS+GGAQql+ps2MoZs44VMgHq6LUc62wC5GjMOhZlAtTRaznW2QTI0Zh1LMoEqKPXcqyzCZCjMetYlAlQR6/lWGcTIEdj1rEoE6COXsuxzv8ABBTrzMStowcAAAAASUVORK5CYII=",
	UP: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEX0lEQVRoQ+1ZXXLaSBD+mnKtsxWJOCfIcIJ1bkBOYHyCtR8DD8YnWOcExg+QR7MnMD5BfAPjEzA5wdqIVAJx0VsjYSyNRtKMELXlrfAq1NNf99c/84nwwn/0wv3HLwD/dQYry4Doz/ZR4wMw9sEQRNiPg2PGGAQJwhhLupYdb1wF+I0AiM/fBfjxBOAWgYSLQwyWAI1AOxfy4+/S5d34f0sBEOe8h9+CcyI6KntwMjs8xMI/lad072rPGYAYTFtgXBLRnuthef9n5nsQjmW7PnKx6wRA9KfK8cyoM+M6pEWNJZZ0/8TzVX3sYaloxi0iHGQ5ycxD2akf24KwAhBSZnd2SUArbZgfmGtdLF6PbCkQUfBbi2jZA+iNbpOBEebesY09OwCD4MrkPDM+YeH1bA4yRTQCMusS4S8TCNn2D4syUQjATJsw6s2qWqGiGNHyRs8GMy5kx+/mgcgFoAqWQFeJjgHcYe41y0Y9y5lVSx4R8EfyPD7MK+xMAKtWOUl2G37guS9snRf9WVjwsuMNi6ignisQxD/H8UyE3WnhN7LOzAYwmA4J9GeyX9N7W9pEtOBb9T5zufeezmbw37JdN3Y/I4AoEo8TbRX4JDv+mVUko0G3zl5RFHWboh+c6YXNtNMwTWwzgH7QI8LJs2FH6gyCcYrLjLHs+O9tA0C7gVo11i02q6DNAAbTSXy3YaZjax4bqLemgsOQUvVDxJcxGknZrjf0AKQAxLm7fnnuvbUpXP1QU7Rtg6GaCO3O/imqQQOAJP/UeiA7vmECJ90zAc9eF+yKWvSDUXztYNCpbHu9uF0TgORLFvQxt9xsttsWtRjMugQ+f6ZgOpgmALfxywgTPsiP/k1e8QlD0RYVq7rgFBW1+Bw0ifElBiD1TgpAYxBwEe/iz0VO0RaDyN88TbSctP2Ez4UA9BeKnHp6rgdiW3b+/wBc1oB4dqrIQCkK6QVpU8QmWlUCQC9i4E62/YTaUUkb3RqAkm00sUjZDjIdRCUZKDfIntdg11WiyhoovUooJxr9qQTRu+cBYr/MVdVGU3sV89dJp54Sz6zWadvRX1UGTKuJ2zq94YUmzKI20V0G2cYXGuWAaUVwmQllARjX+Rx1IvdSn74V5V+wN6VQqEwsf966CAnusoqSyWs7h5soyqa5ETn/eJWS5VFSVnk6xEwlvgdqH2wViqIFMNROsfyiC8YbC1trENpAWbdXwhl+eBc2101j1JV68Wp2QoyU2mE7QAulxbCgIw1zaFKVI1m81sX89bUtkEgs/nYAXvZMMn2oci+8Ixt7VgDy6JS4/ChVWcnr6usL00NCXid+A6Z9EDfNKndkyYY28TOdAKzaa4uAoUkWL+J6/nN+YOBoqx841pkIKRD0dOmxLAAVdSy8MxvK6Gc4ZyBuYNX6lHLQiu9OVkCYv3L4NWent0lL3ghAAoxqhYQmmJsgiLRMjjuw+sxKN2DcVNWCKwNgFfUt/OkXgC0E1cnki8/Av0bz3k90rLRYAAAAAElFTkSuQmCC",
	USER: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAANuSURBVHhe7ZpLyA5RGMdfsrBgIZeQa1EWrNwWrrksWLjlliyIhZWob2nBhmRhaSnZiYQkRYks3BcU2SAiNhaUcv//e5+jp6fjm5kz55v3DOdXv56395s5zzNnzrwz58zXyWQymUwm898ySGJTzIAb4RI4QfwO34i34Vn4DP5TrIOP4K+Sclvu03qmwHvQd5Bl5L7TYCvZBO9C34FV8SHcBlvFQvgJ2oP5Bs/D7ZCjY5jIz/yOf+M2vv1WwFawFPrO/DW4GRaxHl6Fdn+OhGUweew1z7N3DA6FZeG23Ee3Q9l20uyEtuijMJQj0LbHHMlib3VPYZUzb+G+bEO3yRxJshjqQj/CMtd8EWvhW6jbZq4oDJYYA1vUDXim+7EWF+D17sc/JNkBfLzVnJMYg8sSHQsk1iZmB4yQ6Ih5rT6R6BgtsTYxO2C8RMcHiTGwbY2TWJuYHfBDYhP8lFibmB3wWqJjjMQY2LZsrmBidgDn85r5EmMwW6LD5gomZge8kuhYJTEGnF9obK4kWA6/Qvew8h5yYlOX1fAldO0yB3MlySXoCqWc1U2FoUyEts2LMFl2QF0s5awuFN+MkOsGyTIcnoK6YM4JOKubDMvCM38Ycl/dFttmjqSZB30LIlcgJzZF8Jq3w56yTbbdCvpbEjsNt0K7JMbvTsIv0O7Htthmq9gA66wIO9kG22olvH/7DqqK9hmgFYyFx6FvOFeVbbCtUbAV8FZ4H/oOpo4P4C6YNL5FTCfPJH/dd0MOa/sjyO/4N27T38g5AYfA5OAw9RX8Du6BPNCycFt2Bvf1tclOSIp90BbJW95BWOXALVwVPgB9t1S2nQR74Weoi7sDt8BY8AHqJtQ5eJnshz2Fr7Dtu7zHkO/9Y8M7yy2oczF3z16jz4R8X6cL4plfBAeKOZDL7Tona2AtjcNXXroQLlPFeBFSxBr4HOrcdV6/BcEhbod+kz9KfVDnZi0Dcdn9lUNQF8ChPx02BafW/H8iXQNragQ+hHC46+S8zzcNnxN0DaypkQeklVAn5gptnWWvUJiTuXUtrK0SIavCsyQ6eGt60f3YKMzJ3BpbWyEhHTBXosO+uW0Sm9vWVkhIB0yS6OjF2XfY3La2QkI6wM7LY74ErYrNXXnNIKQDRkp0pNQBtrZMJpPJZDKZTCaT8dDp/AY005cl8K4tDwAAAABJRU5ErkJggg==",
	WAIT: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMLSURBVGhD7Zo9ixUxFIavsvixWFhYiFhsJdsIiiKKn4WFiMUWChYW/gALSws77SwsLUT8ALFQsFBQsFgtBEUXrVSwuFsIFharaCFY6Ptm5shsPJlMJsk4A/eB5965mZlNziaZZGayYqRzDB6E2+BOuB7+T37At/A1fA7vwVp2wGvwd8+9DQ9AlX3wM9RO7KNLcA4ugzXxEmon9Nn3cD80rIZDaE4ub0LGYDq2dsCQnFuJD16dcvAC7oFb4UMmZGQvP55ALcpYD0FhBko6Lyjn4Bn4sUyL9RE0vV/bGauNpJ80vwp2w+o5bR1zQORGLB8gBy0OnoI92Eo+a+HPYtOQIv9FfkhUbb0EBTYXSbfxpcc4huqOEDdDYQ2UdBtfeoxjXrVi+VR+k2qTCYXzKA5u2+FjJoSiRRiiPaGUi0do+gnzq4BDAvuc5OFzKUWNpILDgPAM/io2m9GnQKKYBNI3JoH0jUkgfSPFpNE1OUyV3oTFLmvkBnxabOaBkfvkzZDrvsXmOpwvNhvhOl7Ly6V39sunFEcgWQfvQvuYXNj51OkNpHq7SqbgfVg9JhfVPHx6A5mFNqyZV1COyUW1HD69gVyGGhshT+YxubDLUqc3kO9QqxXC9C/FZha08rj0BkLZ4dmcNA6X3znQyuKyUSD0DuwarRwuGwdCz8Iu0crgMigQDoqnYBewKX+DWjk0OVirO1y+gTn7hbAFavm7DA6E1nX+VHA2oeXtstVzLV52r8BN5lcejpbfTTGPmLQIm8jJXg42QNcE1WVQZ9e8CFPCFnIVannV2aqP2Ka8LB+HWh4+o2tEvABj4cNwTnm0v+/TBBLaHl3yXqXtwoLTMKYcfPOV9NUbB00Wiq8XmsBaeAC1vxUi75HMixptZ4z877LTMiherjntJ6wxvtViOmuQs2vt/FDPQ7N6QNs5JM1sYxreKhOGKBc7rIIGrkN5B7UD++wC3AWXwdfGqdpsF7IfyhOef+A7vCE0Mz7s46qKv9iPKQVeALgsoi8Lz75Cvizl4jO+lrOWhIxGfwAJL65fuMS/2AAAAABJRU5ErkJggg==",
	WARN: "data:image/png;base64,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",
	WRENCH: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAE7ElEQVRoQ+1ZTWwbVRD+Zm2HtpGo+REHBG3DiQMSzgmVQGPHUi8cagu4UfVZiCOiOSRIyAajRKDah6R3pGyOCIRdCQGXYjtq0gMSSe4odVUoEgg1RagktruD1o7Dxrtv3+5mI4iUPXrfzvu++Z8x4ZA/dMjx44jAf23BIwv8by1QqS0niFEhgm5AW8ymzjbDBCs+KCUQoUtgJEBIALwJpiYMntQ/mV7zepfUhSrXl5tEOL0riKGz1iVS9yrc6ZwozsXR6VRASNreMxb12SnhR74bgSIRPhoUxkTZbOrlqp9L+md3tF4DEA8DvClDTqB28wyxccsOlDeZhkeyqdFNPyR6mm/XQJQIC7wrAfNl5fsbOoEuOVxYzaTHsr4IFMqXAcyFCV5NoHYzSWyYJrffy8hl02O6VxKiUKoDNG47H4k+phcnXa0p8lcy+uz7jm6rrAOV2koGButEOGmLBx8kRKF8z9H3wTl9ZlqqCFEoLQAY0Wem7UHvFgNWsJXaahz8QCfgQlASolA2U+OLDrZsIhIbdbJCDzx1s5I+M+WobKUF9hC5viyIYGpkz8MeLCF1IVMSo45oNGslYQUfGoFuYAckIfKleRC9J48ZbpKhFTkWuYaH7bm+5nfOr+szU/bs5dWFBi8NQkIUSgIgm/U8JQGXAufLhfbjTiJfqoAo4wmwzUeR0menHDuAwARU7pT5eexHMDXQ4pOfb73W+O73pGMWURPihiwDKeuAWrhzTBw3fsX5jTcNGKyZMjpDUbxz61Mv4gayA24jGk241Yl9WaB/mzUmTPDpO28hsr21B8wSv4SFu2/4IbGOhyxUnWkoBLruVFtOnGjfbaR/ufjoIHgcI/zx1JP48Id38aBzvEeC+SpAVRCf+bel7jrFJsBVt+Jm1UJoBPhrvIrfqI5Wz212n2MEnIoBEcK1jRSqG2kz7/tum2WmC4+ATn9hi4dl4Pu/f/XTxPLrb3/7ih9fcjsbHoHPqIMOR5w0vwcAm5MXpyjV9jx1HTgBc1A5+8TajVz8i+FYuw3T5/tu43i5SUJDjs61Ag1GocbA4JSVe/pLvHB6A48P/6n2EjJydK7tuSV3ErgvF5KNiCeif+P8qRVceM5xlBjI9axTspVTs3U+EZiAyJeTIFSce/zeZRPPrNy5+Pw3zyrBMa+BW1lKwffmIxABj43ZOiLR5MLEdAasqZu4gHHhm4An8Mz3YSDZr6K8FBOeSHRNZczDaH9MKXhaGvgiEAR83324MVQEyLamkWSpNTDnvKRazwT2A95CogqQbSyVp1qeVGUpTwTCAG+C5BrioKE6iBxmY0moK1KtksDgbCrNKCwfOqzfcC2WgKatKjOT9YBhjMrcyZWAZ/CK1cggWF565DLYYckl184ijbccd6ZSAsK6SWMsdmUT7Fs6n+CDxQOalNwe8VWJRb602t1jWlpfkS/re0m4L6Xc3GQnHpogsi3MbN8xr1Oy5W8rIQpl7gqSEggOftcKS0MZMJnVXPEYV2m8be5WbY+bC1k2abzTcPW2ZOY0pc9OOwpUQbHFQyM2D2jyfRHjNng7IStscgL5KxmQZtdOiNOUJR50OG7B+T6Yk24FzT0L9UgUeztNboB5XrYl9qt5e2aKCRhaEea/QmYrQqjCaBVVDZ6yDuwX2EF/f0TgoDWskn9kAZWGDvr9obfAP7iqOE8jrZkzAAAAAElFTkSuQmCC",
	X: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAB2klEQVRoQ+2YvVHDQBCF36oB6AASIKUE6MCOGHL+SuIvZ4jsDqAEUiCBDqABLSPPiLFlWbd3+86Mh1Nq6+l991Z7qxNs+CUb7h8F4K8TLAmUBJwr8H9K6HZvclhVMqlrHV+8j1+cC7d0e6q+KYGZuMgTBNtQfNWqx0wIj34QYEG8XTcihFc/CHB/MPkAZGcpcwJEr/nfB+nn2et4N1SqQYDmISJ4FpEtJsSQeVX9VsWRpUyDAI1pNgTLfOPNBMCEYJqPAmBAsM1HA3ggcphPAkiByGU+GSAGIqd5F4AFQoErAa5nO3jnimmVQ3uBuQutEgm0WIUsdzqWeXcCLVQAYqFZM83TAAzlNINgm6cCNGJ3+9MTAR76ygYKVeD0/G30GJpvYn53vwPzZdSO3KoKkR5pwgDYhaMA9LXKdUG4AQZHYkVvF2J+FLkAQpsUIJeA3rBH8fkySgYImW/nefYoTnkHrOaN+4TrGzs6gVjzuSGiAFLN54QwA3jN54IwAbDM54AIArDNsyGCAKvOhRiD2WCLRcZzIYb5oSRi9IMJdEflGHHrVDmfRKy+CaCFqCpM6xojy4mZ1fzCNJugbwaINbSu/xeAda30queUBEoCzhUoJeRcQPftG5/AD1A5K09GOt+SAAAAAElFTkSuQmCC"
};
B.char = {
	BLOCK: "&#x23f9;", BULLET: "&#x23fa", CHECK: "&#x2714;", CHECKN: "&#9744;", CHECKY: "&#9745;", CHECK_THIN: "&#x2713;", CLOUD: "&#x2601;",
	DELETE: "&#x2717;", DIR_NE: "&#x25e5;", DIR_NW: "&#x25e4;", DIR_SE: "&#x25e2;", DIR_SW: "&#x25e3;", DIVIDE: "&#x2797", DOWN: "&#x25bc;",
	EXCLAIM: "&#x2757;",
	FF: "&#x23e9;", FIRST: "&#x23ee;", FLAG: "&#x2691;", FLAG_OL: "&#x2690;", FLAT: "&#x266d;", FOLDER: "&#128193",
	GRID: "&#x2637", KEY: "&#x1f511;",
	LAST: "&#x23ed;", LEFT: "&#x25c4;", MINUS: "&#x2796", NEWLINE: "&#x21b2;", NOTES: "&#x266b;",
	PAUSE: "&#x23f8;", PLUS: "&#x2795;", QUESTION: "&#x2753;",
	RECORD: "&#x23fa;", RECYCLE: "&#x267b;", REWIND: "&#x23ea;", RIGHT: "&#x25b6;", RIGHT_OL: "&#x25b7;",
	SHARP: "&#x266f;", STAR: "&#x2605;", STAR_OL: "&#x2606;", TIMES: "&#x2716;", TRASH: "&#x1f5d1;",
	TURNL: "&#8634;", TURNR: "&#8635;",
	UP: "&#x25b2;", WARN: "&#x26A0;", X: "&#x2718;",
	cat: {
		cards: {
			BACK: "&#x1F0A0;",
			S1: "&#x1F0A1;", S2: "&#x1F0A2;", S3: "&#x1F0A3;", S4: "&#x1F0A4;", S5: "&#x1F0A5;", S6: "&#x1F0A6;", S7: "&#x1F0A7;", S8: "&#x1F0A8;", S9: "&#x1F0A9;", S10: "&#x1F0AA;", SJ: "&#x1F0AB;", SN: "&#x1F0AC;", SQ: "&#x1F0AD;", SK: "&#x1F0AE;",
			H1: "&#x1F0B1;", H2: "&#x1F0B2;", H3: "&#x1F0B3;", H4: "&#x1F0B4;", H5: "&#x1F0B5;", H6: "&#x1F0B6;", H7: "&#x1F0B7;", H8: "&#x1F0B8;", H9: "&#x1F0B9;", H10: "&#x1F0BA;", HJ: "&#x1F0BB;", HN: "&#x1F0BC;", HQ: "&#x1F0BD;", HK: "&#x1F0BE;",
			D1: "&#x1F0C1;", D2: "&#x1F0C2;", D3: "&#x1F0C3;", D4: "&#x1F0C4;", D5: "&#x1F0C5;", D6: "&#x1F0C6;", D7: "&#x1F0C7;", D8: "&#x1F0C8;", D9: "&#x1F0C9;", D10: "&#x1F0CA;", DJ: "&#x1F0CB;", DN: "&#x1F0CC;", DQ: "&#x1F0CD;", DK: "&#x1F0CE;",
			C1: "&#x1F0D1;", C2: "&#x1F0D2;", C3: "&#x1F0D3;", C4: "&#x1F0D4;", C5: "&#x1F0D5;", C6: "&#x1F0D6;", C7: "&#x1F0D7;", C8: "&#x1F0D8;", C9: "&#x1F0D9;", C10: "&#x1F0DA;", CJ: "&#x1F0DB;", CN: "&#x1F0DC;", CQ: "&#x1F0DD;", CK: "&#x1F0DE;"
		},
		symb: { // http://unicode.org/charts/
			AIRPLANE: "&#x2708;", ALARM: "&#x23F0;", ANCH: "&#x2625;", ANCHOR: "&#x2693;", ATOMIC: "&#x269B;",
			BEACH: "&#x26F1;", BOAT: "&#x26F4;", BOX: "&#x2610;", BOXCHECK: "&#x2611;", BOXX: "&#x2612;",
			CACTUS: "&#x1F335;", CADUCEUS: "&#x2695;", CAUTION: "&#x26A0;", CHURCH: "&#x26EA;", COFFEE: "&#x2615;", COFFIN: "&#x26B0;", CROSS: "&#x271D;", CROSS_3D: "&#x271E;",
			ELECTRICITY: "&#x26A1;", FIST: "&#x270A;", FLAT: "&#x266D;", FLEUR: "&#x269C;", FLOWER: "&#x2698", FOUNTAIN: "&#x26F2;",
			GASPUMP: "&#x26FD;", GLOBE: "&#x1F30D;", GRID: "&#x2637;", HAMBURGER: "&#x2630;", HAMMERCHISEL: "&#x2692;", HAND: "&#x270B;", HOSPITAL: "&#x26E8;",
			KEY: "&#x1F511;", LOCK: "&#x1F512;", LOCKKEY: "&#x1F510;",
			MOUNTAIN: "&#x26F0;", NATURAL: "&#x266E;", NOENTRY: "&#x26D4;", NOTE: "&#x2669;", NOTE8: "&#x266A;", NOTES: "&#x266B;", NUT: "&#x23E3;",
			OCRBANK: "&#x2446;", PEACE: "&#x262E;", PEACE_HAND: "&#x270C;", PHONE: "&#x260E;", PHONE_OL: "&#x260F;", PICKAXE: "&#x26CF;", PIN: "&#x1F589;", POINTD: "&#x261F;",
			POINTL: "&#x261C;", POINTR: "&#x261E;", POINTU: "&#x261D;", RADIOACTIVE: "&#x2622;", RECYCLE: "&#x267B;",
			RECYCLE_OL: "&#x2672;", RR: "&#x26D2;", RUSSIAN: "&#x262D;", SAILBOAT: "&#x26F5;", SCALES: "&#x2696;",
			SCISSORS: "&#x2700;", SCISSORS_OL: "&#x2704;", SHAMROCK: "&#x2618;", SHARP: "&#x266F;",
			SKULL: "&#x2620;", SPEACHR: "&#x1F5E9;", SPEACHL: "&#x1F5E8;", SQUAREKEY: "&#x26BF;", STAR: "&#x2605;", STAR_OL: "&#x2606;", STOPWATCH: "&#x23F1;", SWORDS: "&#x2694;",
			TARGET: "&#x2316;", TENT: "&#x26FA;", TRUCK: "&#x26DF;", TWOLANE: "&#x26D7;", UNLOCK: "&#x1F513;", X: "&#x2715;", YINYANG: "&#x262F;",
			WATCH: "&#x231A;", WHEELCHAIR: "&#x267F;", WRENCH: "&#x1F527;", WRITE: "&#x270D;"
		},
		tech: {
			BACKSPACE: "&#x232B;", BACKWARD: "&#x23F4;", CANCEL: "&#x2327;", COMMAND: "&#x2318;", DELETE: "&#x2326;", DOCUMENT: "&#x1F5CB;",
			ENVELOPE: "&#x1F582;", EJECT: "&#x23CF;", FF: "&#x23E9;", FOLDER: "&#x1F5C0;", FOLDEROPEN: "&#x1F5C1;", FORWARD: "&#x23F5;", HOURGLASS: "&#x23F3;", KEYBOARD: "&#x2328;",
			NETWORK: "&#x1F5A7;", NEXT: "&#x23ED;", NULL: "&#x2300;", NUMBER: "&#x2317;", PAUSE: "&#x23F8;", POWER: "&#x1F50C;", PREV: "&#x23EE;",
			RECORD: "&#x23FA;", RETURN: "&#x23CE;", REWIND: "&#x23EA;", SEARCH: "&#x1F50D;", STOP: "&#x23F9;", TOEND: "&#x23EF;"
		},
		weather: {
			CLOUD: "&#x2601;", COMMET: "&#x2604;", PARTLYSUNNY: "&#x26C5;", RAIN: "&#x2614;", SNOW: "&#x2603;", SNOWMAN: "&#x26C4;", SUN: "&#x2600;",
			THUNDERSTORM: "&#x26C8;", UMBRELLA: "&#x2602;"
		},
		face: {
			DEVIL: "&#x1F608;", HAPPY: "&#x1F642;", MEH: "&#x1F615;", PRAY: "&#x1F64F;", SAD: "&#x1F641;"
		},
		game: {
			BASEBALL: "&#x26BE;", BASKETBALL: "&#x26F9;",
			CARD_CLUB: "&#x2663;", CARD_CLUB_OL: "&#x2667;",
			CARD_DIAMOND: "&#x2666;", CARD_DIAMOND_OL: "&#x2662;",
			CARD_HEART: "&#x2665;", CARD_HEART_OL: "&#x2661;",
			CARD_SPADE: "&#x2660;", CARD_SPADE_OL: "&#x2664;",
			CHECKER_W: "&#x26C0;", CHECKER_WKING: "&#x26C1;", CHECKER_B: "&#x26C2;", CHECKER_BKING: "&#x26C3;",
			CHESS_BBISHOP: "&#x265D;", CHESS_WBISHOP: "&#x2657;",
			CHESS_BKING: "&#x265B;", CHESS_WKING: "&#x2655;",
			CHESS_BKNIGHT: "&#x265E;", CHESS_WKNIGHT: "&#x2658;",
			CHESS_BPAWN: "&#x265F;", CHESS_WPAWN: "&#x2659;",
			CHESS_BQUEEN: "&#x265A;", CHESS_WQUEEN: "&#x2654;",
			CHESS_BROOK: "&#x265C;", CHESS_WROOK: "&#x2656;",
			DIE1: "&#x2680;", DIE2: "&#x2681;", DIE3: "&#x2682;", DIE4: "&#x2683;", DIE5: "&#x2684;", DIE6: "&#x2685;",
			GOLF: "&#x26F3;", ICESKATE: "&#x26F8;", SKIER: "&#x26F7;", SOCCER: "&#x26BD;"
		}
	}
};
B.literalChars = function (str) {
	var rslt = "";
	for (var i = 0; i < str.length; i++) {
		rslt += "\\" + str.charAt(i);
	}
	return rslt;
};
B.contains = function (str, test, caseInsensitive) {
	if (caseInsensitive == undefined) caseInsensitive = false;
	if (caseInsensitive) {
		str = str.toUpperCase();
		test = test.toUpperCase();
	}
	return (str.indexOf(test) != -1);
};
B.hasClass = function (el, clsname) {
	var lst = el.className.split(" ");
	for (var i = 0; i < lst.length; i++) {
		if (lst[i] == clsname) return true;
	}
	return false;
};
B.addClass = function (el, clsname) {
	if (typeof el == "string") el = document.getElementById(el);
	var clslist = clsname.split(",");
	if (clslist.length > 1) {
		for (var i = 0; i < clslist.length; i++) {
			B.addClass(el, clslist[i]);
		}
		return;
	}
	var curlist = el.className.split(" ");
	var found = false;
	for (var i = 0; i < curlist.length; i++) {
		if (curlist[i] == clsname) {
			found = true;
			break;
		}
	}
	if (!found) {
		if (el.className != "") {
			el.className += " " + clsname;
		} else {
			el.className = clsname;
		}
	}
};
B.removeClass = function (el, clsname) {
	if (typeof el == "string") el = document.getElementById(el);
	if (el == null) return;
	var clslist = clsname.split(",");
	if (clslist.length > 1) {
		for (var i = 0; i < clslist.length; i++) {
			B.removeClass(el, clslist[i]);
		}
		return;
	}
	var lst = el.className.split(" ");
	var newcls = "";
	for (var i = 0; i < lst.length; i++) {
		if (lst[i] != clsname) {
			if (newcls != "") newcls += " ";
			newcls += lst[i];
		}
	}
	el.className = newcls;
};
B.toggleClass = function (el, clsname) {
	if (B.hasClass(el, clsname)) {
		B.removeClass(el, clsname);
	} else {
		B.addClass(el, clsname);
	}
};
B.queryString = function (sField) { // Get text from the URL line
	var sSearch = "";
	sField = B.trim(sField.toUpperCase());
	if (sField == "") return "";
	try {
		if (location.search.toUpperCase().indexOf(sField + "=") > -1) {
			sSearch = location.search;
		} else {
			if (top.location.search.toUpperCase().indexOf(sField + "=") > -1) {
				sSearch = top.location.search;
			} else {
				return "";
			}
		}
		var arr = sSearch.split("?");
		arr = arr[1].split("&");
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].indexOf("=") > -1) {
				var arrNameValue = arr[i].split("=");
				if (arrNameValue[0].toUpperCase() ==sField) return unescape(arrNameValue[1]);
			}
		}
	} catch (ex) { return ""; }
	return "";
};
// Use this when you want a collection, but also want to iterate
// or count the items in that collection.
// obj.keys is an array of keys.
// obj.collection is a mapped object (key,value)
B.MappedList = function () {
	this.keys = [];
	this.collection = {};
	return this;
};
B.MappedList.prototype.set = function () { // adds items (key,val) to both the keys array and collection
	for (var i = 0; i < arguments.length; i += 2) {
		var key = arguments[i];
		var val = arguments[i + 1];
		if (this.collection[key] == null) {
			this.keys.push(key);
		}
		this.collection[key] = val;
	}
	return this;
};
B.MappedList.prototype.push = function () { return this.set.apply(this, arguments); }; // Same as set
B.MappedList.prototype.sort = function (method) { // just sorts the keys
	if (method == undefined) {
		this.keys.sort();
	} else {
		this.keys.sort(method);
	}
	return this;
};
B.MappedList.prototype.reverse = function () { // just reverses the order of the keys
	this.keys.reverse();
	return this;
};
B.MappedList.prototype.get = function (pos) { // Returns an item based on numeric array index or key from collection
	if (typeof pos == "number") {
		return this.collection[this.keys[pos]];
	} else {
		return this.collection[pos];
	}
};
B.MappedList.prototype.splice = function (pos, num) { // Slices the array and deletes those items from collection
	var lst = this.keys.splice(pos, num);
	for (var i = 0; i < lst.length; i++) {
		delete this.collection[lst[i]];
	}
	return lst;
};
B.MappedList.prototype.remove = function () { // Finds items in the collection, then calls slice on each one
	for (var i = 0; i < arguments.length; i++) {
		var key = arguments[i];
		var pos = this.collection.indexOf(key);
		if (pos >= 0) this.splice(pos, 1);
	}
};
B.dataStringToSet = function (dataString, columnMapArray) {
	// dataString: "A\tB\tC"
	// columnMapArray:  [COLA,COLB,COLC] or "COLA,COLB,COLC";
	// rslt: {COLA:A,COLB:B,COLC:C}
	var rslt = {}; // Collection of columns (empty to start with)
	if (typeof columnMapArray == 'string') columnMapArray = columnMapArray.split(",");
	var cols = dataString.split("\t");
	for (var c = 0; c < cols.length; c++) {
		var dataItem = B.format.TRIM(cols[c]);
		var colName = ""; // Default
		var colType = "";
		if (c <= columnMapArray.length) colName = columnMapArray[c]; // If named
		if (colName.indexOf(".") > 0) {
			var parts = colName.split(".");
			colName = parts[0];
			colType = parts[1].toUpperCase();
		}
		if (colName == "") colName = "COL_" + c; // Skipped name
		if (colType == "DATE") dataItem = new Date(dataItem);
		rslt[colName] = dataItem;
	}
	return rslt;
};
B.addToString = function (str, newtext, sep) {
	if (str == "") {
		return newtext;
	} else {
		if (sep == undefined) sep = ", ";
		return str + sep + newtext;
	}
};
B.frozenThings = [];
B.freezeThings = function () {
	var txt = arguments[arguments.length - 1];
	var lastarg = arguments.length;
	if (typeof txt == "string") {
		lastarg--;
	} else {
		txt = "";
	}
	for (var i = 0; i < lastarg; i++) {
		arguments[i].freeze(txt);
		B.frozenThings.push(arguments[i]);
	}
};
B.thawThings = function () {
	if (arguments.length == 0) {
		for (var i = 0; i < B.frozenThings.length; i++) {
			B.frozenThings[i].thaw();
		}
		B.frozenThings = [];
	} else {
		for (var i = 0; i < arguments.length; i++) {
			arguments[i].thaw();
		}
	}
};
B.stripeCSS = function (colors, px, angle) {
	var clrlist = colors.split(","); // "silver,blue,green"
	if (angle == undefined) angle = -45;
	if (px == undefined) px = 10;
	var css = "repeating-linear-gradient(";
	css += angle + "deg,";
	css += clrlist[0] + ",";
	for (var i = 1; i < clrlist.length; i++) {
		var clra = clrlist[i - 1];
		var clrb = clrlist[i];
		css += clra + " " + (px * i) + "px,";
		css += clrb + " " + (px * i) + "px,";
	}
	css += clrlist[clrlist.length - 1] + " " + (px * clrlist.length) + "px)";
	return css;
};
B.cookie = {
	SAVE: function (name, value) {
		var oDate = new Date();
		oDate.setYear(oDate.getFullYear() + 1);
		var sCookie = name + '=' + value + ';expires=' + oDate.toGMTString() + ';path=/';
		document.cookie = sCookie;
	},
	READ: function (name) {
		name = name.toLowerCase();
		var crumbs = document.cookie.split(';');
		for (var i = 0; i < crumbs.length; i++) {
			try {
				var oPair = crumbs[i].split('=');
				var sKey = B.trim(oPair[0]).toLowerCase();
				var sValue = oPair.length > 1 ? oPair[1] : '';
				if (sKey == name)
					return sValue;
			} catch (err) { }
		}
		return "";
	},
	DELETE: function (name) {
		B.cookie.SAVE(name, "");
	}
};

B.copyElementToClipboard = function (el) {
	var body = document.body;
	var range = null;
	var sel = null;
	if (document.createRange && window.getSelection) {
		range = document.createRange();
		sel = window.getSelection();
		sel.removeAllRanges();
		try {
			range.selectNodeContents(el);
			sel.addRange(range);
		} catch (e) {
			range.selectNode(el);
			sel.addRange(range);
		}
	} else if (body.createTextRange) {
		range = body.createTextRange();
		range.moveToElementText(el);
		range.select();
		range.execCommand("Copy");
	}
};
B.addSelectOption = function (sel, val, disp, selectme) {
	if (selectme == undefined) selectme = false;
	var opt = document.createElement("option");
	opt.value = val;
	opt.innerHTML = disp;
	if (selectme) opt.selected = true;
	sel.appendChild(opt);
	return sel;
};

B.addSelectOptionGroup = function (sel, disp) {
	var grp = document.createElement("optgroup");
	grp.label = disp;
	sel.appendChild(grp);
	return grp;
};

B.store = {
	set: function (name, value) {
		if (window.localStorage == undefined) {
			B.cookie.SAVE(name, value);
		} else {
			window.localStorage.setItem(name, value);
		}
	},
	get: function (name) {
		if (window.localStorage == undefined) {
			return B.cookie.GET(name);
		} else {
			return window.localStorage.getItem(name);
		}
	},
	del: function (name) {
		if (window.localStorage == undefined) {
			B.cookie.SAVE(name, "");
		} else {
			window.localStorage.removeItem(name);
		}
	}
};

B.cssSheet = document.createElement("style");
B.cssSheet.type = "text/css";
document.getElementsByTagName("head")[0].appendChild(B.cssSheet);
B.cssSheet = document.styleSheets[document.styleSheets.length - 1];

B.setCSSRule = function (selector, styles, checkfirst) {
	if (checkfirst == undefined) checkfirst = false;
	var media = typeof B.cssSheet.media; // string or object depending on browser
	if (media == "string") {
		if (checkfirst) {
			for (var i = 0; i < B.cssSheet.rules.length; i++) {
				var rul = B.cssSheet.rules[i];
				if (rul.selectorText && rul.selectorText == selector) {
					rul.style.cssText = styles;
					return;
				}
			}
		}
		B.cssSheet.addRule(selector, styles);
	} else if (media == "object") { // Edge?
		var len = (B.cssSheet.cssRules) ? B.cssSheet.cssRules.length : 0;
		if (checkfirst) {
			for (var i = 0; i < len; i++) {
				var rul = B.cssSheet.cssRules[i];
				if (rul.selectorText && rul.selectorText == selector) {
					rul.style.cssText = styles;
					return;
				}
			}
		}
		B.cssSheet.insertRule(selector + " {" + styles + "}", len);
	}
};
//B.setCSSRule("body, html", "position:absolute");
B.setCSSRule("body, div, td, th, form",
	"font-family:" + B.settings.fontFamily + "; " +
	"font-size: " + B.settings.fontSize + ";");
B.setCSSRule(".ui-dialog .ui-dialog-titlebar, " +
	"ui-dialog .ui-dialog-buttonpane, " +
	"ui-widget-header .ui-priority-primary, " +
	".ui-widget, .ui-button", "font-size: 11pt;");
B.setCSSRule(".ui-dialog .ui-dialog-content", "font-size:12pt;");
B.setCSSRule(".no-close .ui-dialog-titlebar-close", "display: none;");
B.setCSSRule(".no-title .ui-dialog .ui-dialog-titlebar", "display: none;");
B.setCSSRule(".BDialog",
	"z-index: 9999; " +
	"display: none;");

B.setCSSRule("table tr th", "font-weight:normal;");
B.setCSSRule("table tr th.BScrollingTableHeaderCell", "font-weight:normal; border-left:1px solid white; border-right:1px solid white: ");
B.setCSSRule("table.BTableData tr.picked", "background-color: cyan;");
B.setCSSRule("table.BTableData tr td.picked", "background-color: cyan;");
B.setCSSRule("table.BTableData tr.picked td.picked", "background-color: khaki !important;");
B.setCSSRule(".shaded",
	"background: aqua !important; " + /* For browsers that do not support gradients */
	"background: -webkit-linear-gradient(left, khaki, white, khaki) !important; " + /* For Safari 5.1 to 6.0 */
	"background: -o-linear-gradient(left, khaki, white, khaki) !important; " + /* For Opera 11.1 to 12.0 */
	"background: -moz-linear-gradient(left, khaki, white, khaki) !important; " + /* For Firefox 3.6 to 15 */
	"background: linear-gradient(to right, khaki, white, khaki) !important;"); /* Standard syntax */
B.setCSSRule("table.BTableData tr td",
	"font-size: 9pt; " +
	"padding-left:2px; padding-right:2px; " +
	"border-left:1px dotted silver; " +
	"border-right:1px dotted silver; " +
	"border-bottom:1px dotted silver;");
B.setCSSRule("table.BTable tr th", "font-size: 10pt; padding-left:2px; padding-right:2px;");
B.setCSSRule("table.BTable tr td", "font-size: 9pt; padding-left:2px; padding-right:2px;");
B.setCSSRule("table.BTable tr td, table.BTable tr th", "font-weight:normal; box-sizing:border-box; white-space:nowrap; word-wrap:break-word;");
B.setCSSRule("table.BTableHeader", "display:none;");
B.setCSSRule("table.BTableHeader tr th", "font-weight:normal !important;");
B.setCSSRule("table.BScrollingTableHeader tr th", "position:relative; border-left:1px solid white; border-right:1px solid white;");
B.setCSSRule("table.BScrollingTableHeader.sortASC tr th.sortable:hover>div",
	"background-image: linear-gradient(transparent, transparent, lightcyan, cyan); ");
B.setCSSRule("table.BScrollingTableHeader.sortASC tr th.sortable.sorted:hover>div",
	"background-image: linear-gradient(cyan, lightcyan, peachpuff, yellow); ");
B.setCSSRule("table.BScrollingTableHeader.sortASC tr th.sorted>div",
	"background-image: linear-gradient(transparent, transparent, peachpuff, yellow); ");

B.setCSSRule("table.BScrollingTableHeader.sortDESC tr th.sortable:hover>div",
	"background-image: linear-gradient(cyan, lightcyan, transparent, transparent); ");
B.setCSSRule("table.BScrollingTableHeader.sortDESC tr th.sortable.sorted:hover>div",
	"background-image: linear-gradient(yellow, peachpuff, lightcyan, cyan); ");
B.setCSSRule("table.BScrollingTableHeader.sortDESC tr th.sorted>div",
	"background-image: linear-gradient(yellow, peachpuff, transparent, transparent); ");

B.setCSSRule("table.form tr th, table.form tr td", "padding-top:1px; padding-bottom:0;");
B.setCSSRule("table.form tr th",
	"padding-right:.1em; " +
	"text-align:right; vertical-align:top; " +
	"font-weight:bold; color:navy; " +
	"background-color:transparent;");
B.setCSSRule("table.form tr td", "vertical-align:top;");
B.setCSSRule("table.form tr.header th", "text-align:center");
B.setCSSRule("table.form tr.head th", "text-align:center");
B.setCSSRule("table.form tr.head2 th", "text-align:center;color:white;font-weight:normal;background-color:navy");
B.setCSSRule("table.form tr td input:not([type])", "padding-left:0.13em");
B.setCSSRule("table.form tr td input[type=text]", "padding-left:0.13em");

B.setCSSRule(".BGenericMenu.main", "box-sizing:border-box; display:block; box-shadow: 5px 5px 5px grey; cursor:pointer; background-color:white;");
B.setCSSRule(".BGenericMenu", "box-sizing:border-box; display:block; cursor:pointer;");
B.setCSSRule(".BGenericMenu div", "box-sizing:border-box; position:relative;" +
	"padding-left:.2em; padding-right:.2em; padding-top:0; padding-bottom:0;");
B.setCSSRule(".hilite:hover", "background-color: lightcyan !important; border-left: 3px solid blue !important");


B.setCSSRule(".BTab",
	"background-color: gainsboro; " +
	"border-left: 1px solid transparent; " +
	"border-right: 1px solid transparent; " +
	"border-bottom: 1px solid navy; " +
	"border-top: 5px solid transparent; " +
	"text-align: center; " +
	"cursor: pointer; " +
	"margin-right: 50px;");
B.setCSSRule(".BTab:hover", "background-color: aqua;");
B.setCSSRule(".BTab.current",
	"background-color: transparent; " +
	"border-top: 5px solid brown; " +
	"border-left: 1px solid navy; " +
	"border-right: 1px solid brown; " +
	"border-bottom: 1px solid white; " +
	"cursor: default;");
B.setCSSRule(".BTab.current:hover",
	"background-color: lightcyan; " +
	"border-bottom: 1px solid lightcyan !important;");

B.setCSSRule(".BTab:hover div.BTabCloser",
	"z-index:50; " +
	"cursor:pointer; " +
	"position:absolute; " +
	"display: inline; " +
	"background-color:brown !important; " +
	"color:silver; " +
	"height:12px; " +
	"width:12px; " +
	"top:0; " +
	"right:0; " +
	"border-radius:25%; " +
	"margin-right:-5px; " +
	"margin-top:-8px; " +
	"font-size:9px; font-weight:bold; ");
B.setCSSRule(".BTab:hover div.BTabCloser:hover", "color:yellow;background-color:red !important;width:22px;height:22px;font-size:14px;");
B.setCSSRule(".BTab div.BTabCloser", "display:none;");
B.setCSSRule("select.mono option",
	"font-family: Consolas, \"Lucida Console\", Monaco, monospace; " +
	"color: black;");
B.setCSSRule("select.mono optgroup", "color: navy;");

B.setCSSRule("@media print", ".noprint{display:none;} .noprintREALLY{display:none;} ");
B.setCSSRule(".BAction", "cursor: pointer;");
B.setCSSRule(".BAction:hover", "background-color: aqua; color: navy;");
B.setCSSRule(".anchor", "color: blue; cursor: pointer;");
B.setCSSRule(".anchor.bad", "color: red");
B.setCSSRule(".anchor:hover", "color: darkgreen; text-decoration: underline;");

//B.setCSSRule(".invalid", "background-image: linear-gradient(to right, transparent, transparent, transparent, yellow);");
B.setCSSRule("input.invalid, select.invalid", "background-color: moccasin; border:1px solid black;");
B.setCSSRule('input', "border:1px solid black;");
B.setCSSRule("select.invalid option, select.invalid optgroup", "background-color:white");

B.getAllCSS = function () {
	var css = "";
	for (var ssn = 0; ssn < document.styleSheets.length; ssn++) {
		var ss = document.styleSheets[ssn];
		if (ss.href == null) {
			var classList = ss.rules || ss.cssRules; // Browser differences?
			if (classList != null) {
				for (var clsn = 0; clsn < classList.length; clsn++) {
					var cls = classList[clsn];
					var val = (css.length == 0 ? "" : "\n");
					if (cls.cssText) {
						val += cls.cssText;
					} else {
						val += cls.style.cssText;
					}
					if (val.indexOf(cls.selectorText) < 0) {
						val += cls.selectorText + "{" + val + "}";
					}
					css += val;
				}
			}
		}
	}
	//console.log(css);
	return css;
};
B.addCSSToWindow = function (win, withJQ) {
	var ss = win.document.createElement("style");
	ss.type = "text/css";
	var noprint = "\n.noprint { display:none; }";
	ss.innerHTML = B.getAllCSS() + noprint;
	win.document.getElementsByTagName("head")[0].appendChild(ss);
	ss = win.document.createElement("link");
	if (withJQ == undefined) withJQ = true;
	if (withJQ) {
		ss.href = "https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/redmond/jquery-ui.css";
		ss.rel = "stylesheet";
		win.document.getElementsByTagName("head")[0].appendChild(ss);
	}
};