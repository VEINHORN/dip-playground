"use strict";

var canvas = document.getElementById("viewport");
var inpHistogramCanvas = document.getElementById("input_histogram");
var outHistogramCanvas = document.getElementById("output_histogram");

window.onload = function() {
  loadImage();
}

function loadImage() {
  var ctx = canvas.getContext("2d");

  var image = new Image();
  image.src = 'images/lenna.png';

  image.onload = function() {
    ctx.drawImage(image, 0, 0);

    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    drawHistogram(imageData, inpHistogramCanvas);

    linearCorrection(ctx, imageData);

    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    drawHistogram(imageData, outHistogramCanvas);
  }
}

function drawHistogram(imageData, canv) {
  var ctx = canv.getContext("2d");

  var histogram = createHistogram(imageData);
  var max = findMax(histogram);

  var normalizedHistogram = normalizeHistogram(histogram, canv.height, max);
  for(var i = 0; i < normalizedHistogram.length; i++) {
    drawLine(ctx, canv.height, i, normalizedHistogram[i]);
  }
}

function createHistogram(imageData, w, h) {
  var data = imageData.data;
  var histogram = [];
  for(var i = 0; i < 256; i++) histogram[i] = 0; // init histogram
  for(var i = 0; i < imageData.height; i++) {
    for(var j = 0; j < imageData.width; j++) {
      var pixel = getPixel(imageData, j, i);
      histogram[Math.round(0.299 * pixel.red + 0.587 * pixel.green + 0.114 * pixel.blue)]++;
    }
  }
  return histogram;
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

function linearCorrection(ctx, imageData) {
  var data = imageData.data;
  for(var i = 0; i < imageData.height; i++) {
    for(var j = 0; j < imageData.width; j++) {
      var pixel = getPixel(imageData, j, i);
      pixel.red += 50;
      pixel.green += 50;
      pixel.blue += 50;
      setPixel(imageData, j, i, pixel);
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

// data - is an array of int (r,g,b,a,...etc) ImageData.data by the way
function setPixel(imageData, x, y, pixel) {
  var i = getPixelPos(imageData, x, y);
  var data = imageData.data;
  data[i] = pixel.red;
  data[i + 1] = pixel.green;
  data[i + 2] = pixel.blue;
  data[i + 3] = pixel.alpha;
}

function getPixel(imageData, x, y) {
  var i = getPixelPos(imageData, x, y);
  var data = imageData.data;
  return new Pixel(data[i], data[i + 1], data[i + 2], data[i + 3]);
}

function getPixelPos(imageData, x, y) {
  return 4 * (imageData.height * y + x);
}

class Pixel {
  constructor(r, g, b, a) {
    this.red = r;
    this.green = g;
    this.blue = b;
    this.alpha = a;
  }
}
