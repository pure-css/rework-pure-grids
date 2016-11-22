Rework Pure Grids
=================

Generate custom units for [Pure][] Grids via [Rework][].


[Pure]: http://purecss.io/
[Rework]: https://github.com/visionmedia/rework


Usage
-----

Install Rework and this Rework plugin from npm:

```shell
$ npm i rework rework-pure-grids
```

Create custom media queries for Pure's defaut Grids unit sizes:

```js
var rework    = require('rework'),
    pureGrids = require('rework-pure-grids');

var css = rework('').use(pureGrids.units({
    mediaQueries: {
        sm : 'screen and (min-width: 35.5em)',
        md : 'screen and (min-width: 48em)',
        lg : 'screen and (min-width: 64em)',
        xl : 'screen and (min-width: 80em)'
    }
})).toString();
```

Or create a customized set unit sizes for Pure Grids:

```js
var rework    = require('rework'),
    pureGrids = require('rework-pure-grids');

// Creates a 12ths-based Grid.
var css = rework('').use(pureGrids.units(12, {
    mediaQueries: {
        sm : 'screen and (min-width: 35.5em)',
        md : 'screen and (min-width: 48em)',
        lg : 'screen and (min-width: 64em)',
        xl : 'screen and (min-width: 80em)'
    }
})).toString();
```

The new classnames can be added to HTML elements whenever their width should
change at the break-points specified in the `mediaQueries` option above.

```html
<div class="pure-g">
    <div id="main" class="pure-u-1 pure-u-med-3-4 pure-u-xlrg-2-3">
        <h1>Main Content</h1>
    </div>

    <div id="side" class="pure-u-1 pure-u-med-1-4 pure-u-xlrg-1-3">
        <h1>Side Content</h1>
    </div>
</div>
```


License
-------

This software is free to use under the Yahoo! Inc. BSD license.
See the [LICENSE file][] for license text and copyright information.


[LICENSE file]: https://github.com/yahoo/rework-pure-grids/blob/master/LICENSE
