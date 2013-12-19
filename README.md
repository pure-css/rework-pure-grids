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

Create a customized set units for Pure Grids:

```js
var rework    = require('rework'),
    pureGrids = require('rework-pure-grids');

var css = rework('')
        .use(pureGrids.units(12))
        .use(pureGrids.mediaQueries(12, {
            small: 'screen and (min-width: 0em)',
            med  : 'screen and (min-width: 48em)',
            large: 'screen and (min-width: 60em)'
        }))
        .toString();
```

Now use the new selectors in HTML:

```html
<div class="pure-g">
    <div id="main" class="pure-u-small-1 pure-u-med-3-4 pure-u-large-1-2">
        <h1>Main Content</h1>
    </div>

    <div id="side" class="pure-u-small-1 pure-u-med-1-4 pure-u-large-1-2">
        <h1>Main Content</h1>
    </div>
</div>
```


License
-------

This software is free to use under the Yahoo! Inc. BSD license.
See the [LICENSE file][] for license text and copyright information.


[LICENSE file]: https://github.com/ericf/rework-pure-grids/blob/master/LICENSE
