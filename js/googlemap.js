var gMap,
gMainMapLat = 55.354135,
gMapLat = 55.354135,
gMainMapLng = 40.297852,
gMapLng = 40.297852,
gMainMapZoom = 4,
gMapZoom = 4,
gOffice = false,
gOfficeList = [],
gShowCloudEvent = 'click';

$(function() {
    var map_el = document.getElementById("map_canvas");
    if (map_el) {
        var center = new google.maps.LatLng(gMainMapLat || gMapLat, gMainMapLng || gMapLng);
        var options = {
            zoom: gMainMapZoom || gMapZoom,
            center: center,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        var map = new google.maps.Map(map_el, options);
        
        if (gOffice) {
            options = {
                position: new google.maps.LatLng(gOffice.lat, gOffice.lng),
                map: map,
                visible: true,
                title: gOffice.title
            };
            if (gOffice.ptype_icon_path) {
                options.icon = new google.maps.MarkerImage(
                    gOffice.ptype_icon_path,
                    new google.maps.Size(35, 50), // The display size of the sprite or image. When using sprites, you must specify the sprite size. If the size is not provided, it will be set when the image loads
                    new google.maps.Point(0, 0), // The position of the image within a sprite, if any.
                    new google.maps.Point(12, 50) // The position at which to anchor an image in correspondance to the location of the marker on the map. By default, the anchor is located along the center point of the bottom of the image.
                );
            }
            new google.maps.Marker(options);
        } else if (gOfficeList) {
            var win = false;
            for(var i in gOfficeList) {            
                if (gOfficeList[i].prod_lat && gOfficeList[i].prod_lng) {
                    options = {
                        position: new google.maps.LatLng(gOfficeList[i].prod_lat, gOfficeList[i].prod_lng),
                        map: map,
                        title: gOfficeList[i].prod_title,
                        visible: true
                    };
                    if (gOfficeList[i].ptype_icon_path) {
                        options.icon = new google.maps.MarkerImage(
                            gOfficeList[i].ptype_icon_path,
                            new google.maps.Size(35, 50), // The display size of the sprite or image. When using sprites, you must specify the sprite size. If the size is not provided, it will be set when the image loads
                            new google.maps.Point(0, 0), // The position of the image within a sprite, if any.
                            new google.maps.Point(12, 50) // The position at which to anchor an image in correspondance to the location of the marker on the map. By default, the anchor is located along the center point of the bottom of the image.
                        );
                    }
                    gOfficeList[i].mark = new google.maps.Marker(options);
                    gOfficeList[i].mark.ofice = gOfficeList[i];
                    gOfficeList[i].mark.win = new google.maps.InfoWindow({
                        content: getInfoWinContent(gOfficeList[i])
                    });
                    if ('click' == gShowCloudEvent) {
                        google.maps.event.addListener(gOfficeList[i].mark, 'click', function() {
                            this.win.open(map, this);
                        });
                    } else {
                        google.maps.event.addListener(gOfficeList[i].mark, 'mouseover', function() {
                            if (win) {
                                win.close();                                
                            }
                            win = new google.maps.InfoWindow({
                                content: getInfoWinContent(this.ofice)
                            });
                            win.open(map, this);
                        });
                    }
                }
        }
        }
    }    
})

function showOfficeList()
{
    var item;
    for (var i in gOfficeList) {
        if (!$('#chbxArea'+gOfficeList[i].ptype_id).attr('checked') && gOfficeList[i].mark.getVisible()) gOfficeList[i].mark.setVisible(false);
        if ( $('#chbxArea'+gOfficeList[i].ptype_id).attr('checked') && !gOfficeList[i].mark.getVisible()) gOfficeList[i].mark.setVisible(true);
    }
}

function getInfoWinContent(ofice)
{
    return '<div><b>' + ofice.prod_title + '</b><br>'
        + (ofice.prod_addr ? '<p class="gmap-addr"><strong>адрес:</strong> ' + ofice.prod_addr + '</p>': '')
        + (ofice.prod_phone ? '<p class="gmap-phone"><strong>телефон:</strong> ' + ofice.prod_phone + '</p>' : '')
        + (ofice.prod_open ? '<p class="gmap-time"><strong>время работы:</strong> ' + ofice.prod_open + '</p>' : '')
        + '<p style="margin: 5px 0 0;"><a href="' + ofice.prod_link + '">подробнее</a></p>'
        +'</div>'
}