/*
 Copyright (c) 2013, Yahoo! Inc. All rights reserved.
 Copyrights licensed under the New BSD License.
 See the accompanying LICENSE file for terms.
 */

'use strict';

var pureGridUnits = require('./units'),
    utils         = require('./utils');

module.exports = pureGridMediaQueries;

// -----------------------------------------------------------------------------

function pureGridMediaQueries(units, queries, options) {
    return function (style) {
        options = utils.extend({selectorPrefix: '.pure-u-'}, options);

        Object.keys(queries).forEach(function (name) {
            var media = {
                type : 'media',
                media: queries[name],
                rules: []
            };

            var mediaOptions = utils.extend({}, options, {
                selectorPrefix: options.selectorPrefix + name + '-'
            });

            pureGridUnits(units, mediaOptions)(media);
            style.rules.push(media);
        });
    };
}
