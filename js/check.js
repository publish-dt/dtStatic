function checkAll(f)
{
	if(!f["check[]"]) return;
	for(i = 0; i < f["check[]"].length; i++)
	{
		f["check[]"][i].checked = f["check_all"].checked;
	}
	f["check[]"].checked = f["check_all"].checked;
}

function checkProd(f)
{
	if(!f["prods[]"]) return;
	for(i = 0; i < f["prods[]"].length; i++)
	{
		f["prods[]"][i].checked = f["check_all"].checked;
	}
	f["prods[]"].checked = f["check_all"].checked;
}

function switchCheckbox(row)
{
	var chbox = row.getElementsByTagName("INPUT")[0];
	if (chbox != null) chbox.checked = !chbox.checked;
}

function doAction(f, addition)
{
	if(!addition) addition = '';
	check_query = '';
	if(f["check[]"])
	{
		if (f["check[]"][0]) {
			for(i = 0; i < f["check[]"].length; i++) {
				if(f["check[]"][i].checked) {
					check_query += '&check%5B%5D=' + f["check[]"][i].value;
				}
			}
		} else if(f["check[]"].checked) {
			check_query += '&check%5B%5D=' + f["check[]"].value;
		}
	}
	if(check_query)
	{
		switch(f["select_action"].value)
		{
			case "activate":
				confirm_message = "Включить публикацию всех выбранных элементов?";
				break;
			case "suspend":
				confirm_message = "Выключить публикацию всех выбранных элементов?";
				break;
			case "delete":
				confirm_message = "Удалить все выбранные элементы?";
				break;
			  case "activity":
					confirm_message = "Активировать/деактивировать выбранных подписчиков?";
					break;
				case "suspending":
					confirm_message = "Подтвердить/(отказаться от) выбранных подписчиков?";
					break;
			default:
				alert("Выберите действие.");
				return false;
		}
		if(confirm(confirm_message)) {
		  document.location.href = document.location.href + '&action=' + f["select_action"].value + addition + "_checked" + check_query;
		}
	}
	else
	{
		alert("Нет выбранных элементов.");
		return false;
	}
}
