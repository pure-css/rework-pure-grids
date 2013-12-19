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
            med  : 'screen and (min-width: 24em)',
            lrg  : 'screen and (min-width: 48em)',
            xlrg : 'screen and (min-width: 60em)'
        }))
        .toString();
```

Now use the new selectors in HTML whenever you want an element's width to change at a certain media query.

```html
<div class="pure-g">
    <!-- This content will have the following widths:
        100% on phones, 50% at 24em, 25% at 48em, and 12.5% at 60em and up
    -->
    <div id="main" class="pure-u-1 pure-u-med-1-2 pure-u-lrg-1-4 pure-u-xlrg-1-8">
        <h1>Main Content</h1>
    </div>

    <!-- This content will have the following widths:
        100% on phones, 25% at 24em and up.
    -->
    <div id="side" class="pure-u-1 pure-u-med-1-4">
        <h1>Side Content</h1>
    </div>
</div>
```


License
-------

This software is free to use under the Yahoo! Inc. BSD license.
See the [LICENSE file][] for license text and copyright information.


[LICENSE file]: https://github.com/ericf/rework-pure-grids/blob/master/LICENSE
