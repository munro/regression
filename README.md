# Regression—Linear regression using least squares [![Build Status](https://secure.travis-ci.org/munro/regression.png?branch=master)](http://travis-ci.org/munro/regression)

![B = X.transpose.multiply(X).inverse().multiply(X.transpose()).multiply(Y)](http://upload.wikimedia.org/wikipedia/en/math/a/6/5/a65c30d3cc0831f3634a84e1a7e2d894.png)

Linear regression is a great tool for estimating values based on linear data (dyuh!)  Coupled with statistics, it can be used for predicting required resources based on future demand of cloud services, or consolidating existing demand.

Checkout Wikipedia for more information about [linear regression](http://en.wikipedia.org/wiki/Linear_regression) and [least squares](http://en.wikipedia.org/wiki/Least_squares).

## Downloads

This library depends on [Sylvester](http://sylvester.jcoglan.com/), another library used for matrix math.

Tested to work against Internet Explorer 9+, Safari 5.0.5+, Google Chrome 5+, and Firefox 4+!

[Development Version (0.1.0)](https://raw.github.com/munro/regression/master/regression.js) — 8.0 KiB, uncompressed with comments.

[Production Version (0.1.0)](https://raw.github.com/munro/regression/master/regression.min.js) — 803 bytes, minified and gzipped.

## API

### Module

#### `regression(optional {Object options}) → {Regression inst}`

The regression module may be called with an optional set of options:

* `samples` — Default 25, older values will be popped off as new ones are pushed in past this limit.
* `enough` — Default 3, threshold used to determine if there is enough data to calculate a linear regression.

**Example**

    var regression = require('regression');
    var sample = regression({samples: 100, enough: 10});

### Regression instance

#### `sample.update({Number y}, {Object data}) → {Regression self}`

Push a sample of data into the data set.  The data must have the same keys every time, otherwise the behavior is undefined.

**Example**

   setInterval(function () {
        sample.update(process.memoryUsage().heapUsed, {
            active: Application.getActivePlayers(),
            idle: Application.getIdlePlayers()
        });
    }, 1000);

#### `sample.coef(optional {String key}) → {Number coef}`

Calculate the coefficient of a key.  This will return `false` if there is not enough data.

**Example**

    console.log('application overhead', sample.coef());
    console.log('active player memory usage', sample.coef('active'));
    console.log('idle player memory usage', sample.coef('idle'));

#### `sample.calc({Object data}) → {Number y}`

Calculate the predicted value of the passed data based on the linear regression from the previously collected data.  This will return `false` if there is not enough data.

**Example**

    console.log(
        'estimate memory usage for 1337 active players & 999 idle',
        sample.calc({active: 1337, idle: 999})
    );

#### `sample.count() → {Number samples}`

Return the number of samples in the data set.

#### `sample.enough() → {Boolean enough}`

Test if there is enough data to calculate linear regression.

#### `sample.empty() → {Regression self}`

Remove all the data.

## License

(The MIT License)

Copyright (C) 2012 Ryan Munro <munro.github@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.