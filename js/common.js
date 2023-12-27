function intHandler() {
    jQuery(this).keydown(function(event) {
        event =  event || window.event || false;
        if (event && jQuery(this).hasClass('increment')) {            
            if (38 == event.keyCode) {
                jQuery(this).val(parseInt(jQuery(this).val() || 0)+1)
            } else if (40 == event.keyCode) {
                var v = parseInt(jQuery(this).val() || 0);
                jQuery(this).val(jQuery(this).hasClass('plus') && v > 1 ? v-1 : 1);
            }
            return true;
        }
    });
    jQuery(this).keypress(function(event) {
        event =  event || window.event || false;
        var code = event.charCode == undefined ? event.keyCode : event.charCode;
        if (event && code) {
            if ( (code >= 48 && code <= 57) /* 0-9 */
                || (code >= 37 && code <= 40) /* up, down, lft, rht */
                //|| (event.keyCode >= 96 && event.keyCode <= 105)
                || code == 34 || code == 35 /* end, home */  
                || code == 9 /* tab */
                || code == 8 /* backspace */
                || code == 46 /* . */
                //|| code == 110
                //|| code == 190
            ) {
                return true;
            } else {
                event.preventDefault ? event.preventDefault() : (event.returnValue=false);
                return false;
            }
        }
    });
}

function showCanvas()
{
    var el = $("#blckLoadingCanvas");
    if (!el.length) {
        el = $("<div id=\"blckLoadingCanvas\"><!--[if lte IE 6.5]><iframe></iframe><![endif]--></div>").appendTo("body");
    }
    el.css('width', $(document).width()+'px');
    el.css('height', $(document).height()+'px');
    el.show();
}

function hideCanvas()
{
    $("#blckLoadingCanvas").hide();   
}

function checkForm(form) {
    var ret = true;
    var f = $(form);
    $('span.err').remove();
    $('input, select, textarea', f).removeClass('err');
    $('input:visible, select:visible, textarea:visible', f).each(function() {
        var el = $(this);
        var val = el.val();
        var e = '', err_blck, offset;
        if (el.hasClass('required') && '' == val) {
            e = "Обязательно для заполнения";
        } else if (el.hasClass('valid-email') && !$().isEmail(val)) {
            e = "Не соответствует e-mail-у";   
        }
        if (e) {
            showErrBlock(el, e);
            ret = false;
        }
    });
    
    return ret;
}

function showErrBlock(el, err)
{
    el = $(el);
    var offset = el.offset();    
    $('<span class="err">').text(err).css({
        position: 'absolute',
        left: (offset.left+el.width()+9)+'px',
        top: offset.top+'px'
    }).appendTo('body');
    
    el.addClass('err').focus();
}

jQuery(function() {
    if (jQuery.datepicker) {
        $(".datepicker").datepicker({
            dateFormat: 'yy-mm-dd',
            monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']       
        });
    }
    jQuery('.int').each(intHandler);
    jQuery('.up').each(function() {
        var e = jQuery('#'+jQuery(this).attr('for'));        
        if (e.length && e.hasClass('int')) {           
            jQuery(this).click(function(event) {
                event =  event || window.event || false;
                if (event) {
                    var e = jQuery('#'+jQuery(this).attr('for'));
                    e.val(parseInt(e.val() || 0)+1);
                    return true;
                }
            });
        }        
    });
    jQuery('.down').each(function() {
        var e = jQuery('#'+jQuery(this).attr('for'));        
        if (e.length && e.hasClass('int')) {           
            jQuery(this).click(function(event) {
                event =  event || window.event || false;
                if (event) {
                    var e = jQuery('#'+jQuery(this).attr('for'));
                    var v = parseInt(e.val() || 0);
                    e.val(e.hasClass('plus') && v > 1 ? v-1 : 1);
                    return true;
                }
            });
        }        
    });
});

jQuery.fn.extend({
    isEmpty: function(str) {
        var oReEmpty = /^\s*$/;
        return oReEmpty.test(str);
    },
    isTime: function(sTime) {
	   var oReTime = /^(2[0-3][:\-][0-5][0-9]$)|^([0-1]{0,1}[0-9][:\-][0-5][0-9])$/;
	   return oReTime.test(sTime);
    },
    isPhone: function(sPhone) {
    	var sPhone = sPhone.replace( /[\s\-\(\)\.\]\[]/g, '' );
    	var oRePhone = /^\+*\d{7,15}(\+\d{2,4})?$/;
    	return oRePhone.test(sPhone);
    },
    isEmail: function(sEmail){
    	var sEmail = sEmail.replace( new RegExp('/\(.*?\)/'), '' );
    	var oRegExp = /^[A-Za-z0-9][-\w]*(\.[A-Za-z0-9][-\w]*)*@[A-Za-z0-9][-\w]*(\.[A-Za-z0-9][-\w]*)*\.[a-zA-Z]{2,4}$/;
    	return oRegExp.test(sEmail);
    }
});

function num_format(num, no_fraction)
{
    var ret, x, y, fraction = num - Math.floor(num);
    fraction = no_fraction ? '' : fraction ? '.' + Math.round(fraction*100) : '.00'
    num = Math.floor(num);
    y = num % 1000;
    x = Math.floor(num / 1000);
    ret = num;
    if (x > 0) {
        ret = 0 == y ? '000' : (y < 10 ? '00' + y : (y < 100 ? '0' + y : y));
         while (x >= 1000) {
            y = x % 1000;
            x = Math.floor(x / 1000);
            ret = (0 == y ? '000' : (y < 10 ? '00' + y : (y < 100 ? '0' + y : y))) + ' ' + ret;
        }
        ret = x + ' ' + ret;
    }
    return ret + fraction;
}