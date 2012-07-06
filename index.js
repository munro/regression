/*jslint nomen: true */

var regression = (function (S) {
    'use strict';

    function Regression(opts) {
        this.max_samples = (opts && opts.samples) || 25;
        this.min_samples = (opts && opts.enough) || 3;
        this.data = []; // used to store sampled data
        this.y = []; // used to store y samples
        this._dirty = false; // used to determine if we need to recalculate our data
        this._map = false; // map keys to array index
        this._keys = 0; // number of keys in each data set
        this._result = false; // result of calculation
    }

    Regression.prototype = {
        /**
         * Maps each key in a sample set to array index.  The order of keys in an
         * object can't be trusted!
         * @param {Object} data Sample of data
         * @return {Object} Keys mapped to indices
         */
        _mapKeys: function (data) {
            if (this._map) {
                return this._map;
            }
            var key, map = this._map = {};
            this._keys = 0;
            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    map[key] = (this._keys += 1);    
                }
            }
            return map;
        },
        /**
         * Calculate regression if the data is dirty!
         * @return {Boolean} There was enough data to calculate
         */
        _calc: function () {
            if (!this._dirty) {
                return this.enough() && this._result !== false;
            }
            this._dirty = false;
            if (!this.enough()) {
                return false;
            }
            var m = S.Matrix.create(this.data),
                mt = m.transpose(),
                y = S.Matrix.create(this.y);

            var inv = mt.multiply(m).inverse();

            console.error('first', m);
            //console.error('second', m.multiply(m.transpose()));


            
            if (inv !== null) {
                this._result = inv.multiply(mt)
                                  .multiply(y);
                return true;
            }

            inv = m.multiply(mt).inverse();


            if (inv !== null) {
                this._result = mt.multiply(inv)
                                 .multiply(y);
                return true;
            }

            this._result = false;
            return false;
        },
        update: function (y, data) {
            var key,
                map = this._mapKeys(data),
                row = new Array(this._keys + 1);
            row[0] = 1; // @todo explain this, sir! 
            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    row[map[key]] = data[key];
                }
            }
            this.data.push(row);
            this.y.push(y);
            this._dirty = true;
            return this;
        },
        coef: function (key) {
            if (!this._calc()) {
                return false;
            }
            if (typeof key === 'undefined') {
                return this._result.elements[0][0];
            }
            return this._result.elements[this._map[key]][0];
        },
        calc: function (data) {
            if (!this._calc()) {
                return false;
            }
            var key, val = this.coef();
            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    val += this.coef(key) * data[key];
                }
            }
            return val;
        },
        count: function () {
            return this.data.length;
        },
        enough: function () {
            return this.data.length >= this.min_samples;
        },
        empty: function () {
            this.data = [];
            this.y = [];
            this._dirty = false;
            this._map = false;
            this._keys = 0;
            return this;
        }
    };

    return function (opts) {
        return new Regression(opts);
    };
}(require('sylvester')));

module.exports = regression;