function init() {

	var mp = 'nav';
	var hp = 'hide';
	var sp = 'show';
	var ct = 'control';
	var pp = 'parent';
	var pa = 'active';
	var d, uls, i;
	var cu = window.location.href;
	if (!document.getElementById && !document.createTextNode) {
		return;
	}
	d = document.getElementById('mn');
	if (!d) {
		return;
	}
  
	addclass(d, mp);
	replacelink(d.getElementsByTagName('A'));
	uls = d.getElementsByTagName('UL');
	for (i = 0; i < uls.length; i++) {
		var ctrl = createcontrol(uls[i]);
		addclass(ctrl, ct);
		if (checkcurrent(uls[i])) {
			addclass(uls[i], sp);
			addclass(ctrl, pa);
		}
		else {
			addclass(uls[i], hp);
			addclass(ctrl, pp);
		}
		ctrl.onclick = function() {
			swapclass(this, pp, pa);
			swapclass(this.parentNode.getElementsByTagName('UL') [0], hp, sp);
			return false;
		}
	}
	function extractPID(url) {
		if(url) {
			if(/parent=(\d+)\D?/.exec(url)) return RegExp.$1;
		} else {
		  return 0;
		}
	} 
	function cmpPID(murl, purl) {
		//var m = extractPID(murl);
		//var p = extractPID(purl);
		purl = purl.replace(/\/\w+\.html/,"/");	
		if((murl==purl) && purl) return true;
		else return false;
	}
	function replacelink(c) {
		for (i = 0; i < c.length; i++) {
			if(cmpPID(c[i].href,cu)) {
				s = document.createElement('SPAN');
				if(c[i].href == cu) {
					 s.innerHTML = c[i].innerHTML;
					 c[i].parentNode.replaceChild(s, c[i]);
				} else {
					s.innerHTML = c[i].innerHTML;
					c[i].innerHTML = '';
					c[i].appendChild(s);
				}
				return;
			}
		}
	}
	function createcontrol(o) {
		return o.parentNode.insertBefore(document.createElement('A'), o.parentNode.firstChild);
	}
	function checkcurrent(o) {
		return (o.parentNode.getElementsByTagName('SPAN').length);
	}
	function swapclass(o, c1, c2) {
		var cn = o.className;
		o.className = !check(o,c1)?cn.replace(c2,c1):cn.replace(c1, c2);
	}
	function addclass(o, c) {
		if (!check(o, c)) {
			o.className += o.className == ''?c:' '+c;
		}
	}
	function check(o, c) {
	 	return new RegExp('\\b' + c + '\\b').test(o.className);
	}
}

