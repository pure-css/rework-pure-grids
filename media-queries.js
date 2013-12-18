var units = require('./').units;

var MEDIA_QUERY_DECLARATIONS = [];
/*
    input is an array of objects.
    [{
        minWidth:
        maxWidth:
        gridName:
    },
    ...
    ]
*/
function generateMediaQueries(mq) {
    mq.forEach(function (val, i, arr) {
        var newMedia = {
            type: 'media',
            media: '',
            rules: []
        };
        if (val.minWidth) {
            newMedia.media += '(min-width: ' + val.minWidth + ')';
        }
        if (!val.minWidth && val.maxWidth) {
            newMedia.media += '(max-width: ' + val.maxWidth + ')';
        }
        if (val.minWidth && val.maxWidth) {
            newMedia.media += ' and (max-width: ' + val.maxWidth + ')';
        }
        if (val.gridName) {
            units(12, {gridName: val.gridName})(newMedia);
        }
        MEDIA_QUERY_DECLARATIONS.push(newMedia);
    });

    return function (style) {
        MEDIA_QUERY_DECLARATIONS.forEach(function (val, i) {
            style.rules.push(val);
        });
    };
}

module.exports = generateMediaQueries;
