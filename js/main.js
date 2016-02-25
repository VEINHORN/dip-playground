"use strict";

var canvas = document.getElementById("viewport");
var inpHistogramCanvas = document.getElementById("input_histogram");
var outHistogramCanvas = document.getElementById("output_histogram");

var image_path = "images/lenna.png";
//var image_path = "images/water.jpg";

window.onload = function() {
  var imgElm = document.getElementById("input-image");
  imgElm.src = image_path;

  loadImage();
  // create downloading images on server and than setup to canvas
  var loadBtn = document.getElementById("load-btn");
  /*loadBtn.onclick = function() {
    var urlInput = document.getElementById("url-input");
    var url = urlInput.value;
    var imgElm = document.getElementById("input-image");
    imgElm.src = url;

    canvas.width = imgElm.width;
    canvas.height = imgElm.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(imgElm, 0, 0, canvas.width, canvas.height);
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    drawHistogram(imageData, inpHistogramCanvas);
    drawHistogram(imageData, outHistogramCanvas);
  }*/
  loadBtn.onclick = function() {
    var ctx = canvas.getContext("2d");
    var histoCtx = outHistogramCanvas.getContext("2d");

    histoCtx.clearRect(0, 0, outHistogramCanvas.width, outHistogramCanvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    loadImage();
  }

  var grayBtn = document.getElementById("gray-btn");
  grayBtn.onclick = function() {
    var ctx = canvas.getContext("2d");
    var histoCtx = outHistogramCanvas.getContext("2d");
    histoCtx.clearRect(0, 0, outHistogramCanvas.width, outHistogramCanvas.height);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var image = new Image();
    image.src = image_path;

    image.onload = function() {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      grayscale(ctx, imageData);
      imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      drawHistogram(imageData, outHistogramCanvas);
      console.log("grayscale");
    }
  }

  $("#linear-correction-slider").ionRangeSlider({
    type: "double",
    grid: true,
    min: 0,
    max: 255,
    from: 150,
    to: 200,
    onChange: function(data) {
      var ctx = canvas.getContext("2d");
      var outHistCtx = outHistogramCanvas.getContext("2d"); // context of output histogram
      var image = new Image();
      image.src = image_path;

      image.onload = function() {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        linearCorrection(ctx, imageData, data.from, data.to);

        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        outHistCtx.clearRect(0, 0, outHistogramCanvas.width, outHistogramCanvas.height)
        drawHistogram(imageData, outHistogramCanvas);
      }
      //console.log(data);
    }
  });

  $("#gamma-correction-slider").ionRangeSlider({
    grid: true,
    from: 0.01,
    to: 7.99,
    step: 0.05,
    min: 0.01,
    max: 7.99,
    onChange: function(data) {
      var ctx = canvas.getContext("2d");
      var outHistCtx = outHistogramCanvas.getContext("2d"); // context of output histogram
      var image = new Image();
      image.src = image_path;

      image.onload = function() {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        gammaCorrection(ctx, imageData, data.from);

        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        outHistCtx.clearRect(0, 0, outHistogramCanvas.width, outHistogramCanvas.height)
        drawHistogram(imageData, outHistogramCanvas);
      }
      //console.log(data);
    }
  });

  $("#logarithm-correction-slider").ionRangeSlider({
    grid: true,
    from: 0.01,
    to: 100,
    step: 0.2,
    min: 0.01,
    max: 100,
    onChange: function(data) {
      var ctx = canvas.getContext("2d");
      var outHistCtx = outHistogramCanvas.getContext("2d"); // context of output histogram
      var image = new Image();
      image.src = image_path;

      image.onload = function() {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        logarithmCorrection(ctx, imageData, data.from);

        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        outHistCtx.clearRect(0, 0, outHistogramCanvas.width, outHistogramCanvas.height)
        drawHistogram(imageData, outHistogramCanvas);
      }
      //console.log(data);
    }
  });

  $("#binary-correction-slider").ionRangeSlider({
    grid: true,
    from: 128,
    step: 1,
    min: 0,
    max: 255,
    onChange: function(data) {
      var ctx = canvas.getContext("2d");
      var outHistCtx = outHistogramCanvas.getContext("2d"); // context of output histogram
      var image = new Image();
      image.src = image_path;

      image.onload = function() {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        threshold(ctx, imageData, data.from);

        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        outHistCtx.clearRect(0, 0, outHistogramCanvas.width, outHistogramCanvas.height)
        drawHistogram(imageData, outHistogramCanvas);
      }
      //console.log(data);
    }
  });
}

function loadImage() {
  var ctx = canvas.getContext("2d");

  var image = new Image();
  image.src = image_path;

  image.onload = function() {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    drawHistogram(imageData, inpHistogramCanvas);

    //linearCorrection(ctx, imageData, 180, 255);

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

function threshold(ctx, imageData, thresholdVal) {
  for(var i = 0; i < imageData.height; i++) {
    for(var j = 0; j < imageData.width; j++) {
      var pixel = getPixel(imageData, j, i);
      var gray = 0.299 * pixel.red + 0.587 * pixel.green + 0.114 * pixel.blue;
      if(gray <= thresholdVal) {
        pixel.red = pixel.green = pixel.blue = 0;
      } else {
        pixel.red = pixel.green = pixel.blue = 255;
      }
      setPixel(imageData, j, i, pixel);
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function grayscale(ctx, imageData) {
  for(var i = 0; i < imageData.height; i++) {
    for(var j = 0; j < imageData.width; j++) {
      var pixel = getPixel(imageData, j, i);
      var gray = 0.299 * pixel.red + 0.587 * pixel.green + 0.114 * pixel.blue;
      pixel.red = pixel.green = pixel.blue = gray;
      setPixel(imageData, j, i, pixel);
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function logarithmCorrection(ctx, imageData, c) {
  for(var i = 0; i < imageData.height; i++) {
    for(var j = 0; j < imageData.width; j++) {
      var pixel = getPixel(imageData, j, i);
      pixel.red = logarithmTransformation(pixel.red, c);
      pixel.green = logarithmTransformation(pixel.green, c);
      pixel.blue = logarithmTransformation(pixel.blue, c);
      setPixel(imageData, j, i, pixel);
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function logarithmTransformation(value, c) {
  return c * Math.log(1 + value);
}

function gammaCorrection(ctx, imageData, gamma) {
  for(var i = 0; i < imageData.height; i++) {
    for(var j = 0; j < imageData.width; j++) {
      var pixel = getPixel(imageData, j, i);
      pixel.red = gammaTransformation(pixel.red, gamma);
      pixel.green = gammaTransformation(pixel.green, gamma);
      pixel.blue = gammaTransformation(pixel.blue, gamma);
      setPixel(imageData, j, i, pixel);
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function gammaTransformation(value, gamma) {
  var correction = 1 / gamma; // from dark to light
  return 255 * Math.pow(value / 255, correction);
}

function linearCorrection(ctx, imageData, min, max) {
  for(var i = 0; i < imageData.height; i++) {
    for(var j = 0; j < imageData.width; j++) {
      var pixel = getPixel(imageData, j, i);
      pixel.red = linearTransformation(pixel.red, min, max);
      pixel.green = linearTransformation(pixel.green, min, max);
      pixel.blue = linearTransformation(pixel.blue, min, max);
      setPixel(imageData, j, i, pixel);
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function linearTransformation(value, min, max) {
  return (value - min) * ((255 - 0) / (max - min));
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
