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

var css = rework('').use(pureGrids.units(10)).toString();
```


License
-------

This software is free to use under the Yahoo! Inc. BSD license.
See the [LICENSE file][] for license text and copyright information.


[LICENSE file]: https://github.com/ericf/rework-pure-grids/blob/master/LICENSE
