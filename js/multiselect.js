function multiselectInsert(dest_id, src_id, save_id)
{
    var dest = document.getElementById(dest_id);
    var src = document.getElementById(src_id);
	var exists_val = new Array();
    var add_key = new Array();

    if (!dest || !src) return;

    for (var i = 0; i < dest.options.length; i++) {
    	exists_val[dest.options[i].value] = i;
    }

    for (i = 0; i < src.options.length; i++) {
    	if (src.options[i].selected && !(src.options[i].value in exists_val)) {
           add_key.push(i);
       }
    }

    if (add_key.length > 0) {
   	   var j = 0, len = dest.length;
   	   for (i = 0; i < add_key.length; i++) {
   	   	   dest.options[len + j] = new Option(src.options[add_key[i]].text, src.options[add_key[i]].value);
   	   	   j++;
   	   }
   }
   if (save_id) {
       multiselectSave(save_id, dest_id);
   }
}

function multiselectRemove(dest_id, src_id, save_id)
{
    var dest = document.getElementById(dest_id);
    var src = document.getElementById(src_id);

    if (!dest || !src) return;

	for (var i = dest.options.length - 1; i >= 0; i--) {
		if (dest.options[i].selected) {
			dest.options[i] = null;
		}
    }save_id
   if (save_id) {
       multiselectSave(save_id, dest_id);
   }
}

function multiselectSave(save_id, dest_id)
{
    var save = document.getElementById(save_id);
    var dest = document.getElementById(dest_id);
    if (!save || !dest) return;
    var ret = [];
    for (var i = 0; i < dest.options.length; i++) {
        ret[i] = dest.options[i].value;
    }
    save.value = ret.join(",");
}