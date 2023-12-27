function isEmpty(str) {
	var oReEmpty = /^\s*$/;
	return oReEmpty.test(str);
}

function isTime(sTime) {
	var oReTime = /^(2[0-3][:\-][0-5][0-9]$)|^([0-1]{0,1}[0-9][:\-][0-5][0-9])$/;
	return oReTime.test(sTime);
}

function isPhone(sPhone) {
	var sPhone = sPhone.replace( /[\s\-\(\)\.\]\[]/g, '' );
	var oRePhone = /^\+*\d{7,15}(\+\d{2,4})?$/;
	return oRePhone.test(sPhone);
}

function isEmail(sEmail){
	var sEmail = sEmail.replace( new RegExp('/\(.*?\)/'), '' );
	var oRegExp = /^[A-Za-z0-9][-\w]*(\.[A-Za-z0-9][-\w]*)*@[A-Za-z0-9][-\w]*(\.[A-Za-z0-9][-\w]*)*\.[a-zA-Z]{2,4}$/;
	return oRegExp.test(sEmail);
}

function trim(str) {
	return str.replace(/^\s*(.*)\s*$/, "$1");
}

// class exist check
function checkClass(o, c) {
	return new RegExp('\\b' + c + '\\b').test(o.className);
}

function addClass(o, c) {
	if (!checkClass(o, c)) {
		o.className += o.className == '' ? c : ' '+c;
	}
}

function removeClass(o, c) {
	o.className = o.className.replace(new RegExp('\\b' + c + '\\b'), '');
}

function swapClass(o, c1, c2) {
    var cn=o.className
    o.className=!checkClass(o,c1)?cn.replace(new RegExp('\\b' + c2 + '\\b'),c1):cn.replace(new RegExp('\\b' + c1 + '\\b'),c2);
}

function replaceClass(o, c1, c2) {
    o.className = o.className.replace(new RegExp('\\b' + c1 + '\\b'), c2);
}