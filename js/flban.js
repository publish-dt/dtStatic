function b_detectIE(ClassID) { 
result = false; 
document.write('<SCRIPT LANGUAGE=VBScript>\n on error resume next \n result = IsObject(CreateObject("' + ClassID + '"))</SCRIPT>'); 
if (result) return true; else return false; 
}


function b_detectNS(ClassID) {
	if (navigator.mimeTypes[ClassID].enabledPlugin != null) {return true;} else {return false;}
}

var agt=navigator.userAgent.toLowerCase();
var ie  = (agt.indexOf("msie") != -1);
var ns  = (navigator.appName.indexOf("Netscape") != -1);
var win = ((agt.indexOf("win")!=-1) || (agt.indexOf("32bit")!=-1));
var opera = (agt.indexOf("opera")!=-1);

//if (ie && win) flashInstaled = b_detectIE("ShockwaveFlash.ShockwaveFlash.1");
//if (ns || opera || !win) flashInstaled = b_detectNS("application/x-shockwave-flash");

function b_kswitch() {
	if(true) { //flashInstaled
		document.writeln(banner_text);
	} else {
		document.writeln(alternative_image);
	}
}