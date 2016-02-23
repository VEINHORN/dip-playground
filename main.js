"use strict";

var canvas = document.getElementById("viewport");
var inpHistogramCanvas = document.getElementById("input_histogram");
var outHistogramCanvas = document.getElementById("output_histogram");

var width = canvas.width;
var height = canvas.height;

var context = canvas.getContext("2d");

window.onload = function() {
  loadImage();
}

function loadImage() {
  var image = new Image();
  image.src = 'images/lenna.png';

  image.onload = function() {
    context.drawImage(image, 0, 0);

    var imageData = context.getImageData(0, 0, width, height);
    var data = imageData.data;

    drawHistogram(data, inpHistogramCanvas);

    linearCorrection(imageData);

    var data = context.getImageData(0, 0, width, height).data;
    drawHistogram(data, outHistogramCanvas);
  }
}

function drawHistogram(imageData, canv) {
  var ctx = canv.getContext("2d");

  var histogram = createHistogram(imageData, width, height);
  var max = findMax(histogram);

  var normalizedHistogram = normalizeHistogram(histogram, canv.height, max);
  for(var i = 0; i < normalizedHistogram.length; i++) {
    drawLine(ctx, canv.height, i, normalizedHistogram[i]);
  }
}

// index is one of 255 columns
function drawLine(ctx, height, index, value) {
  ctx.beginPath();
  ctx.moveTo(index, height);
  ctx.lineTo(index, height - value);
  ctx.stroke();
}

function normalizeHistogram(histogram, height, max) {
  var normalized = [];
  for(var i = 0; i < histogram.length; i++) {
    normalized[i] = Math.round(height * (histogram[i] / max));
  }
  return normalized;
}

function findMax(array) {
  var max = 0;
  for(var i = 0; i < array.length; i++) {
    if(max < array[i]) max = array[i];
  }
  return max;
}

function linearCorrection(imageData) {
  var data = imageData.data;
  for(var i = 0; i < height; i++) {
    for(var j = 0; j < width; j++) {
      var pixel = getPixel(data, j, i);
      pixel.red = 0;
      pixel.green = 0;
      //pixel.blue = 0;
      setPixel(data, j, i, pixel);
    }
  }
  context.putImageData(imageData, 0, 0);
}

function createHistogram(data, w, h) {
  var histogram = [];
  for(var i = 0; i < 256; i++) histogram[i] = 0; // init histogram
  for(var i = 0; i < h; i++) {
    for(var j = 0; j < w; j++) {
      var pixel = getPixel(data, j, i);
      histogram[Math.round(0.299 * pixel.red + 0.587 * pixel.green + 0.114 * pixel.blue)]++;
    }
  }
  return histogram;
}

// data - is an array of int (r,g,b,a,...etc) ImageData.data by the way
function setPixel(data, x, y, pixel) {
  var i = getPixelPos(x, y);
  data[i] = pixel.red;
  data[i + 1] = pixel.green;
  data[i + 2] = pixel.blue;
  data[i + 3] = pixel.alpha;
}

function getPixel(data, x, y) {
  var i = getPixelPos(x, y);
  return new Pixel(data[i], data[i + 1], data[i + 2], data[i + 3]);
}

function getPixelPos(x, y) {
  return 4 * (height * y + x);
}

class Pixel {
  constructor(r, g, b, a) {
    this.red = r;
    this.green = g;
    this.blue = b;
    this.alpha = a;
  }
}
