gulp-param
==========
[![Build Status](https://travis-ci.org/stoeffel/gulp-param.svg)](https://travis-ci.org/stoeffel/gulp-param) [![npm version](https://badge.fury.io/js/gulp-param.svg)](http://badge.fury.io/js/gulp-param)

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

  gulp.task('build', ['dep'], function(debug, tag) {
    console.log(debug); // => true
    console.log(tag); // => 'v1.0.0'
  });

  // $ gulp build --debug --tag v1.0.0
```

It allows the use of shorthand params, but it may cause collisions.

```bash
  $ gulp build -d --tag v1.0.0 # -d === --debug
```
