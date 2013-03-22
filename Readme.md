
# histogram

  JavaScript histogram component for arbitrary data.

  ![large histogram](http://cdn.dropmark.com/41933/c8fda5acfa0f3b72c8f37b7ad13fb2e6e4e47d2e/big.png)

  ![medium histogram](http://cdn.dropmark.com/41933/48aed33dbe309fd3ab1196d883b3ca7d4d5c48a9/medium.png)

## Installation

    $ component install visionmedia/histogram

## API

### Histogram()

  Initialize a new histogram.

### Histogram.add(data:Array, options:Object)

  Add `data` set with `options`:

   - `color` bar color

### Histogram.size(w:Number, h:Number)

  Set size to `w` / `h`.

### Histogram.bins(n:Number)

  Set the total number of bins to `n`.

### Histogram.render()

  Render the histogram and return a canvas.

## License

  MIT
