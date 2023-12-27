var i_start		= 0;
var i_end		= 3;

function setReadRight(obj, i) {
	if (obj.checked) {
		document.getElementById("r_" + i).checked = true;
	}
}

function clearAllRight(obj, i) {
	if (!obj.checked) {
		document.getElementById("d_" + i).checked = false;
		document.getElementById("p_" + i).checked = false;
		document.getElementById("e_" + i).checked = false;
	}
}

function setOnOffAllChkBox(type_id) {
	var id = document.getElementById(type_id + 'all');
	if (id.checked) {
		for (i = i_start; i < i_end; i++) {
			obj = document.getElementById(type_id + i);
			obj.checked = true;
			if ("r_" != type_id) {
				setReadRight(obj, i);
				document.getElementById("r_all").checked = true;
			}
		}
	} else {
		for (i = i_start; i < i_end; i++) {
			obj = document.getElementById(type_id + i);
			obj.checked = false;
			if ("r_" == type_id) {
				clearAllRight(obj, i);
				document.getElementById("d_all").checked = false;
				document.getElementById("p_all").checked = false;
				document.getElementById("e_all").checked = false;
			}
		}
	}
	return true;
}
function updateSelect(user_id) {
	var group  = document.getElementById("group");
	var cnt=group.options.length;
	for ( i=0; i < cnt; i++ )
		group.options.remove( 0 );
	if(!user_groups[user_id]) return;
	cnt=user_groups[user_id].length;
	for ( i=1; i < cnt; i++ ) {
		var oOption = document.createElement("OPTION");
		group.options.add( oOption );
		oOption.innerHTML = groups[user_groups[user_id][i]];
		oOption.value = user_groups[user_id][i];
    }
}
