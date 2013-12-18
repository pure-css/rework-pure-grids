var rework = require('rework');
var fs = require('fs');
var pureGrids = require('../../');
var gridCss = rework('').use(pureGrids.units(12))
                        .use(pureGrids.mediaQueries([
                            {
                                minWidth: '480px',
                                gridName: 't'
                            },
                            {
                                minWidth: '980px',
                                gridName: 'd'
                            },
                            {
                                minWidth: '1200px',
                                gridName: 'l'
                            }
                        ])).toString();

fs.writeFile("grid.css", gridCss, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("grid.css was saved!");
    }
});
