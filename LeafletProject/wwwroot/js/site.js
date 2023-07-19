﻿var map = L.map('map').setView([51.505, -0.09], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var coordList = [];
var polygon;
var isClickEnabled = false;

var editButton = document.getElementById("btn-draw");
editButton.addEventListener("click", function () {
    isClickEnabled = !isClickEnabled;
    editButton.innerHTML = isClickEnabled ? "Stop" : "Edit";
})

var handleDrawClickListener = document.addEventListener("click", function () {
    if (isClickEnabled)
        map.on("click", handleDrawClcik);
    else
        map.off("click", handleDrawClcik);
})
document.getElementById("btn-toggle").addEventListener("click",
    function () {
        const leftPanel = document.getElementById('left-panel');
        const map = document.getElementById('map');

        if (leftPanel.style.width === '7%') {
            leftPanel.style.width = '10%';
            map.style.width = '90%';
        } else {
            leftPanel.style.width = '7%';
            map.style.width = '93%';
        }
    });
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


});

var marker;
function handleDrawClcik(e) {
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;
    var latLngArray = [lat, lng];

    marker = new L.marker([lat, lng]).addTo(map);
    marker.bindPopup(latLngArray + ' ' + "Noktasına Tıkladınız").openPopup();
    coordList.push(latLngArray);

    CreatePolygon();
}
function CreatePolygon() {
    if (coordList.length > 2) {
        if (typeof polygon !== 'undefined') {
            map.removeLayer(polygon);
        }
        polygon = L.polygon(coordList, { color: 'red' }).addTo(map);
    }
}

function DeleteMarker() {
    marker.remove();
}

function AddMarker() {

}

var geoJsonContent;
var geojsonButton = document.getElementById("btn-opengeojson");
geojsonButton.addEventListener('click', );

function geojsonReader (event) {
    var selectedFile = event.target.files[0];
    if (!selectedFile) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
        geoJsonContent = e.target.result;
    }
    reader.readAsText(selectedFile);

}
