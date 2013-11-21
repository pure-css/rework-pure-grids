/*
 Copyright (c) 2013, Yahoo! Inc. All rights reserved.
 Copyrights licensed under the New BSD License.
 See the accompanying LICENSE file for terms.
 */

'use strict';

exports.units = pureGridUnits;

// -----------------------------------------------------------------------------

// IE < 8 has issues with rounding, reducing the width slightly prevents the
// grid units from wrapping to the next line.
var OLD_IE_WIDTH_DELTA = -0.00031;

// AST of declarations of Pure's `.pure-u` styles that get applied to all of the
// generated grid units.
var PURE_GRID_UNIT_DECLARATIONS  = [
    {
        type    : 'declaration',
        property: 'display',
        value   : 'inline-block'
    },

    {
        type    : 'declaration',
        property: '*display',
        value   : 'inline'
    },

    {
        type    : 'declaration',
        property: 'zoom',
        value   : '1'
    },

    {
        type    : 'declaration',
        property: 'letter-spacing',
        value   : 'normal'
    },

    {
        type    : 'declaration',
        property: 'word-spacing',
        value   : 'normal'
    },

    {
        type    : 'declaration',
        property: 'vertical-align',
        value   : 'top'
    },

    {
        type    : 'declaration',
        property: 'text-rendering',
        value   : 'auto'
    }
];

function getSelector(numerator, denominator) {
    if (denominator === 1) {
        return '.pure-u-1';
    }

    return '.pure-u-' + numerator + '-' + denominator;
}

function getSelectorFraction(selector) {
    var captures = selector.match(/^\.pure-u-(\d+)(?:-(\d+))?$/);

    return [
        parseInt(captures[1], 10),
        parseInt(captures[2], 10) || 1
    ];
}

function compareSelectors(a, b) {
    var aFrac = getSelectorFraction(a),
        bFrac = getSelectorFraction(b);

    // Sort by denominator first.
    if (aFrac[1] < bFrac[1]) { return -1; }
    if (aFrac[1] > bFrac[1]) { return 1; }

    // When the denominators are the same, sort by the numerator.
    if (aFrac[0] < bFrac[0]) { return -1; }
    if (aFrac[0] > bFrac[0]) { return 1; }

    return 0;
}

function pureGridUnits(units, options) {
    Array.isArray(units) || (units = [units]);

    options = extend({
        includeOldIEWidths     : true,
        includeReducedFractions: true
    }, options);

    function toPercentage(num) {
        num *= 100;
        return num.toFixed(num % 1 === 0 ? 0 : options.decimals || 4) + '%';
    }

    return function (style) {
        var rules     = {},
            selectors = {};

        function generateUnitRules(numUnits) {
            var numerator = 1,
                rule, selector, width, reduced;

            while (numerator <= numUnits) {
                width = numerator / numUnits;
                rule  = rules[width];

                if (!rule) {
                    // The rule's `selectors` are stored as an object for
                    // de-dupping.
                    rule = rules[width] = {
                        type        : 'rule',
                        selectors   : {},

                        declarations: [{
                            type    : 'declaration',
                            property: 'width',
                            value   : toPercentage(width)
                        }]
                    };

                    // Adds an additonal `*width` declaration for IE < 8 if the
                    // numerator unit < 100% width and the `includeOldIEWidths`
                    // option is truthy.
                    if (options.includeOldIEWidths && width < 1) {
                        // Updates the width value for the `*width` property to
                        // ensure IE < 8's rounding issues don't break the grid.
                        width += OLD_IE_WIDTH_DELTA;

                        rule.declarations.push({
                            type    : 'declaration',
                            property: '*width',
                            value   : toPercentage(width)
                        });
                    }
                }

                // Create and store the selectors, in de-dupped format.
                selector = getSelector(numerator, numUnits);
                rule.selectors[selector] = selectors[selector] = true;

                // Adds an additional selector for the reduced fraction if there
                // is one and the `includeReducedFractions` option is truthy.
                if (options.includeReducedFractions) {
                    reduced = getReduced(numerator, numUnits);

                    // Makes sure the faction has been reduced before adding
                    // another selector for the current grid unit.
                    if (reduced[0] !== numerator && reduced[1] !== numUnits) {
                        // Create and store the selectors, in de-dupped format.
                        selector = getSelector(reduced[0], reduced[1]);
                        rule.selectors[selector] = selectors[selector] = true;
                    }
                }

                // Update numerator and process the next grid unit.
                numerator += 1;
            }
        }

        // Takes the array of `units` and creates unique declarations and
        // selectors for each set.
        units.forEach(generateUnitRules);

        // Adds rule that applies the `.pure-u` declarations to all of the grid
        // unit that were created in the process above. The de-dupped selectors
        // are first sorted.
        style.rules.push({
            type        : 'rule',
            selectors   : Object.keys(selectors).sort(compareSelectors),
            declarations: PURE_GRID_UNIT_DECLARATIONS
        });

        // Adds all of the grid unit `width` rules to the CSS, and sorts each
        // rule's selectors before adding them to `style`.
        Object.keys(rules).sort().forEach(function (width) {
            var rule = rules[width];

            rule.selectors = Object.keys(rule.selectors).sort(compareSelectors);
            style.rules.push(rule);
        });
    };
}

// -- Utilities ----------------------------------------------------------------

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

function getReduced(numerator, denominator) {
    var gcd = getGCD(numerator, denominator);
    return [numerator / gcd, denominator / gcd];
}
