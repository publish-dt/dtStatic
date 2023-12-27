var map = {
	zoom: 2,
	branch: 'img/branch-43x32.png',
	member: 'img/member-20x32.png',
	institut: 'img/institut-29x32.png',
	marker_icon: 'img/man.gif',
	ajax: '/mapfilial/ajax/',
	canvas: 'map',
	center: {lat: 20, lng: 10},
	map: null,
	infowindow: null,
	marker: null,
	markers: []
};

function showreg(){
	load_points('points-region');

	$('#points-list').click(function(event) {
		event = event || window.event;
		var elem = event.target || event.srcElement;
		if (elem.className != 'points-list-item')
			return;
		var i = elem.getAttribute('data-page');
		if(i!=null) document.location.href = i;
		//alert(i);
	});	

    if ($('#points-list').css('display') == 'none') 
    { 
        $('#points-list').animate({height: 'show'}, 500); 
    } 
    else 
    {     
        $('#points-list').animate({height: 'hide'}, 500); 
    } 	
}

function load_points(branch) {
	$(function() {
		$.getJSON(map.ajax, {f: branch}, function(data) {
			if (!data)
				return;
			var h = '';
			for (var i = 0, j = data.length; i < j; i++) {
				//create_marker(data[i]);
				//h += '<div class="points-list-item" data-i="' + i + '">' + html_encode(data[i].title) + '</div>';
				//h += '<div class="points-list-item" data-i="' + i + '"><a href="' + html_encode(data[i].page) + '">' + html_encode(data[i].title) + '</a></div>';
				h += '<div class="points-list-item" data-page="' + html_encode(data[i].page) + '">' + html_encode(data[i].title) + '</div>';
				if ((i+1)<j && data[i].group!=data[i+1].group) h += '<div>&nbsp;</div>';
			}
			$('#points-list-content').html(h);
		});
	});
}

function html_encode(s) {
	s = s || '';
	s = s.toString();
	s = s.replace(/&/g, '&amp;');	// must do &amp; first
	s = s.replace(/"/g, '&quot;');
	s = s.replace(/'/g, '&#039;');
	s = s.replace(/</g, '&lt;');
	s = s.replace(/>/g, '&gt;');
	return s;
}