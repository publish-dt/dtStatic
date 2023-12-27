function ID(id)
{
	return document.getElementById(id);
}

function getNodesOf(obj) 
{
	var result = [], items = obj.childNodes;
	for (var i = 0, lim = items.length; i < lim; i++) 
	{
		var item = items[i];
		if (item.nodeType == 1) result.push(item);
	}
	return result;
}

function tabsGroup(id, n)
{
	this.items = [];
	var blocks = getNodesOf(ID(id + "-blocks"));
	for (var i = 1; i < n + 1; i++)
	{
		var tabControl = ID(id + "-" + i + "c");
		var tabObject = blocks[i-1];
		if (i > 1) tabObject.style.display = "none";
		this.items[i] = {obj: tabObject, control: tabControl};
	}
	blocks[2].style.display = "block";
	this.classOn = this.items[1].control.className;
	this.classOff = this.items[2].control.className;
}
tabsGroup.prototype.select = function(n)
{
	for (var i = 1, lim = this.items.length; i < lim; i++)
	{
		var item = this.items[i];
		item.control.className = (n == i) ? this.classOn : this.classOff;
		if (item.obj) item.obj.style.display = (n == i) ? "block" : "none";
	}	
}

function formatSubMenu()
{
	var menu = ID("sub-menu");
	var list = getNodesOf(menu)[0];
	var items = getNodesOf(list);
	if (items.length > 4)
	{
		var leftSize = Math.ceil(items.length/2);
		if (leftSize < 4) leftSize = 4;
		var list2 = document.createElement("ul");
		list.className  = "sub-menu-half";
		list2.className = "sub-menu-half";
		for (var i = leftSize, lim = items.length; i < lim; i++)
			list2.appendChild(items[i]);
		menu.appendChild(list2);
	}
}