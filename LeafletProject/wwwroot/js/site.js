var map = L.map('map').setView([51.505, -0.09], 5);

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
        map.off("click", handlePolygon);
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
        if (layer instanceof L.Polygon || layer instanceof L.Marker) {
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

    marker = new L.marker([lat, lng]).addTo(map);
    marker.bindPopup(latLngArray + ' ' + "Noktasına Tıkladınız").openPopup();
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
                var popup = L.popup()
                    .setLatLng(latLngArray)
                    .openPopup();


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
    if (coordList.length > 2) {
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