gulp-param
==========
[![Build Status](https://travis-ci.org/stoeffel/gulp-param.svg)](https://travis-ci.org/stoeffel/gulp-param) [![npm version](https://badge.fury.io/js/gulp-param.svg)](http://badge.fury.io/js/gulp-param)

> It automatically injects commandline arguments into a gulp's task definition arguments.

It accepts parameters after '--'. Parameters without any value will be treated as boolean flag. 

```
gulp build  --myparam 123 --booleanParam
```


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

- `gulp` a instance of gulp.
- `cmdArgs` arguments from command line. In most cases it would be `process.argv`
- `gulpCallbackName` name of methodargument which will be use to inject async gulp callback. It is an option parameter. If you not defined it a default value would be set to `callback`
- returns wrapped gulp instance with enabled param injection.
