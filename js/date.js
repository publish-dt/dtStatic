function datinger () {
var DayOfWeek = new Array('Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Cуббота');
var MonthName = new Array('января','февраля','марта','апреля','мая','июня','июля','августа','сентября', 'октября','ноября','декабря');
var theDate = new Date();
var sDate = theDate.getDate() + ' ' + MonthName[theDate.getMonth()] + ', <b>' + DayOfWeek[theDate.getDay()] + '<\/b>';
document.write(sDate);
}

function datinger_en () {
var DayOfWeek = new Array('sunday','monday','tuesday','wednesday','thursday','friday','saturday');
var MonthName = new Array('January','February','March','April','May','Juny','July','August','September', 'October','November','December');
var theDate = new Date();
var sDate = theDate.getDate() + ' ' + MonthName[theDate.getMonth()] + ', <b>' + DayOfWeek[theDate.getDay()] + '<\/b>';
document.write(sDate);
}

function datinger_fr () {
var DayOfWeek = new Array('sunday','monday','tuesday','wednesday','thursday','friday','saturday');
var MonthName = new Array('January','February','March','April','May','Juny','July','August','September', 'October','November','December');
var theDate = new Date();
var sDate = theDate.getDate() + ' ' + MonthName[theDate.getMonth()] + ', <b>' + DayOfWeek[theDate.getDay()] + '<\/b>';
document.write(sDate);
}