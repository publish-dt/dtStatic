function getLang() {
	var dl = "";
	dl += document.location;
	oReLang = /lang=([a-z]*)/;
	oReLang.exec(dl.toLowerCase());
	return RegExp.$1;
}
