
/**
 * Module dependencies.
 */

var autoscale = require('autoscale-canvas')
  , max = require('max')
  , bin = require('bin');

/**
 * Expose `Histogram`.
 */

module.exports = Histogram;

/**
 * Initialize a new histogram.
 *
 * @api public
 */

function Histogram() {
  this.datasets = [];
  this.bins(10);
  this.barColor = '#555555';
  this.barWidth = 3;
}

/**
 * Add `data` set with `options`.
 *
 * Options:
 *
 *  - `color` bar color
 *
 * @param {Array} data
 * @param {Object} options
 * @return {Histogram} self
 * @api public
 */

Histogram.prototype.add = function(data, options){
  this.datasets.push({
    data: data,
    options: options || {}
  });
  return this;
};

/**
 * Set size to `w` / `h`.
 *
 * @param {Number} w
 * @param {Number} h
 * @return {Histogram} self
 * @api public
 */

Histogram.prototype.size = function(w, h){
  this.width = w;
  this.height = h;
  return this;
};

/**
 * Set the total number of bins to `n`.
 *
 * @param {Number} n
 * @return {Histogram} self
 * @api public
 */

Histogram.prototype.bins = function(n){
  this.maxBins = n;
  return this;
};

/**
 * Return the largest value in the datasets.
 *
 * @return {Number}
 * @api private
 */

Histogram.prototype.max = function(){
  return max(this.datasets, function(set){
    return max(set.data);
  });
};

/**
 * Distribute the data into bins.
 *
 * @api private
 */

Histogram.prototype.distribute = function(){
  for (var i = 0; i < this.datasets.length; i++) {
    var o = this.datasets[i];
    o.data = bin(o.data, this.maxBins);
  }
};

/**
 * Draw bar.
 *
 * @param {Context2d} ctx
 * @param {String} color
 * @param {Number} h
 * @api private
 */

Histogram.prototype.drawBar = function(ctx, color, h){
  var y = this.height - h;
  ctx.fillStyle = color;
  ctx.globalAlpha = .5;
  ctx.fillRect(0, y, this.barWidth * .25, h);
  ctx.globalAlpha = 1;
  ctx.fillRect(1, y, this.barWidth * .50, h);
  ctx.globalAlpha = .5;
  ctx.fillRect(2, y, this.barWidth * .25, h);
};

/**
 * Render the histogram and return a canvas.
 *
 * @return {Canvas}
 * @api public
 */

Histogram.prototype.render = function(){
  var self = this;
  var w = this.width;
  var h = this.height;
  var maxBins = this.maxBins;
  var sets = this.datasets;
  this.distribute();
  var max = this.max();

  // canvas
  var canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  autoscale(canvas);

  // render
  var ctx = canvas.getContext('2d');
  var sx = w / maxBins | 0;

  var n = 0;
  var x = 0;
  while (x < w) {
    ctx.save();
    ctx.translate(x, 0);
    this.drawBar(ctx, this.barColor, h);
    sets.forEach(function(set){
      var val = set.data[n];
      var bh = h * (val / max);
      self.drawBar(ctx, set.options.color, bh);
    });
    ctx.restore();
    x += sx;
    ++n;
  }

  return canvas;
};
