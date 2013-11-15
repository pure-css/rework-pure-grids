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
var UNIT_DECLARATIONS  = [
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

function getUnitSelector(numerator, denominator) {
    if (denominator === 1) {
        return '.pure-u-1';
    }

    return '.pure-u-' + numerator + '-' + denominator;
}

function pureGridUnits(numUnits, options) {
    options || (options = {});

    // Include `*width` values for IE < 8 by default.
    var includeOldIEWidths = 'includeOldIEWidths' in options ?
            !!options.includeOldIEWidths : true;

    // Include reduced fractions by default; e.g., 2/4 and 1/2.
    var includeReducedFractions = 'includeReducedFractions' in options ?
            !!options.includeReducedFractions : true;

    function toPercentage(num) {
        num *= 100;
        return num.toFixed(num % 1 === 0 ? 0 : options.decimals || 4) + '%';
    }

    return function (style) {
        var unitRules     = [],
            unitSelectors = [],
            current       = 1,
            selectors, declarations, width, reduced;

        while (current <= numUnits) {
            selectors = [getUnitSelector(current, numUnits)];
            width     = current / numUnits;

            declarations = [{
                type    : 'declaration',
                property: 'width',
                value   : toPercentage(width)
            }];

            if (includeReducedFractions) {
                reduced = getReduced(current, numUnits);

                // Makes sure the faction has been reduced before adding another
                // selector for the current grid unit.
                if (reduced[0] !== current && reduced[1] !== numUnits) {
                    selectors.push(getUnitSelector(reduced[0], reduced[1]));
                }
            }

            if (includeOldIEWidths && width < 1) {
                // Updates the width value for the `*width` property to ensure
                // IE < 8's rounding issues don't break the grid.
                width += OLD_IE_WIDTH_DELTA;

                declarations.push({
                    type    : 'declaration',
                    property: '*width',
                    value   : toPercentage(width)
                });
            }

            // Stores rule for the current grid unit's `width` declarations
            // which will be later added to the CSS.
            unitRules.push({
                type        : 'rule',
                selectors   : selectors,
                declarations: declarations
            });

            // Stores selectors for the current grid unit which later will all
            // be combined with the `.pure-u` declarations and added to the CSS.
            unitSelectors.push.apply(unitSelectors, selectors);

            // Update numerator and process the next grid unit.
            current += 1;
        }

        // Adds rule that applies the `.pure-u` declarations to all of the grid
        // unit that were created in the process above.
        style.rules.push({
            type        : 'rule',
            selectors   : unitSelectors,
            declarations: UNIT_DECLARATIONS
        });

        // Adds all of the grid unit `width` rules to the CSS.
        style.rules.push.apply(style.rules, unitRules);
    };
}

// -- Utilities ----------------------------------------------------------------

function getGCD(a, b) {
    return b ? getGCD(b, a % b) : a;
}

function getReduced(numerator, denominator) {
    var gcd = getGCD(numerator, denominator);
    return [numerator / gcd, denominator / gcd];
}
