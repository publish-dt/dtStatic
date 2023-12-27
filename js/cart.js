
function addGoodsToCart(form) {
    var req = new JsHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            if (req.responseJS) {
                var e = document.getElementById("blckCart");
                if (e) {
                    document.getElementById("blckCart").innerHTML = "<a href=\"/shop/\">Ваша корзина</a><br>[&nbsp;всего товаров: "
                    +req.responseJS.total+" | на сумму: "+req.responseJS.cost+"&nbsp;"
                    +req.responseJS.currency+"&nbsp;]<br>";
                    alert('Товар добавлен в Вашу корзину');
                    bl.style.display = 'none';
                }
            }
        }
    };
    req.open("POST", form.action, true);
    req.send( form );
    var bl = document.getElementById("blckLoading");
    if (! bl) {
        bl = document.createElement('div');
        bl.id = 'blckLoading';
        bl.appendChild(document.createTextNode('Загрузка ...'));
        document.body.appendChild(bl);
    }
    bl.style.display = 'block';
    return false;
}