gulp-param
==========
[![Build Status](https://travis-ci.org/stoeffel/gulp-param.svg)](https://travis-ci.org/stoeffel/gulp-param) [![npm version](https://badge.fury.io/js/gulp-param.svg)](http://badge.fury.io/js/gulp-param)

> Plugin injects arguments from the command line into your tasks.

Please use wrapped instance of gulp to have inject feature available.

Installation
------------

`npm install gulp-param`

API
------------

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

### constructor(gulp, cmdArgs, gulpCallbackName): gulp

- `gulp` an instance of gulp.
- `cmdArgs` arguments from command line. In most cases it would be `process.argv`
- `gulpCallbackName` name of methodargument which will be use to inject async gulp callback. It is an option parameter. If you not defined it a default value would be set to `callback`
- returns wrapped gulp instance with enabled param injection.
