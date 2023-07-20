var map = L.map('map').setView([51.505, -0.09], 5);

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
function disableBtns(btn){
    
}

document.getElementById("editpanel-Polygon").addEventListener('click',function () {

});
document.getElementById("editpanel-Polyline").addEventListener('click', function () {

});
document.getElementById("editpanel-Point").addEventListener('click', function () {

});
document.getElementById("editpanel-Popup").addEventListener('click', function () {

});
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