var pageContent = document.getElementById("page-content");
var pageMarked = document.getElementById("page-marked");
var obj = pageContent.getElementsByTagName("H2")[0];
if (obj && pageMarked.style.display != "block") 
{
	pageMarked.innerHTML = "<h2>" + obj.innerHTML + "</h2>";
	pageMarked.style.display = "block";
	obj.parentNode.removeChild(obj);
}