var map = L.map('map').setView([-40, 146], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var coordList = [];
var polygon;
var polyline;
var isClickEnabled = false;



var handleDrawClickListener = document.addEventListener("click", function () {
    if (isClickEnabled) {
        enabledBtns();
        if (clickedBtn != undefined) {
            map.on("click", handleDraw);
        }
    }

    else {
        disableBtns();
        map.off("click", handleDraw);
    }
})



var editButton = document.getElementById("btn-draw");
editButton.addEventListener("click", function () {
    isClickEnabled = !isClickEnabled;
    editButton.innerHTML = isClickEnabled ? "Stop" : "Edit";
})

const leftPanel = document.getElementById('left-panel');

document.getElementById("btn-toggle").addEventListener("click",
    function () {
        var btns = document.getElementsByClassName("leftpanel-btn");

        if (leftPanel.style.width === '6%') {
            leftPanel.style.width = '300px';
            leftPanel.style.height = '250px';

            for (var i = 0; i < btns.length; i++) {
                btns[i].style.display = 'block';
            }
        } else {
            leftPanel.style.width = '6%';
            leftPanel.style.height = '6%';
            for (var i = 0; i < btns.length; i++) {
                btns[i].style.display = 'none';
            }
        }

    });
function togglePanel() {
    leftPanel.classList.toggle('hidden');
}
var btns = document.getElementsByClassName("editpanel-btn");
disableBtns();

function disableBtns() {
    for (var i = 0; i < btns.length; i++) {
        btns[i].style.display = 'none';
    }
}

function enabledBtns() {
    for (var i = 0; i < btns.length; i++) {
        btns[i].style.display = 'block';
    }
}

var clickedBtn;

var polygonBtn = document.getElementById("editpanel-Polygon");
polygonBtn.addEventListener('click', function () {
    clearMap();
    clickedBtn = polygonBtn;
});

var polylineBtn = document.getElementById("editpanel-Polyline");
document.getElementById("editpanel-Polyline").addEventListener('click', function () {
    clearMap();
    clickedBtn = polylineBtn;
});

var pointBtn = document.getElementById("editpanel-Point");
document.getElementById("editpanel-Point").addEventListener('click', function () {
    clearMap();
    clickedBtn = pointBtn;
});

var popupBtn = document.getElementById("editpanel-Popup");
document.getElementById("editpanel-Popup").addEventListener('click', function () {
    clearMap();
    clickedBtn = popupBtn;

});

function clearMap() {
    coordList = [];

    map.off("click", handleDraw);

}

activeBtn = document.getElementById("")
var resetButton = document.getElementById("btn-reset");
resetButton.addEventListener('click', function () {
    // Çizimleri sıfırlamak için tüm katmanları temizle
    map.eachLayer(function (layer) {
        if (layer instanceof L.Polygon || layer instanceof L.Polyline || layer instanceof L.Point || layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // Koordinatları ve poligonu sıfırla
    coordList = [];
    polygon = undefined;
    editButton.innerHTML = "Edit";
    isClickEnabled = false;
    clickedBtn = undefined;

});

var marker;
function handleDraw(e) {
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;
    var latLngArray = [lat, lng];

    //marker = new L.marker([lat, lng]).addTo(map);
    //marker.bindPopup(latLngArray + ' ' + "Noktasına Tıkladınız").openPopup();
    coordList.push(latLngArray);

    if (clickedBtn != undefined) {
        switch (clickedBtn) {
            case polygonBtn:
                CreatePolygon();
                break;
            case polylineBtn:
                CreatePolyline();
                break;
            case pointBtn:
                var marker = L.marker(latLngArray).addTo(map);
                break;
            case popupBtn:
                var url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        var popupContent = data.display_name;

                        var popup = L.popup()
                            .setContent(popupContent)
                            .setLatLng(latLngArray)
                            .openPopup().addTo(map);
                    })
                    .catch(error => {
                        console.error(error);
                    })



                break;
        }

    }
}

function CreatePolygon() {
    if (coordList.length > 2) {
        if (typeof polygon !== 'undefined') {
            map.removeLayer(polygon);
        }
        polygon = L.polygon(coordList, { color: 'red' }).addTo(map);
    }
}

function CreatePolyline() {
    if (coordList.length > 1) {
        if (typeof polyline !== 'undefined') {
            map.removeLayer(polyline);
        }
        polyline = L.polyline(coordList, { color: 'red' }).addTo(map);
    }
}

function DeleteMarker() {
    marker.remove();
}

function AddMarker() {

}

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
    onGetFeatureInfo(lat, lng);
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
            displayAttrTable(data);
            if (Properties != null) {
                var Data = {
                    Male: Properties.MALE,
                    Female: Properties.FEMALE,
                }
                PostData(Data);
                console.log(data);

            }
        },
        error: function (error) {
            console.log("Ajax Error", error);
        }
    });
}

function displayAttrTable(data){
    var form = $('#attrForm');
    form.show();

    var table = $('#attrTable');
    table.empty();

    for (var i = 0; data.length; i++) {
        var rowData = data[i];
        var rowHtml = '<tr>' +
            '<th scope="row">' + rowData.Id + '</th>' +
            '<td>' + rowData.MALE + '</td>' +
            '<td>' + rowData.FEMALE + '</td>' +
            '</tr>';
        table.append(rowHtml);

    }



}

function PostData(data) {
    $.post("https://localhost:44334/Home/Index", data);
}


//function sendDataToController(data) {
//    $.ajax({
//        url: '/Home/Properties',
//        type: 'POST',
//        contentType: 'application/json',
//        data: JSON.stringify(data),
//        error: function (error) {
//            console.log("C#",error);
//        }
//        })
//}

$(function () {
    $('#btnAsena').click(function () {
        $('#attrForm').hide();
    })
})
$(function () {
    $("#attrForm").draggable();
   
})
$(function () {
    $("#attrForm").resizable();
})