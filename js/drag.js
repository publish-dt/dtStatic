/* word = 'сло- во,ва,в' */
Number.prototype.decline = function(word)
{
	var n = this + " ", p = word.split(/- |,/g);
	var pn = n.match(/([^1]|^)1 /) ? 1 : (n.match(/([^1]|^)[234] /) ? 2 : 3);
	return n + p[0] + p[pn];
}

/* mode: true — add class, false — remove class, "?" — auto */
function setClass(obj, cl, mode)
{
	var c = obj.className || "";
	var mask = new RegExp("(^| )" + cl + "($| )", "gi");
	if (mode == "?") mode = !c.match(mask);
	c = mode ? (c.match(mask) ? c : (c+" "+cl)) : c.replace(mask, " ");
	obj.className = c.replace(/ +/g, " ").replace(/(^ *| *$)/g, "");
}

function addEvent(obj, eventName, eventFunction)
{
	if (document.all) 
	{
		obj.setAttribute(eventName,eventFunction);
		obj[eventName] = new Function("",eventFunction);
	}
	else obj.setAttribute(eventName,eventFunction);
}

/* Object coordinates */
function getCoords(obj)
{
	var o = obj, coords = {x: 0, y: 0}
	while (o && o.tagName != "BODY")
	{
		coords.x += o.offsetLeft;
		coords.y += o.offsetTop;
		o = o.offsetParent;
  	}
  	return coords;	
}

function getCoords2(obj)
{
	var o = obj, coords = {x: 0, y: 0, str: ""}
	while (o && o.tagName != "BODY")
	{
		coords.x += o.offsetLeft;
		coords.y += o.offsetTop;
		coords.str += (o.tagName + "=" + o.offsetTop + ", ");
		o = o.offsetParent;
  	}
  	return coords;	
}


/* Folding */
function makeFolding(obj)
{
	var b = document.createElement("DIV");
	setClass(b,"folding",1);
	addEvent(b,"onclick","foldItem(this)");
	return obj.appendChild(b);
}
function foldItem(obj)
{
	var obj = obj.parentNode;
	setClass(obj, "fold", "?");
}

/* Init site tree */
var oCanvas;
function initSiteTree()
{
	var box = document.getElementById("site-tree");
	var items = box.getElementsByTagName("LI");
	var obj, c;
	for (var i = 0; i < items.length; i++) {
		obj = items[i];
		if (obj.className.indexOf("locked") < 0) {
      		if (obj.parentNode && obj.parentNode.parentNode && obj.parentNode.parentNode.className.indexOf("locked") < 0) {
      			addEvent(obj,"onmousedown","startDrag(this); event.cancelBubble = true; return false;");
      		}
			addEvent(obj.childNodes[1],"oncontextmenu","showItemMenu(this,event); return false;");
			addEvent(obj.childNodes[1],"onmouseover","showDropBox(this,event); event.cancelBubble = true;");
		} else {
			obj.childNodes[1].style.backgroundImage = "url(/i/sitemap/ico_page_locked.gif)";
			addEvent(obj.childNodes[1],"onclick","return false;");
		}
		if (document.all) {
			obj.childNodes[1]["ondragstart"] = new Function("","return false");
		}
		if (!obj.nextSibling) {
			setClass(obj, "last", 1);
		}
		if (obj.getElementsByTagName("UL").length > 0) {
			setClass(makeFolding(obj).parentNode, "fold", obj.parentNode.parentNode.tagName == "LI");
		}
	}
	var flag = (document.compatMode && document.compatMode == "CSS1Compat");
	oCanvas = document.getElementsByTagName(flag ? "HTML" : "BODY")[0];
	addEvent(document.body,"onmousemove","tryToDrag(event)");
	addEvent(document.body,"onmouseup","tryToDrop()");
	//addEvent(document.body,"onmousedown","hideItemMenu()");
	if (document.all) box["onselectstart"] = new Function("","return false");
}




function initUnlinked()
{
	var box = document.getElementById("unlinked");
	var items = box.getElementsByTagName("LI");
	var obj;
	for (var i = 0; i < items.length; i++) {
		obj = items[i];
		addEvent(obj,"onmousedown","startDrag(this); event.cancelBubble = true; return false;");
		addEvent(obj.childNodes[1],"oncontextmenu","showItemMenu(this,event); return false;");
		if (document.all) {
			obj.childNodes[1]["ondragstart"] = new Function("","return false");
		}
	}
	if (document.all) box["onselectstart"] = new Function("","return false");
}

var dragCursor;
var dragging = null;

function tryToDrag(e)
{
	if (!dragging) return false;
	dropOff.style.visibility = "visible";
	dragCursor.style.visibility = "visible";
	dragCursor.style.left = e.clientX + 10 + "px";
	dragCursor.style.top = e.clientY + oCanvas.scrollTop + 10 + "px";
}

function startDrag(obj)
{
	hideItemMenu();
	dragging = obj;
	var coords = getCoords(obj);
	with (dropOff)
	{
		style.left = coords.x + "px";
		style.top = coords.y + 1 + "px";
		style.width = obj.offsetWidth + "px";
		style.height = obj.offsetHeight - 3 + "px";
	}
	dragCursor = document.getElementById("drag-cursor");
}

/* Remove element after drop */
function pasteBranch(obj, list, before)
{
	var oldBefore = obj.previousSibling;
	var oldList = obj.parentNode;
	var oldBox = oldList.parentNode;

	var pasted = before ? list.insertBefore(obj, before) : list.appendChild(obj);
	setClass(pasted, "last", (pasted.nextSibling == null))
	if (pasted.previousSibling) setClass(pasted.previousSibling, "last", 0);

	if (oldList.getElementsByTagName("LI").length < 1 && oldBox.tagName == "LI")
	{
		while (oldBox.childNodes.length > 1) oldBox.removeChild(oldBox.lastChild);
	}
	if (oldBefore) setClass(oldBefore, "last", (oldBefore.nextSibling == null));
	countTrash();
	return pasted;
}

function dropBranch(obj, box, mode)
{
	var list, before = null;
	if (mode == 1)
	{
		list = box.getElementsByTagName("UL");
		if (list.length > 0) list = list[0]; else
		{
			list = box.appendChild(document.createElement("UL"));
			makeFolding(box);
		}
		setClass(list.parentNode, "fold", 0);
	}
	else
	{
		list = box.parentNode;
		before = (mode == 0) ? box : box.nextSibling;
	}
	if (!obj.childNodes[0].getAttribute("onmouseover") || (obj.childNodes[0].getAttribute("onmouseover")+"").match(/anonymous/gi)) 
		{addEvent(obj.childNodes[0],"onmouseover","showDropBox(this,event); event.cancelBubble = true;");}
	pasteBranch(obj, list , before);
}

function tryToDrop()
{
	if (dragging)
	{
		if (dropBox.dropTo) dropBranch(dragging, dropBox.dropTo, dropBox.dropMode);
		dragCursor.style.visibility = "hidden";
		dropBox.obj.style.visibility = "hidden"
		dropOff.style.visibility = "hidden";		
		dragging = null;
	}
}

function dropToUnlinked(boxId)
{
	if (dragging)
	{
		var box = document.getElementById(boxId).getElementsByTagName("UL")[0];
		pasteBranch(dragging, box);	
		
		var last = null, items = box.getElementsByTagName("LI");
		for (var i = items.length; i > 0; i--)
		{
			setClass(items[i-1],"last",0);
			setClass(items[i-1],"fold",0);
			addEvent(items[i-1].childNodes[0],"onmouseover","");
			if (last) last = box.insertBefore(items[i-1],last); else last = box.appendChild(items[i-1]);
		}
		items = box.getElementsByTagName("UL");
		for (var i = items.length; i > 0; i--) items[i-1].parentNode.removeChild(items[i-1]);
		items = box.getElementsByTagName("DIV");
		for (var i = items.length; i > 0; i--) items[i-1].parentNode.removeChild(items[i-1]);
	}
}

function openTrash()
{
	var trash = document.getElementById("trash");
	if (trash.getElementsByTagName("LI").length > 0) setClass(trash,"trash-closed",0);
}

function hideTrash()
{
	var trash = document.getElementById("trash");
	setClass(trash,"trash-closed",1);
}

function countTrash()
{
	var trash = document.getElementById("trash");
	var n = trash.getElementsByTagName("LI").length;
	if (n > 0) 
	{
		document.getElementById("trash-label").innerHTML = "В корзине " + n.decline("страни- ца,цы,ц");
	}
	else
	{
		document.getElementById("trash-label").innerHTML = "<em>Корзина</em>";
		hideTrash();
	}
}

function dropToLinked()
{
	if (dragging)
	{
		var box = document.getElementById("site-tree").getElementsByTagName("UL")[0];;
		var tempObj = pasteBranch(dragging, box);	
		if (!tempObj.childNodes[0].getAttribute("onmouseover") || (tempObj.childNodes[0].getAttribute("onmouseover")+"").match(/anonymous/gi)) 
			{addEvent(tempObj.childNodes[0],"onmouseover","showDropBox(this,event); event.cancelBubble = true;");}
	}
}

/* Show and hide drop box */
function showDropBox(obj,e)
{
	if (dragging && obj != dragging)
	{
		var coords = getCoords2(obj.parentNode);
		dropBox.y = coords.y + 1;
		dropBox.h = obj.offsetHeight + 4;
		dropBox.dropTo = obj.parentNode;
		with (dropBox.obj)
		{
			style.left = coords.x + 17 + "px";
			style.top = dropBox.y - 2 + "px";
			style.width = obj.offsetWidth + 3 + "px";
			style.height = dropBox.h + "px";
			style.visibility = "visible";
		}
		//document.getElementById("test").innerHTML = coords.str;
		setDropMode(e);
	}
}

function hideDropBox() 
{
	dropBox.dropTo = null;
	dropBox.obj.style.visibility = "hidden";
}

function setDropMode(e)
{
	var obj = dropBox.dropTo.parentNode && dropBox.dropTo.parentNode.parentNode;
	if (obj && obj.className.indexOf("locked") < 0)
		{dropBox.dropMode = Math.round((e.clientY + oCanvas.scrollTop + 2 - dropBox.y) * 2 / dropBox.h);}
	else dropBox.dropMode = 1;
	dropBox.obj.className = "dropmode" + dropBox.dropMode;
}

/* Menu */
menuParent = null;
function showItemMenu(obj,e)
{
	var $box = $("#item-menu"),
		$obj = $(obj);
	$box.css({
		left: e.clientX - 2 + "px",
		top: e.clientY + oCanvas.scrollTop - 2 + "px",
		visibility : "visible"
	});
	if (!$obj.parent().find('ul').length) {
		$box.find('.sel, .desel').hide();
	} else {
		if ($obj.parent().find('ul a.selected').length) {
			$box.find('.desel').show();
		} else {
			$box.find('.desel').hide();
		}
		if ($obj.parent().find('ul a').not('.selected').not('.unselectable').length) {
			$box.find('.sel').show();
		} else {
			$box.find('.sel').hide();
		}
	}
	menuParent = obj.parentNode;
	//document.getElementById("menuview").childNodes[0].href = obj.xhref;
	document.getElementById("menuview").childNodes[0].href = obj.getAttribute('xhref');
    document.getElementById("menuedit").childNodes[0].href = obj.href;
	var flag = obj.previousSibling.className.match(/inactive/,"gi");
	document.getElementById("menupublic").innerHTML = (flag?"Включить публикацию":"Отключить публикацию");
	document.getElementById("menupublic").className = flag ? "public" : "unpublic";	
}

function hideItemMenu()
{
	var box = document.getElementById("item-menu");
	box.style.visibility = "hidden";
	menuParent = null;
	//document.getElementById("trash-list").style.visibility = "hidden";
}

function menuDelete()
{
	dragging = menuParent;
	dropToUnlinked("trash");
	dragging = null;
}

function menuPublic()
{
	var obj = menuParent.childNodes[0];
	setClass(obj, "inactive", "?");
}


function tryToSave(field)
{
	var savePages = field.parentNode;
	var str, items, pid;
	items = document.getElementById("site-tree").getElementsByTagName("LI");
	str = "";
	for (var i = 0; i < items.length; i++)
	{
		if (i > 0) str += ",";
		str += items[i].id.substr(4) + "-";	
		pid = items[i].parentNode.parentNode.id;
		str += (pid == "site-tree")?"0":pid.substr(4);
		str += "-";
		str += (items[i].childNodes[0].className.match(/inactive/,"gi"))?"0":"1";
	}
	savePages.bound_pages.value = str;

	items = document.getElementById("unlinked").getElementsByTagName("LI");
	str = "";
	for (var i = 0; i < items.length; i++)
	{
		if (i > 0) str += ",";
		str += items[i].id.substr(4) + "-";
		str += (items[i].childNodes[0].className.match(/inactive/,"gi"))?"0":"1";
	}
	savePages.unbound_pages.value = str;

	str = "";
	items = document.getElementById("trash").getElementsByTagName("LI");
	for (var i = 0; i < items.length; i++) {
		if (i > 0) str += ",";
		str += items[i].id.substr(4);
	}
	savePages.trash_pages.value = str;
	savePages.submit();
}

function selectChilds()
{
	var $link = $(menuParent).find('a:first');
	if (! gTplId) {
		gTplId = $link.attr('data-tpl-id');
		$('[data-tpl-id][data-tpl-id != '+gTplId+']').addClass('unselectable');
		$('#blckGrpActs').fadeIn();
	}
	$(menuParent).find('ul a[data-tpl-id='+gTplId+']').addClass('selected');
}

function deselectChilds()
{
	$(menuParent).find('ul a').removeClass('selected');
	selected_list = $('a.selected');
	if (! selected_list.length) {
		gTplId = 0;
		$('a.unselectable').removeClass('unselectable');
		$('#blckGrpActs').fadeOut();
	}
}

var gTplId = 0;

$(function() {
	$('.pages ul').click(function(event) {
		
		var $target = $(event.target), $parent = $target.parent(), $link = $target.next();
		if ('I' == event.target.tagName && $target.hasClass('ico') && !$link.hasClass('unselectable')) {
			var tpl_id = $link.attr('data-tpl-id'), selected_list;
			if ($link.hasClass('selected')) {
				$link.removeClass('selected');
				selected_list = $('a.selected');
				if (! selected_list.length) {
					gTplId = 0;
					$('a.unselectable').removeClass('unselectable');
					$('#blckGrpActs').fadeOut();
				}
			} else {
				selected_list = $('a.selected');
				if (! selected_list.length) {
					gTplId = tpl_id;
					$('[data-tpl-id][data-tpl-id != '+gTplId+']').addClass('unselectable');
					$('#blckGrpActs').fadeIn();
				}
				$link.addClass('selected');
			}
			return false;
		}
	});
});