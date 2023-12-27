var agt=navigator.userAgent.toLowerCase();
var ie  = (agt.indexOf("msie") != -1);
var ns  = (navigator.appName.indexOf("Netscape") != -1);
var win = ((agt.indexOf("win")!=-1) || (agt.indexOf("32bit")!=-1));
var opera = (agt.indexOf("opera")!=-1);

if (ie && win) flashInstaled = detectIE("ShockwaveFlash.ShockwaveFlash.1");
if (ns || opera || !win) flashInstaled = detectNS("application/x-shockwave-flash");

function detectIE(ClassID) { result = false; document.write('<SCRIPT LANGUAGE=VBScript>\n on error resume next \n result = IsObject(CreateObject("' + ClassID + '"))</SCRIPT>'); if (result) return true; else return false; }
function detectNS(ClassID) { if (navigator.mimeTypes[ClassID].enabledPlugin != null) return true; else return false; }

function kswitch(){
	if(flashInstaled) 
		{
		document.writeln("<OBJECT  classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0' WIDTH='777' HEIGHT='194' id='ulh' >");
		document.writeln("<PARAM NAME=movie VALUE='/i/ulh2.swf'> <PARAM NAME=quality VALUE=high> <PARAM NAME=bgcolor VALUE=#FFFFFF> <EMBED src='/i/ulh2.swf' quality=high bgcolor=#FFFFFF  WIDTH='777' HEIGHT='194' NAME='ulh' TYPE='application/x-shockwave-flash' PLUGINSPAGE='http://www.macromedia.com/go/getflashplayer'></EMBED>");
		document.writeln("</OBJECT>");
		
		}
	else {
		document.writeln('<table cellpadding=0 width=777 height=194 cellspacing=0 border=0 class=head>');
		document.writeln('<tr valign=top>');
		document.writeln('<td nowrap>');
		document.writeln('<div class=lang><a href="' + switch_version + '">English</a> | <span class=alang>Русский</span></div>');
		document.writeln('<div class=logo><img src="/i/logo.gif" width=176 height=39 border=0></div>');
		document.writeln('<div class=slogan><img src="/i/slogan.gif" width=251 height=42 border=0></div></td>');
		document.writeln('</tr>');
		document.writeln('</table> ');
		}
}
