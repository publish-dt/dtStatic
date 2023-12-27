function datinger() {
var DayOfWeek = new Array('Sunday','Monday','Вторник','Среда','Четверг','Пятница','Cуббота');
var MonthName = new Array('January','February','March','April','May','Juny','July','August','September', 'October','November','December');
var theDate = new Date();
var sDate = theDate.getDate() + ' ' + MonthName[theDate.getMonth()] + '<b>' + DayOfWeek[theDate.getDay()] + '<\/b>';
document.write(sDate);
}