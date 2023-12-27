function formsCheck() {
	
	// Перечень формальных классов элементов форм
	var s="submitForm";
	var r="required";
	var m="missed";
	var w="wrong";
	
	// Перечень смысловых классов элементов форм
	var phone="phone";
	var number="number";
	var email="email";
	var time="time";
	
	// Переменные сообщения об ошибках
	var rMessage=""; // required message
	var wMessage=""; // wrong message
	// Взять все формы на странице
	var forms = document.getElementsByTagName("form");
	if (!forms) return;
	
	// Перебрать все элементы каждой из этих форм
	for (i=0; i<forms.length; i++) {
		var theForm=forms[i]; // текущая форма
		var e=forms[i].elements; // ее элементы
		
		// Привязать обработчики к элементам с class="required", а также со всеми классами, требующими специфических данных
		for (var k=0; k<e.length; k++) {
		
			if (check(e[k],r) || check(e[k],phone) || check(e[k],email) || check(e[k],time)) {
				switch (e[k].tagName) {
					case "INPUT":
					case "TEXTAREA":
						e[k].onkeyup = e[k].onkeypress = function(){
							if(this.value!=""){
								removeclass(getStyleElement(this), m);
								removeclass(getStyleElement(this), w);
							}else{
								addclass(getStyleElement(this), m);								
							}
						}
						break;
					case "SELECT":
						e[k].onchange = function(){
							if(this.options.selectedIndex!=0){
								removeclass(getStyleElement(this), m);
							}else{
								addclass(getStyleElement(this), m);								
							}
						}
						break;
				}
			}
			
			if (check(e[k],s)){ // Привязываем функцию валидатора формы к элементу с class="submitForm"				
				e[k].onclick = validate(theForm);
			}
		}
	}
	
	function validate(f){
		return function(){return validateForm(f);}
	}
	
	function validateForm(theForm) {
		var ok = true; // флаг валидности данной формы
		var e = theForm.elements; // все элементы данной формы
		
		for (i=0; i<e.length; i++) {			
			switch (e[i].tagName) {
				case "INPUT":
				case "TEXTAREA":
					if (check(e[i],r) && !e[i].value) { // если class="required" и поле не заполнено																		
						ok = false;
						addclass(getStyleElement(e[i]), m);
						rMessage+=getLabel(e[i])+"\n";						
					}else if(e[i].value!=""){
						if(check(e[i],phone) && !isPhone(e[i].value)){
							ok = false;
							addclass(getStyleElement(e[i]), w);
							wMessage+=getLabel(e[i])+"\n";							
						}else if(check(e[i],number) && !isNumber(e[i].value)){
							ok = false;
							addclass(getStyleElement(e[i]), w);
							wMessage+=getLabel(e[i])+"\n";							
						}else if(check(e[i],email) && !isEmail(e[i].value)){
							ok = false;
							addclass(getStyleElement(e[i]), w);
							wMessage+=getLabel(e[i])+"\n";							
						}else if(check(e[i],time) && !isTime(e[i].value)){
							ok = false;
							addclass(getStyleElement(e[i]), w);
							wMessage+=getLabel(e[i])+"\n";							
						}
					}
					break;
				case "SELECT":
					if (check(e[i],r) && e[i].options.selectedIndex==0) { // если class="required" и оставлен нулевой пункт по умолчанию
						ok = false;
						addclass(getStyleElement(e[i]), m);
						rMessage+=getLabel(e[i])+"\n";						
					}
					break;
			}
		}
		
		if (ok){
			theForm.submit();
		}else{
			if(rMessage!=""){
			rMessage="Заполните пропущенные поля:\n"+rMessage+"\n\n";
			}
			if(wMessage!=""){
			wMessage="Введите корректные данные:\n"+wMessage;
			}
			alert(rMessage+wMessage);
			rMessage="";
			wMessage="";
			return false;
		}
	}
	
	// Функция добавления класса к элементу
	function addclass(o, c) {
		if (!check(o, c)) {
			o.className += o.className == ''?c:' '+c;
		}
	}
	
	// Функция удаления класса
	function removeclass(o, c) {
		o.className = o.className.replace(c, '');
	}
	
	// функция проверки наличия данного класса
	function check(o, c) {	 	
		return new RegExp('\\b' + c + '\\b').test(o.className);
	}
	
	// Функции проверок на правильность введенных данных
	function isTime(sTime) {
	oReTime = /^(2[0-3][:\-][0-5][0-9]$)|^([0-1]{0,1}[0-9][:\-][0-5][0-9])$/; 
	return oReTime.test(sTime);
	}
	
	function isNumber(sNumber) {
		oReNumber = /^\-{0,1}\d+$/;
		return oReNumber.test(sNumber);
	}
	
	function isPhone(sPhone) {
		sPhone = sPhone.replace( /[\s\-\(\)\.\]\[]/g, '' );
		oRePhone = /^\+*\d{7,11}(\+\d{2,4})?$/;
		return oRePhone.test(sPhone);
	}
	
	function isEmail(sEmail){
		//sEmail = sEmail.replace( /\(.*?\)/, '' );
		oRegExp = /^[A-Za-z0-9][-\w]*(\.[A-Za-z0-9][-\w]*)*@[A-Za-z0-9][-\w]*(\.[A-Za-z0-9][-\w]*)*\.[a-zA-Z]{2,4}$/;
		return oRegExp.test(sEmail);
	}

	// Возвращаем внутреннее содержимое label, соотвествующего незаполненному элементу формы 
	function getLabel(e){
		labels=e.form.getElementsByTagName("label");
		for(k=0;k<labels.length;k++){
			if(labels[k].htmlFor==e.id){
			    return labels[k].innerHTML;
			    break;
			}
		}
	}
	// Задание "знакового" элемента, к которому будет применяться class="missed" -
	// для указания на элемент формы, необходимый к заполнению
	function getStyleElement(o){
	
		// return o; // задание самого элемента формы в качестве знакового элемента
		// return o.parentNode; // задание родительского контейнера в качестве знакового элемента	
		return o.parentNode.getElementsByTagName("label")[0]; // задание label в качестве знакового элемента
	}
}

formsCheck();
// window.onload = formsCheck;