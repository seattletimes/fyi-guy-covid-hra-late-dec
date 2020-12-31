//load our custom elements
require("component-leaflet-map");
require("component-responsive-frame");

//get access to Leaflet and the map
var element = document.querySelector("leaflet-map");
var L = element.leaflet;
var map = element.map;


var ich = require("icanhaz");
var templateFile = require("./_popup.html");
ich.addTemplate("popup", templateFile);

const data = require("./lateDecThree.geo.json");

const mapElement = document.querySelector("leaflet-map");

  var zoomLevel = (document.getElementById("map").offsetWidth > 500) ? 10 : 9;

  var L = mapElement.leaflet;
  var map = mapElement.map;

  map.scrollWheelZoom.disable();

  map.setView(new L.LatLng(47.5, -122.2), zoomLevel);

  var focused = false;

  orangeArray = ['#FAE2C1', '#F4BD6E', '#ED8A52', '#E34D32', '#B22118', "#500601"];
  orangeBlueArray = ['#316384', '#bfe0f5', "gray", '#F4BD6E', '#ED8A52', '#E34D32', '#B22118'];

  var arrayLegend = {
    decTwo_point_change_array: [-2.5, -0.09, 0.09, 2.5, 5.0, 7.5],
    decTwo_Per_pos_clean_array: [10,15,20,25, 30],
    pos_change: "decTwo_point_change",
    tests_pos: "decTwo_Per_pos_clean"
  };

  var commafy = s => (s * 1).toLocaleString().replace(/\.0+$/, "");

  data.features.forEach(function(f) {
    // ["Aug10_Pos_test_per_july27_aug10", "Aug10_Pos_test_per_july13_july27"].forEach(function(prop) {
    //   f.properties[prop] = (f.properties[prop] * 100).toFixed(1);
    // });
    ["decTwo_Positives", "decTwo_Tested", "decTwo_Hospitalizations"].forEach(function(prop) {
      f.properties[prop] = commafy ((f.properties[prop]));
    });
  });


  var onEachFeature = function(feature, layer) {
    layer.bindPopup(ich.popup(feature.properties))
    layer.on({
      mouseover: function(e) {
        layer.setStyle({ weight: 2, fillOpacity: 1 });
      },
      mouseout: function(e) {
        if (focused && focused == layer) { return }
        layer.setStyle({ weight: 1, fillOpacity: 0.7 });
      }
    });
  };


  const colorBlocks = document.querySelectorAll('.color');
  const lastBlocks = document.querySelectorAll('.lastBlock');
  var pos_neg = document.querySelectorAll('.decrease, .increase');




  var getColor = function(d, array) {
    var value = d;
    var thisArray = arrayLegend[array];
    let chosenColorArray = (array === "decTwo_Per_pos_clean_array") ? orangeArray : orangeBlueArray;

    array === "decTwo_Per_pos_clean_array" ? lastBlocks.forEach(el => el.style.display = 'none') : lastBlocks.forEach(el => el.style.display = 'block');
    array === "decTwo_Per_pos_clean_array" ? pos_neg.forEach(el => el.classList.add('hide')) : pos_neg.forEach(el => el.classList.remove('hide'));


    for (let h = 0; h < colorBlocks.length; h++) {
        colorBlocks[h].style.backgroundColor = chosenColorArray[h];
    }

    if (typeof value == "string") {
      value = Number(value.replace(/,/, ""));
    }
    if (typeof value != "undefined") {
      return value >= thisArray[5] ? chosenColorArray[6] :
             value >= thisArray[4] ? chosenColorArray[5] :
             value >= thisArray[3] ? chosenColorArray[4] :
      		   value >= thisArray[2] ? chosenColorArray[3] :
             value >= thisArray[1] ? chosenColorArray[2] :
             value >= thisArray[0]  ? chosenColorArray[1] :
             chosenColorArray[0] ;
    } else {
      return "gray"
    }
  };


  var geojson = L.geoJson(data, {
    onEachFeature: onEachFeature
  }).addTo(map);



  function restyleLayer(propertyName) {

    geojson.eachLayer(function(featureInstanceLayer) {
        var propertyValue = featureInstanceLayer.feature.properties[propertyName];
        var colorArray = propertyName + "_array";

        // Your function that determines a fill color for a particular
        // property name and value.
        var myFillColor = getColor(propertyValue, colorArray);

        featureInstanceLayer.setStyle({
            fillColor: myFillColor,
            opacity: .25,
            color: '#000',
            fillOpacity: 0.7,
            weight: 1
        });
    });
}

restyleLayer(arrayLegend.tests_pos);

const startSel = document.getElementById("tests_pos");
startSel.classList.add("active");



var onEachFeature = function(feature, layer) {
  layer.bindPopup(ich.popup(feature.properties))
};

 map.scrollWheelZoom.disable();



 var filterMarkers = function(clickedID) {
   hideSpans();
   var chosenSpans = legendContainer.getElementsByClassName(clickedID);
   showSpans(chosenSpans);

   for (var i = 0; i < filterButtons.length; i++) {
     filterButtons[i].classList.remove("active");
   }
   var selectedID = document.getElementById(clickedID);
   selectedID.classList.add("active");
   var myID = arrayLegend[clickedID];

   restyleLayer(myID);
 }


 var filterButtons = document.getElementsByClassName("button");
 var legendContainer = document.getElementById("legendCon");
 var allSpans = legendContainer.getElementsByTagName('span');
 var lastColor = document.getElementById("last");

 var hideSpans = function() {
   for (var i = 0; i < allSpans.length; i++) {
     allSpans[i].classList.add("hide");
   }
 };

 var showSpans = function(spanClass) {
   for (var i = 0; i < spanClass.length; i++) {
     spanClass[i].classList.remove("hide");
   }
 };


hideSpans();
var tests_posSpans = legendContainer.getElementsByClassName('tests_pos');
showSpans(tests_posSpans);


 for (var i = 0; i < filterButtons.length; i++) {
    let thisID = filterButtons[i].getAttribute("id");
    filterButtons[i].addEventListener('click', () => filterMarkers(thisID), false);
}
