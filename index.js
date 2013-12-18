/*
 Copyright (c) 2013, Yahoo! Inc. All rights reserved.
 Copyrights licensed under the New BSD License.
 See the accompanying LICENSE file for terms.
 */

'use strict';
var utilities = require('./utilities');

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
    var selector = '.pure-u-' + numerator;

    if (denominator) {
        selector += '-' + denominator;
    }

    return selector;
}
//TODO: selector.match(/(\d+)(?:-(\d+))?$/)
function getSelectorFraction(selector) {
    var re1='.*?';  // Non-greedy match on filler
    var re2='(\\d+)'; // Integer Number 1
    var re3='.*?';    // Non-greedy match on filler
    var captures = selector.match(re1+re2+re3,["i"]);
    var remaining = selector.replace(captures[0], '').replace('-', '');

    return [
        parseInt(captures[1], 10),
        parseInt(captures[2], 10) || 0
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

    // Apply defaults to any non-specified `options`.
    options = utilities.extend({
        decimals: 4,
        gridName: 'u',
        includeOldIEWidths     : true,
        includeReducedFractions: true,
        includeWholeNumbers    : true
    }, options);

    function toPercentage(num) {
        num *= 100;
        return num.toFixed(num % 1 === 0 ? 0 : options.decimals) + '%';
    }

    return function (style) {
        var rules     = {},
            selectors = {};

        function generateUnitRules(numUnits) {
            var numerator = 1,
                rule, width, reduced;

            function includeSelector(selector) {
                selectors[selector]      = true;
                rule.selectors[selector] = true;
            }

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
                includeSelector(getSelector(numerator, numUnits));

                // Adds an additional selector for the reduced fraction if there
                // is one and the `includeReducedFractions` option is truthy.
                if (options.includeReducedFractions) {
                    reduced = utilities.getReduced(numerator, numUnits);

                    // Makes sure the faction has been reduced before adding
                    // another selector for the current grid unit.
                    if (reduced[0] !== numerator && reduced[1] !== numUnits) {
                        // Create and store the selectors, in de-dupped format.
                        includeSelector(getSelector(reduced[0], reduced[1]));

                        // Adds an additional, denominator-less selector for
                        // fractions whose denominator is `1`.
                        if (options.includeWholeNumbers && reduced[1] === 1) {
                            includeSelector(getSelector(reduced[0]));
                        }
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


exports.units = pureGridUnits;
exports.mediaQueries = require('./media-queries');
