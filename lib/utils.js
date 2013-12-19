/*
 Copyright (c) 2013, Yahoo! Inc. All rights reserved.
 Copyrights licensed under the New BSD License.
 See the accompanying LICENSE file for terms.
 */

'use strict';

exports.extend             = extend;
exports.getReducedFraction = getReducedFraction;

// -----------------------------------------------------------------------------

function extend(obj) {
    Array.prototype.slice.call(arguments, 1).forEach(function (source) {
        if (!source) { return; }

        Object.keys(source).forEach(function (name) {
            obj[name] = source[name];
        });
    });

    return obj;
}

function getGCD(a, b) {
    return b ? getGCD(b, a % b) : a;
}

function getReducedFraction(numerator, denominator) {
    var gcd = getGCD(numerator, denominator);
    return [numerator / gcd, denominator / gcd];
}
