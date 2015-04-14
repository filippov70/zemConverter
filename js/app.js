//The MIT License (MIT)
//
//Copyright (c) 2015 Владислав Филиппов
//
//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:
//
//The above copyright notice and this permission notice shall be included in all
//copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//SOFTWARE.


function convert() {
    $("#data");
//    wkt = 'POLYGON((10.689697265625 -25.0927734375, 34.595947265625 ' +
//    '-20.1708984375, 38.814697265625 -35.6396484375, 13.502197265625 ' +
//    '-39.1552734375, 10.689697265625 -25.0927734375))';
    var inputdata = $("#data").val();
    var contours = inputdata.split('\n\n');
    var wkt = '';
    var geometryType = $("#gt").val();
    var contoursCoords = [];

    for (var i = 0; i < contours.length; i++) {
        var cntwkt = '(';
        var contour = contours[i];
        var cntdata = contour.split('\n');
        for (var j = 0; j < cntdata.length; j++) {
            var coords = cntdata[j].split(' ');
            var x = parseFloat(coords[0].replace(',', '.'));
            var y = parseFloat(coords[1].replace(',', '.'));
            var wktc = x + ' ' + y;
            if (j !== cntdata.length - 1) {
                wktc += ', ';
            }
            cntwkt += wktc;
            //console.log(replace);
        }
        cntwkt += ')';
        contoursCoords.push(cntwkt);
    }

    if (geometryType === 'POLYGON') {
        wkt = 'POLYGON(';
        for (var i = 0; i < contoursCoords.length; i++) {
            wkt += contoursCoords[i];
            if (i !== contoursCoords.length - 1) {
                wkt += ',';
            }
        }
        wkt += ')';
    }
    else {
        wkt = 'MULTIPOLYGON((';
        for (var i = 0; i < contoursCoords.length; i++) {
            wkt += contoursCoords[i];
            if (i !== contoursCoords.length - 1) {
                wkt += '), (';
            }
        }
        wkt += '))';
    }

    $("#data").val(wkt);

    mapit(wkt);
}

function mapit(wkt) {
    console.log(wkt);
    var format = new ol.format.WKT();
    var feature = format.readFeature(wkt);
    //feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');

    var styles = [
        /* We are using two different styles for the polygons:
         *  - The first style is for the polygons themselves.
         *  - The second style is to draw the vertices of the polygons.
         *    In a custom `geometry` function the vertices of a polygon are
         *    returned as `MultiPoint` geometry, which will be used to render
         *    the style.
         */
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'blue',
                width: 3
            }),
            fill: new ol.style.Fill({
                color: 'rgba(0, 0, 255, 0.1)'
            })
        })
//        ,
//        new ol.style.Style({
//            image: new ol.style.Circle({
//                radius: 5,
//                fill: new ol.style.Fill({
//                    color: 'orange'
//                })
//            }),
//            geometry: function (feature) {
//                // return the coordinates of the first ring of the polygon
//                var coordinates = feature.getGeometry().getCoordinates()[0];
//                return new ol.geom.MultiPoint(coordinates);
//            }
 //       })
    ];

    var vector = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [feature]
        })
        , style: styles
    });

    var map = new ol.Map({
        layers: [vector],
        target: 'map',
        view: new ol.View({
            center: [0, 0],
            zoom: 15
        })
    });
    map.getView().fitExtent(vector.getSource().getExtent(), map.getSize());
}