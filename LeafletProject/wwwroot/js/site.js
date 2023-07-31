var map = L.map('map', {
    zoomControl: false
}).setView([-40, 146], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


var isClickEnabled = false;


var geoJsonContent;
document.getElementById("btn-opengeojson").addEventListener('change', function (e) {
    var selectedFile = e.target.files[0];
    if (!selectedFile) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
        geoJsonContent = JSON.parse(e.target.result);

        L.geoJSON(geoJsonContent, {
            style: function (feature) {
                return { color: feature.properties.color || 'blue' };
            }
        }).bindPopup(function (layer) {
            return layer.feature.properties.description;
        }).addTo(map);
    };
    reader.readAsText(selectedFile);
});

var layerPanel = document.getElementById("layer-panel");
var layersButton = document.getElementById("btn-layers").addEventListener("click", function () {
    layerPanel.classList.toggle('hidden');
})

//LAYER LIST
var cbIl = document.getElementById("cbIl");
var cbIlce = document.getElementById("cbIlce");
var cbKoy = document.getElementById("cbKoy");
var cbMah = document.getElementById("cbMah");
var cbUs = document.getElementById("cbUs");

document.addEventListener("DOMContentLoaded", function () {
    checkCBstatus();
});

var checkBtns = document.getElementsByClassName("form-check");
for (var i = 0; i < checkBtns.length; i++) {
    checkBtns[i].addEventListener('change', function () {
        checkCBstatus();
        i = checkBtns.length;
    });
}

var CityBorder = undefined;
var CountyBorder = undefined
var VillageBorder = undefined;
var NBBorder = undefined;
var USBorder = undefined;

var layerMapping = {};


var CityLayerName;
var CountyLayerName;
var VillageLayerName;
var NBLayerName;
var USLayerName;

function checkCBstatus() {

    if (cbIl.checked) {
        CityLayerName = topp + 'tasmania_state_boundaries';
        if (layerMapping[CityLayerName] == null) {
            CityBorder = getMap(CityLayerName);
            layerMapping[CityLayerName] = CityBorder;
        }
    }
    else {
        delete layerMapping[CityLayerName];
        removFromMap(CityBorder)
    }
    if (cbIlce.checked) {
        CountyLayerName = topp + 'tasmania_water_bodies';

        if (layerMapping[CountyLayerName] == null) {
            CountyBorder = getMap(CountyLayerName);
            layerMapping[CountyLayerName] = CountyBorder;
        }
    }
    else {
        delete layerMapping[CountyLayerName];
        removFromMap(CountyBorder)
    }
    if (cbKoy.checked) {
        VillageLayerName = topp + 'tasmania_roads';

        if (layerMapping[VillageLayerName] == null) {
            VillageBorder = getMap(VillageLayerName);
            layerMapping[VillageLayerName] = VillageBorder;
        }
    }
    else {
        delete layerMapping[VillageLayerName];
        removFromMap(VillageBorder)
    }
    if (cbMah.checked) {
        NBLayerName = topp + 'tasmania_cities';

        if (layerMapping[NBLayerName] == null) {
            NBBorder = getMap(NBLayerName);
            layerMapping[NBLayerName] = NBBorder;
        }
    }
    else {
        delete layerMapping[NBLayerName];
        removFromMap(NBBorder)
    }
    if (cbUs.checked) {
        USLayerName = topp + 'states';

        if (layerMapping[USLayerName] == null) {
            USBorder = getMap(USLayerName);
            layerMapping[USLayerName] = USBorder;
        }
    }
    else {
        delete layerMapping[USLayerName];
        removFromMap(USBorder)
    }
}
var topp = 'topp:';
var baseLayer = undefined;

function getMap(BaseLayerName) {

    baseLayer = L.tileLayer.wms('http://localhost:8080/geoserver/topp/wms', {
        layers: BaseLayerName,
        format: 'image/png',
        transparent: true
    }).addTo(map);
    return baseLayer;
}

function removFromMap(border) {
    if (border != null && border != undefined) {
        map.removeLayer(border);
    }
}

$(function () {
    $('#left-panel').draggable({
        /*containment: "parent"*/
    });
})

function sendDateToGeoServer(data) {
    fetch('')
}

map.on("click", function (e) {
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;
    //onGetFeatureInfo(lat, lng);
});

var Properties;
function onGetFeatureInfo(lat, lng) {
    var url = 'http://localhost:8080/geoserver/topp/wms';
    var params = {
        service: 'WMS',
        version: '1.1.1',
        request: 'GetFeatureInfo',
        layers: 'topp:states',
        query_layers: 'topp:states',
        info_format: 'application/json',
        srs: 'EPSG:4326',
        bbox: map.getBounds().toBBoxString(),
        height: map.getSize().y,
        width: map.getSize().x,
        x: Math.floor(map.latLngToContainerPoint([lat, lng]).x),
        y: Math.floor(map.latLngToContainerPoint([lat, lng]).y)
    };
    $.ajax({
        url: url + L.Util.getParamString(params),
        dataType: 'json',
        success: function (data) {
            for (var i = 0; i < data.features.length; i++) {
                var feature = data.features[i];
                Properties = feature.properties;

            }
            if (Properties != null) {
                var USData = {
                    MALE: Properties.MALE,
                    FEMALE: Properties.FEMALE,
                }

                $.ajax({
                    type: "POST",
                    url: "/Home/Properties",
                    data: JSON.stringify( USData),
                    contentType: "application/json",
                    success: function (data) {
                        var form = $('#attrForm');
                        form.html(data);
                        form.show();

                    },
                    error: function () {
                        alert("Veri çekme işlemi sırasında bir hata oluştu.");
                    }
                });
            }
        },
        error: function (error) {
            console.log("Ajax Error", error);
        }
    });
}
$("#layerList-Toggler").on("click", function (e) {
    e.preventDefault();
    $('#rigtpanel-Layerlist').slideToggle("slow");
})
$('#user').on('click', function () {
    $('#userDropdown').toggle();
})

var Message = $('#Message');

//CREATE POLYGON
var DrawGeometryType;
var CoordList = [];
var polygon = undefined;
$('#drawPolygon').on('click', function () {
    map.on('click', function (e) {
        DrawGeometryType = 'Polygon';
        Message.html(DrawGeometryType +' '+ "Çizimi");
        Message.show();
        var lat = e.latlng.lat;
        var lng = e.latlng.lng
        var latLng = [lat, lng];
        CoordList.push(latLng);
        if (polygon != undefined)
            polygon.remove();

        if (CoordList.length > 2) {
            polygon = L.polygon(CoordList);
            polygon.addTo(map);
        }
    })
})
var polyline = undefined;
$('#drawPolyline').on('click', function () {
    map.on('click', function (e) {
        DrawGeometryType = 'Polyline';
        Message.html(DrawGeometryType + ' ' + "Çizimi");
        Message.show();
        var lat = e.latlng.lat;
        var lng = e.latlng.lng
        var latLng = [lat, lng];
        CoordList.push(latLng);
        if (polyline != undefined)
            polyline.remove();
        if (CoordList.length > 1) {
            polyline = L.polyline(CoordList);
            polyline.addTo(map);
        }
    })
})

var drawButtons = $('.drawItems button');
drawButtons.on('click', function () {
    MessageReset();
    
})
function MessageReset() {
    if (polygon != undefined) {
        polygon = undefined;
    }
    if (polyline != undefined)
        polyline = undefined;
    DrawGeometryType = '';
    Message.html("");
    Message.hide();
    CoordList = [];
}
if (document.addEventListener) {
    document.addEventListener('contextmenu', function (e) {
        var ResultArray = CoordList;
        if (ResultArray.length > 1) {
            ResultArray.push(CoordList[0]);
            if (DrawGeometryType == 'Polygon') {
                ResultArray = [ResultArray];

                var polygon = turf.polygon(ResultArray);
                var area = turf.area(polygon);
                console.log(area.toFixed(2));
            }
            else if (DrawGeometryType == 'Polyline') {
                var line= turf.lineString(ResultArray);
                var options = { units: 'kilometers' };
                var length = turf.length(line, options);
                console.log(length.toFixed(2));
            }
        }
        MessageReset();
        map.off('click');
        e.preventDefault();
    }, false);
} else {
    document.attachEvent('oncontextmenu', function () {
        MessageReset();
        map.off('click');
        window.event.returnValue = false;
    });
}
