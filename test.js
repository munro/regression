/*jslint vars: true */

'use strict';

var regression = require('./'),
    test = require('tap').test;

/**
 * We're going to lose some precision when sampling lots of data, so just
 * test if the value is close enough!
 * @param {Test t} Tap test
 * @param {Number a}
 * @param {Number b}
 * @param {String str} String to assert
 */
function closeEnoughDammit(t, a, b, str) {
    if (typeof a !== 'number') {
        t.type(a, 'number', 'is number ' + (str || ''));
    } else {
        t.equal(Math.round(a * 100000), Math.round(b * 100000), str);
    }
}

function isEmpty(t, sample) {
    t.equal(sample.count(), 0, 'enough');
    t.equal(sample.enough(), false, 'enough');
    t.equal(sample.coef(), false, 'coef');
    t.equal(sample.coef('active'), false, 'active coef');
    t.equal(sample.coef('idle'), false, 'idle coef');
    t.equal(sample.calc({active: 1337, idle: 999}), false);
}

test('single coef', function (t) {
    var i, sample = regression();
    var a = 20.0001, b = 2, c = 0.5;

    isEmpty(t, sample);

    t.equal(sample.update(a + 5 * b + 10 * c, {
        active: 5,
        idle: 10
    }), sample);

    for (i = 0; i < 999; i += 1) {
        var active = i * 2 + 50,
            idle = i * 3 + 51;

        sample.update(a + active * b + idle * c, {
            active: active,
            idle: idle
        });
    }

    closeEnoughDammit(t, sample.coef(), a, 'coef');
    closeEnoughDammit(t, sample.coef('active'), b, 'active coef');
    closeEnoughDammit(t, sample.coef('idle'), c, 'idle coef');
    closeEnoughDammit(
        t,
        sample.calc({active: 1337, idle: 999}),
        a + 1337 * b + 999 * c
    );
    t.equal(sample.count(), 1000, 'sample count');
    t.equal(sample.enough(), true, 'enough data');

    t.equal(sample.empty(), sample);

    isEmpty(t, sample);

    t.end();
});

test('double coef', function (t) {
    var i, sample = regression();
    var a1 = 20.0001, b1 = 2, c1 = 0.5,
        a2 = 22.5, b2 = 1.5, c2 = 8.8,
        a = (a1 + a2) / 2, b = (b1 + b2) / 2, c = (c1 + c2) / 2;

    isEmpty(t, sample);


    for (i = 0; i < 10; i += 1) {
        var active = i * 2 + 50,
            idle = i * 3 + 51;

        sample.update(a1 + active * b1 + idle * c1, {
            active: active,
            idle: idle
        });

        sample.update(a2 + active * b2 + idle * c2, {
            active: active,
            idle: idle
        });
    }

    console.error('COEF', sample.coef());
    closeEnoughDammit(t, sample.coef(), a1, 'coef');
    closeEnoughDammit(t, sample.coef('active'), b1, 'active coef');
    closeEnoughDammit(t, sample.coef('idle'), c1, 'idle coef');
    // closeEnoughDammit(
    //     t,
    //     sample.calc({active: 1337, idle: 999}),
    //     a + 1337 * b + 999 * c
    // );
    // t.equal(sample.count(), 1000, 'sample count');
    // t.equal(sample.enough(), true, 'enough data');

    t.equal(sample.empty(), sample);

    isEmpty(t, sample);

    t.end();
});
