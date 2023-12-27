function popupIMG(href){
	imgFile=window.open("","imgFile","top=40px,left=60px");
	imgHtml=""
	+"<body style='margin:0;padding:0;' onload='opener.popupResize();'>"
	+"<title></title>"
	+"<img id='img' src='"+href+"'onclick='window.close();' alt='Закрыть' title='Закрыть' style='cursor:pointer'>"
	+"</body>";
	imgFile.document.open();
	imgFile.document.write(imgHtml);
	imgFile.document.close();
	return false;
}
function popupResize(){
	if(typeof window.getComputedStyle!='undefined'){
		img=imgFile.document.getElementById("img");
		img_style=imgFile.getComputedStyle(img,'');
		imgFile.resizeTo(1000,1000);
		imgFile.resizeBy(parseInt(img_style.width)-imgFile.innerWidth,parseInt(img_style.height)-imgFile.innerHeight);
	}else if(typeof document.body.scrollWidth!='undefined'){
		b=imgFile.document.body;
		imgFile.resizeTo(100,100);
		imgFile.resizeBy(b.scrollWidth-b.clientWidth,b.scrollHeight-b.clientHeight);
	}
	imgFile.focus();
}