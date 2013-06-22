
/**
 * Module dependencies.
 */

var svg = require('svg');
var min = require('min');
var max = require('max');
var bin = require('bin');

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
  this.barWidth = 1.5;
  this.el = document.createElement('div');
  this.el.className = 'histogram';
  this.svg = svg(this.el);
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
  this.el.style.width = w + 'px';
  this.el.style.height = h + 'px';
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
 * Return the smallest value in the datasets.
 *
 * @return {Number}
 * @api private
 */

Histogram.prototype.min = function(){
  return min(this.datasets, function(set){
    return min(set.data);
  });
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

Histogram.prototype.distribute = function(min, max){
  for (var i = 0; i < this.datasets.length; i++) {
    var o = this.datasets[i];
    o.data = bin(o.data, this.maxBins, {
      min: min,
      max: max
    });
  }
};

/**
 * Render the histogram and return a canvas.
 *
 * @return {Canvas}
 * @api public
 */

Histogram.prototype.render = function(){
  var self = this;
  var svg = this.svg;
  var w = this.width;
  var h = this.height;
  var maxBins = this.maxBins;
  var sets = this.datasets;

  // bin
  var min = this.min();
  var max = this.max();
  this.distribute(min, max);

  // render
  var sx = (w / maxBins | 0) + 1;
  var n = 0;
  var x = 0;

  while (x < w) {
    // ticks
    svg('rect')
      .size(this.barWidth, h)
      .move(x)
      .attr('class', 'tick')
      .attr('fill', this.barColor)
      .attr('opacity', .8)

    // bins
    sets.forEach(function(set){
      var val = set.data[n];
      var bh = h * (val / max);

      if (!bh) return;

      svg('rect')
        .size(self.barWidth, bh)
        .move(x, h - bh)
        .attr('class', 'bar')
        .attr('fill', set.options.color);
    });

    x += sx;
    ++n;
  }

  return this.el;
};
