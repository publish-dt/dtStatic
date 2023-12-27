var minwidth = 996;
var defaultBodyClass;
function getBodyWidth()
{
	var ww = document.documentElement.clientWidth;
	var narrow = (ww < minwidth);
	var wide = (ww > 1258);
	var className = narrow ? "narrow-page" : (wide ? "wide-page" : "");
	document.body.className = defaultBodyClass + className;
}

defaultBodyClass = document.body.className;
if (defaultBodyClass != "") defaultBodyClass += " ";
if (document.all) document.body.onresize = getBodyWidth; else document.body.setAttribute("onresize","getBodyWidth()");
getBodyWidth();