gulp-param
==========

> Add params to your tasks

GulpParam injects arguments from the command line into your tasks.

Installation
------------

`npm install gulp-param`

Usage
-----

```js
  var gulp = require('gulp-param')(require('gulp'), process.argv);

  gulp.task('dep', function(debug) {
    console.log(debug); // => true
  });

  gulp.task('build', ['dep'], function(debug, version) {
    console.log(debug); // => true
    console.log(version); // => 'v1.0.0'
  });

  // $ gulp build --debug --version v1.0.0
```

It allows the use of shorthand params, but it may cause collisions.

```bash
  $ gulp build -d --version v1.0.0 # -d === --debug
```
