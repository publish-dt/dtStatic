function setClass(obj, cl, mode){
	var c = obj.className || "";
	var mask = new RegExp("\\b" + cl + "\\b", "gi");
	if (mode == "?") mode = !c.match(mask);
	c = mode ? (c.match(mask) ? c : (c+" "+cl)) : c.replace(mask, "");
	obj.className = c.replace(/ +/g, " ").replace(/(^ *| *$)/g, "");
}

function blockReverce(id1,id2,baseurl) {
	var div1 = document.getElementById(id1);
	var div2 = document.getElementById(id2);
	var div1upli = document.getElementById(id1+"_up");
	var div1downli = document.getElementById(id1+"_down");
	var div2upli = document.getElementById(id2+"_up");
	var div2downli = document.getElementById(id2+"_down");

	/* Create new JsHttpRequest object. */
	var req = new JsHttpRequest();
	/* Code automatically called on load finishing. */
	req.onreadystatechange = function() {
		if (req.readyState == 4) {
			/* Write result to page element. */
			if (req.responseJS.res > 1) {
				div2.parentNode.insertBefore(div2,div1);
				// установим видимость ссылок
				div1downli.className = div2downli.className;
				div2upli.className = div1upli.className;
				div1upli.className = "admin-move-block";
				div2downli.className = "admin-move-block";
			}
		}
	};
	/* Prepare request object (automatically choose GET or POST). */
	req.open("GET", baseurl+"&module=pages&type=JsHttpRequest&action=pagesblockreverce", true);
	/* Send data to backend. */
	req.send( { id1: id1, id2: id2 } );
	return false;
}

function blockUp(obj,id,baseurl) {
	var childs = document.getElementById(id).parentNode.getElementsByTagName("DIV");
	prev_id = "";
	for (i=0; i<childs.length; i++) {
		if (childs[i].id.substr(0,10) != "mod_block_") continue;
		if (childs[i].id == id) {
			return blockReverce(prev_id,id,baseurl);
		} else {
			prev_id = childs[i].id;
		}
	}
}

function blockDown(obj,id,baseurl) {
	var childs = document.getElementById(id).parentNode.getElementsByTagName("DIV");
	found = false;
	for (i=0; i<childs.length; i++) {
		if (childs[i].id.substr(0,10) != "mod_block_") continue;
		if (!found) {
			if (childs[i].id == id) {found = true;}
		} else {
			return blockReverce(id,childs[i].id,baseurl);
		}
	}
}

function tryToAddBlock(f)
{
	eval(f["block-type"].value);
	showAddBlockMenu(f,0);
	return false;
}


var lastAddedBlock = null;
function blockAdd(page_id, module_id, field_num, baseurl)
{
	var req = new JsHttpRequest();
	req.onreadystatechange = function()
	{
		if (req.readyState == 4 && req.responseJS.res)
		{
			var div = document.getElementById("page_field_" + field_num);
			var addButton = div.removeChild(div.lastChild);
			var firstDiv = div.getElementsByTagName("DIV")[0];
			if (firstDiv && firstDiv.className == "admin-empty-field") {
			    div.removeChild(firstDiv);
			}
			div.innerHTML = div.innerHTML + req.responseJS.content;
			/* show down link for previuose block */
			id = "mod_block_" + req.responseJS.block_id;
			prev_id = "";
			var childs = div.getElementsByTagName("DIV");
			for (var i = 0; i < childs.length; i++)
			{
				if (childs[i].id.substr(0,10) != "mod_block_") continue;
				if (childs[i].id == id) break; else prev_id = childs[i].id;
			}
			var prev_block = document.getElementById(prev_id + "_down");
			if (prev_block) prev_block.className = "admin-move-block";
			div.appendChild(addButton);
		}
	}
	/* Prepare request object (automatically choose GET or POST). */
	req.open("GET", baseurl+"&module=pages&type=JsHttpRequest&action=pagesblockadd", true);
	req.send({page_id: page_id, module_id: module_id, field_num: field_num});
	return false;
}

function blockDelete(id, baseurl)
{
	var div = document.getElementById(id);
	var req = new JsHttpRequest();
	req.onreadystatechange = function()
	{
		if (req.readyState == 4 && req.responseJS.res > 0)
		{
		    var box = div.parentNode;
			box.removeChild(div);
			var divs = box.getElementsByTagName("div");
			if (divs[0].className == "admin-block-add-box")
			{
			    var emptyDiv = document.createElement("div");
			    emptyDiv.className = "admin-empty-field";
			    emptyDiv.appendChild(document.createTextNode("Пустое поле"));
			    box.insertBefore(emptyDiv, divs[0]);
			}
		}
	}
	/* Prepare request object (automatically choose GET or POST). */
	req.open("GET", baseurl+"&module=pages&type=JsHttpRequest&action=pagesblockdelete", true);
	req.send({id: id});
	return false;
}

var properties_div = null;
var properties_div_shadow = null;
var prop_number	= 9;				//	(action + 5 properties + linked_page... from 0 to 8)
var lp			= prop_number - 3;	// индекс элемента соответствующего linked_page в массиве prop (последний элемент)
var	material_url= '';
var	material_id	= '';
var link		= '';
var name 		= "";
var field_id	= 0;
var block_id	= 0;
var block_prop	= null;
var baseurl		= "";
var gTpl		= "";

var isMSIE = /*@cc_on!@*/false;
var notIE7 = (navigator.userAgent.indexOf("MSIE 7") < 0);
var isStrict = document.compatMode=="CSS1Compat";

function KL_getBody(w){
  if(!w) w=window
  if(isStrict){
    return w.document.documentElement
  }else{
    return w.document.body
  }
}

var ieCanvas = document.getElementsByTagName((document.compatMode && document.compatMode == "CSS1Compat") ? "HTML" : "BODY")[0];
function showPropertiesDiv(url) {
	properties_div = document.getElementById("properties_div");
	properties_div_shadow = document.getElementById("properties_div_shadow");
	properties_div.innerHTML = "<div align=center><h6>Loading...</h6></div>";
	var properties_div_bgr = document.getElementById("properties_div_bgr_2");
	if (isMSIE && notIE7)
	{
	    properties_div_shadow.style.height = "1px";
        properties_div_shadow.style.height = ieCanvas.scrollHeight + "px";
		properties_div.style.top = ieCanvas.scrollTop + Math.round(KL_getBody(window).clientHeight/2) + "px";
		properties_div_bgr.style.top = ieCanvas.scrollTop + Math.round(KL_getBody(window).clientHeight/2) + "px";
	}
	properties_div.className = "admin-properties-div";
 	properties_div.style.display = "block";
 	properties_div_shadow.style.display = "block";
 	properties_div_bgr.style.display = "block";

	/* Create new JsHttpRequest object. */
	var req = new JsHttpRequest();
	/* Code automatically called on load finishing. */
	req.onreadystatechange = function() {
		if (req.readyState == 4) {
			/* Write result to page element. */
			properties_div.innerHTML = req.responseText;
			if (winLoaded()) {
				getActionPrp();
			} else {
				processResult();
			}
		}
	};
	/* Prepare request object (automatically choose GET or POST). */
	req.open("GET", url, true);
	/* Send data to backend. */
	req.send();
}

function processResult() {
	if (typeof(block_prop) == 'object' && null != block_prop[9] && '' != block_prop[9]) {
		url_2 = block_prop[9] + '&field=' + field_id;
		block_prop.splice(9, (block_prop.length - 9));
		showPropertiesDiv(url_2);
		return true;
	}
	properties_div.style.display = "none";
	properties_div_shadow.style.display = "none";

	document.getElementById("properties_div_bgr").style.display = "none";
	document.getElementById("properties_div_bgr_2").style.display = "none";
	if (lastAddedBlock)
	{
		lastAddedBlock.style.display = "block";
		lastAddedBlock = null;
	}

	block_prop.splice(9, (block_prop.length - 9));

	/* Create new JsHttpRequest object. */
	var req = new JsHttpRequest();
	/* Code automatically called on load finishing. */
	req.onreadystatechange = function() {
		if (req.readyState == 4) {
			/* Write result to page element. */
			var div = document.getElementById('mod_block_'+block_id);
			var prnt = div.parentNode;
			var button = prnt.removeChild(prnt.lastChild);
			prnt.removeChild(div);
			prnt.innerHTML = prnt.innerHTML + req.responseJS.content;
			if (req.responseJS.next_block > 0) {
				// insert before block with id = req.responseJS.next_block
				var next_div = document.getElementById('mod_block_'+req.responseJS.next_block);
				div = document.getElementById('mod_block_'+block_id);
				prnt.insertBefore(div,next_div);
			}
			prnt.appendChild(button);
		}
	};
	/* Prepare request object (automatically choose GET or POST). */
	req.open("GET", baseurl+"&module=pages&type=JsHttpRequest&action=pagesblockproperties", true);
	/* Send data to backend. */
	req.send( { id: block_id, block_prop: block_prop, tpl: gTpl } );
	return true;
}

function blockProperties(module,field,lang,block,prop,base_url,tpl) {
	name = module;
	field_id = field;
	block_id = block;
	block_prop = prop;
	baseurl = base_url;
	gTpl = tpl;
	url = '/admin.php?name=' + module + '&action=properties&field=' + field + '&lang=' + lang + '&block_id=' + block;
	showPropertiesDiv(url);
    return false;
}

function winLoaded() {
	var window_url	= document.getElementById('window_url');
	var site_target	= document.getElementById('site_target');
	link			= '&action=properties&name='+name+'&block_id='+block_id;

	if (window_url && window_url.value != '' && window_url.value != site_target.options[site_target.selectedIndex].value) {
		block_prop[prop_number] = window_url.value + link;
		return false;
	}
	var el, i;
	el = document.getElementById('block_action');
	if (el && block_prop[0] != null && block_prop[0] != '') {
	    for (i=0; i<el.options.length; i++) {
	        if (el.options[i].value == block_prop[0]) {
	            el.options.selectedIndex = i;
	        }
	    }
	}
	el = document.getElementById('linked_page');
	if (el && block_prop[lp] != null && block_prop[lp] != '') {
	    for (i=0; i<el.options.length; i++) {
	        if (el.options[i].value == block_prop[lp]) {
	            el.options.selectedIndex = i;
	        }
	    }
	}
	return true;
}

function getActionPrp() {
	var target = document.getElementById('target_span');
	var action = document.getElementById('block_action');
	site_target = document.getElementById('site_target');
	site_target_url = site_target.options[site_target.selectedIndex].value;

	var newscript = document.createElement("SCRIPT");
	newscript.src = site_target_url+'&action=block_prp&name='+name+'&sub_action='+action.options[action.selectedIndex].value+'&block_id='+block_id;
	newscript.type = "text/javascript";
	target.parentNode.appendChild(newscript);
}

function changeAction() {
	for (var l, j, p, i = 1; i < prop_number - 3; i++) {
		p = document.getElementById('property'+i);
		if (block_prop[i] != null && p != null && block_prop[i] != '') {		    
		    if ('object' == typeof block_prop[i] || 'array' == typeof block_prop[i]) {
		        l = p.getElementsByTagName('INPUT');
		        if (l) {
		            for (j in l) {
		                if (l[j].name && block_prop[i][l[j].name]) {
		                    l[j].checked = true;
		                }
		            }
		        }
		    } else {
		        if ('input' == p.tagName.toLowerCase()) {
    		        p.value		= block_prop[i];
    		    } else if ('select' == p.tagName.toLowerCase()) {
    		        for (j = 0; j<p.options.length; j++) {
    		            if (block_prop[i] == p.options[j].value) {
    		                p.options.selectedIndex = j;
    		            }
    		        }
    		    }
		    }		    
		}
	}
	if (gTpl) {
	    p = document.getElementById('slctTpl');
	    if (p) {
	         for (j = 0; j<p.options.length; j++) {
	             if (gTpl == p.options[j].value) {
	                 p.options.selectedIndex = j;
	             }
	         }
	    }
	}
}

function btnOkClicked(site) {
	var block_action = document.getElementById('block_action');
	if (block_action != null && block_action.value != '') {
		block_prop[0] = block_action.options[block_action.selectedIndex].value;
	} else {
		block_prop[0] = "";
	}

	// получить значение свойств
	for (var l, p, i = 1; i < prop_number - 3; i++) {
		p = document.getElementById('property'+i);
		block_prop[i] = '';
		if (p) {
		    if ('input' == p.tagName.toLowerCase()) {
		        block_prop[i] = p.value;
		    } else if ('select' == p.tagName.toLowerCase()) {
		        block_prop[i] = p.options[p.options.selectedIndex].value;
		    } else if ('fieldset' == p.tagName.toLowerCase()) {
		        l = p.getElementsByTagName('input');
		        if (l) {
		            block_prop[i] = {};
		            for (var j=0; j<l.length; j++) {
		                block_prop[i][l[j].name] = l[j].checked ? l[j].value : '';
		            }
		        }		        
		    }
		}
	}

	// получить страницу перехода linked_page
	linked_page = document.getElementById('linked_page');
	if (linked_page != null && linked_page.options[linked_page.selectedIndex].value != '') {
		block_prop[lp] = linked_page.options[linked_page.selectedIndex].value;
	}

	block_prop[prop_number - 2]	= document.getElementById('site_id').value;
	block_prop[prop_number - 1]	= document.getElementById('lang_id').value;

	if ('' != site) {
		block_prop[prop_number] = site;
	}
	p = document.getElementById('slctTpl');
	gTpl = '';
	if (p) {
	    if (p.options.selectedIndex > 0) {
	        gTpl = p.options[p.options.selectedIndex].value;
	    }
	}
	processResult(field_id, block_id, block_prop);
	return false;
}

function btnCancelClicked() {
	if (lastAddedBlock)
	{
		lastAddedBlock.style.display = "block";
		lastAddedBlock = null;
	}
	document.getElementById("properties_div").style.display = "none";
	document.getElementById("properties_div_shadow").style.display = "none";
	document.getElementById("properties_div_bgr").style.display = "none";
	document.getElementById("properties_div_bgr_2").style.display = "none";
	return false;
}

function gotoURL(site_target) {
	popupWin = window.open("http://"+site_target+material_url+material_id, 'small', 'resizable=yes,scrollbars=yes,location=no,width=800,height=600,top=0');
	popupWin.focus();
}

function setURL(prop_id) {
	var p_id	= document.getElementById(prop_id);
	var id		= document.getElementById('edit_material');

	if (p_id) {
		material_id	= p_id.options[p_id.selectedIndex].value;
	} else {
		material_id	= '';
	}

	if (id && (material_id == '' || material_id == 0 || material_id == 'all_cat' || material_id == 'all')) {
		id.style.display = 'none';
	} else if (id) {
		id.style.display = 'block';
	}
}

function changeSiteTarget() {
	var s_id = document.getElementById('site_target');
	btnOkClicked(s_id.options[s_id.options.selectedIndex].value + '&site=change' + link);
}

/*
	Функция для вызова из меню модулей для включения/отключения публикации
*/
function doActivate(obj,module,action,item_id,adminurl) {
	var menu_div = obj.parentNode.parentNode;
	/* Create new JsHttpRequest object. */
	var req = new JsHttpRequest();
	/* Code automatically called on load finishing. */
	req.onreadystatechange = function() {
		if (req.readyState == 4) {
			/* Write result to page element. */
			if (req.responseJS.res) {
				document.getElementById(module+"_"+item_id+"_activate").style.display = (action == "activate" ? "none" : "inline");
				document.getElementById(module+"_"+item_id+"_suspend").style.display = (action == "activate" ? "inline" : "none");
			}
		}
	};
	/* Prepare request object (automatically choose GET or POST). */
	req.open("GET", adminurl+"&name="+module+"&type=JsHttpRequest&action="+action, true);
	/* Send data to backend. */
	req.send( { id: item_id } );
	return false;
}

/*
	Функция для закрытия всплывающего слоя
*/
function cancel() {
	if (lastAddedBlock)
	{
		lastAddedBlock.style.display = "block";
		lastAddedBlock = null;
	}
	document.getElementById("properties_div").style.display = "none";
	document.getElementById("properties_div_shadow").style.display = "none";
	document.getElementById("properties_div_bgr").style.display = "none";
	document.getElementById("properties_div_bgr_2").style.display = "none";
	return false;
}

/*
	Функция для сохранения прав выбранного элемента
*/
function doSaveRights(myForm) {
	/* Create new JsHttpRequest object. */
	var req = new JsHttpRequest();
	/* Code automatically called on load finishing. */
	req.onreadystatechange = function() {
		if (req.readyState == 4) {
			/* Write result to page element. */
			properties_div.style.display = "none";
			document.getElementById("properties_div_shadow").style.display = "none";
			document.getElementById("properties_div_bgr").style.display = "none";
			document.getElementById("properties_div_bgr_2").style.display = "none";
		}
	};
	req.loader = 'FORM';
	/* Prepare request object (automatically choose GET or POST). */
	req.open("POST", myForm.action, true);
	/* Send data to backend. */
	req.send( { rights_data: myForm } );
	return false;
}

/*
	Функция для удаления выбранного элемента
*/
function doDelete(obj,module,action,item_id,adminurl) {
	var menu_div = obj.parentNode.parentNode.parentNode;
	setClass(menu_div,'hover',0);
	/* Create new JsHttpRequest object. */
	var req = new JsHttpRequest();
	/* Code automatically called on load finishing. */
	req.onreadystatechange = function() {
		if (req.readyState == 4) {
			/* Write result to page element. */
			if (req.responseJS.res) {
				/*
				var div = document.getElementById(req.responseJS.cur_block);
				var prnt = div.parentNode;
				var button = prnt.removeChild(prnt.lastChild);
				prnt.removeChild(div);
				prnt.innerHTML = prnt.innerHTML + req.responseJS.content;
				if (req.responseJS.next_block > 0) {
					// insert before block with id = req.responseJS.next_block
					var next_div = document.getElementById('mod_block_'+req.responseJS.next_block);
					div = document.getElementById(req.responseJS.cur_block);
					prnt.insertBefore(div,next_div);
				}
				prnt.appendChild(button);
				*/
				window.history.go(0);
			}
		}
	};
	/* Prepare request object (automatically choose GET or POST). */
	req.open("GET", adminurl+"&name="+module+"&type=JsHttpRequest&action="+action, true);
	/* Send data to backend. */
	req.send( { id: item_id, block_id: menu_div.parentNode.parentNode.parentNode.parentNode.id } );
	return false;
}


function adminShowShadow(obj,e)
{
	var shade = obj.previousSibling;
	if (shade && obj.previousSibling.className == "addblockshadow") shade = null;
	var box = obj.parentNode.parentNode;
	obj.parentNode.style.zIndex = "800";
	if (shade)
	{
		shade.style.height = box.scrollHeight + "px";
		shade.style.visibility = "visible";
 	} else {
		var y = 0, o = obj;
		while (o && o.tagName != "BODY")
		{
			y += o.offsetTop;
			o = o.offsetParent;
	    }
		obj.childNodes[1].style.top = (y < 400) ? "5px" : "auto";
		obj.childNodes[1].style.bottom = (y < 400) ? "auto" : "5px";
 	}
	setClass(obj,"admin-hidden",0);
}


function adminHideMenu(obj)
{
	obj.parentNode.style.zIndex = "0";
    if (obj.previousSibling && obj.previousSibling.className != "addblockshadow") obj.previousSibling.style.visibility = "hidden";
 	setClass(obj,"admin-hidden",1);
}

function showAddBlockMenu(obj,mode)
{
	obj.style.left = "0";
	var box = obj.parentNode;
	var ww = document.width || document.documentElement.scrollWidth;
  	var x = box.offsetLeft;
  	for (var parent = box.offsetParent; parent; parent = parent.offsetParent)
  	{
	    x += parent.offsetLeft - parent.scrollLeft;
  	}
  	if (x + 370 > ww)
  	{
  		obj.style.left = ww - (x + 370) - 5 + "px";
  	}
	obj.style.display = mode ? "block" : "none";
	obj.previousSibling.style.display = mode ? "none" : "block";
}