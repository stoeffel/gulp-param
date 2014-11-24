var retrieveArguments = require('retrieve-arguments');
require('./includes-polyfill');
require('./starts-with-polyfill');

module.exports = function(gulp, processArgv) {
  var taskFn = gulp.task;
  gulp.argv = processArgv;

  gulp.task = function(name, dep, fn) {
    var fnArgs, argv, injections, newFn;

		if (!fn && typeof dep === 'function') {
			fn = dep;
			dep = undefined;
		}
		dep = dep || [];
		fn = fn || function () {};

    fnArgs = retrieveArguments(fn);
    argv = gulp.argv.slice(3);
    injections = module.exports.getInjections(fnArgs, argv);

    newFn = function() {
      fn.apply(gulp, injections);
    };

    if (!dep) {
      taskFn.call(gulp, name, newFn);
    } else {
      taskFn.call(gulp, name, dep, newFn);
    }
    return gulp;
  };

  return gulp;
};

module.exports.getInjections = function(fnArgs, keys) {
  var injections = [];

  for (var i = 0; i < fnArgs.length; i++) {
    var key = fnArgs[i],
      index, next;
    if (key === 'callback') {
      continue;
    }

    if (keys.includes('--' + key)) {
      index = keys.indexOf('--' + key);
      next = keys[index + 1];
      if (next && !next.startsWith('--')) {
        injections.push(next);
      } else {
        injections.push(true);
      }
    } else {
      injections.push(null);
    }
  }
  return injections;
};
