function cancel() {
	if (window.opener) {
		window.close();
	} else {
		history.go(-1);
	}
}

function de_init() {

    if (gShortMode) {
	    close_win_onsubmit();
	}
	
	var mp='de_nav';
	var hp='de_hide';
	var sp='de_show';
	var pp='de_parent';
	var pa='de_active';
	var cu='current';
	
	var d,uls,i;
	if(!document.getElementById && !document.createTextNode){return;}

	d=document.getElementById('nav');

	if (!d){return;}
	de_addclass(d,mp);
	uls=d.getElementsByTagName('ul');
	for (i=0;i<uls.length;i++)
	{
		if(de_checkcurrent(uls[i]))
		{
			de_addclass(uls[i].parentNode.firstChild,pa);
		} else {
			de_addclass(uls[i],hp);
			de_addclass(uls[i].parentNode.firstChild,pp);
			uls[i].parentNode.firstChild.onclick=function()
			{
				de_swapclass(this,pp,pa);
				de_swapclass(this.parentNode.getElementsByTagName('ul')[0],hp,sp);
				return false;
			}
		}
	}
	function de_checkcurrent(o){
		if(de_check(o.parentNode,cu)){return true;}
		for(var i=0;i<o.getElementsByTagName('li').length;i++)
		{
			if(de_check(o.getElementsByTagName('li')[i],cu)){return true;}
		}
		return false;
	}
	function de_swapclass(o,c1,c2){
		var cn=o.className
		o.className=!de_check(o,c1)?cn.replace(c2,c1):cn.replace(c1,c2);
	}
	function de_addclass(o,c){
		if(!de_check(o,c)){o.className+=o.className==''?c:' '+c;}
	}
	function de_check(o,c){
	 	return new RegExp('\\b'+c+'\\b').test(o.className);
	}	
}

function close_win_onsubmit() {
    $('form').each(function() {
        this._submit = this.submit;
        this.submit = function() {
            this._submit();
            if (! parseInt(this.tryon.value)) {
                window.close();
            }            
        }
    });
}

window.onload=function(){
	de_init();
}
