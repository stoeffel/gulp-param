var retrieveArguments = require('retrieve-arguments'),
  minimist = require('minimist'),
  R = require('ramda');

module.exports = function (gulp, processArgv, callbackName) {
  var mergeCmdArgs = R.compose(
    R.merge(R.__, minimist(processArgv)),
    R.objOf(callbackName || "callback")
  );

  var wrappedTask = function (taskName, taskDependencies, taskDefinition) {
    var task = R.ifElse(
      R.is(Function),
      R.identity,
      R.always(R.or(taskDefinition, function() {}))
    )(taskDependencies);

    var wrappedTaskFunction = function (originalCallbackFunction) {
      var cmdArgsMap = mergeCmdArgs(originalCallbackFunction);
      return R.compose(
        function (args) {
          return task.apply(gulp, args);
        },
        R.map(R.prop(R.__, cmdArgsMap)),
        retrieveArguments
      )(task);
    };

    var wrappedFunctionWithDependencies = (function (taskDependencies, wrappedTaskFunction) {
      if (Array.isArray(taskDependencies)) {
        return gulp.series(taskDependencies, wrappedTaskFunction);
      } else {
        return wrappedTaskFunction;
      }
    })(taskDependencies, wrappedTaskFunction);

    return gulp.task.call(gulp, taskName, wrappedFunctionWithDependencies);
  };
  return R.merge(R.clone(gulp), {task: wrappedTask});
};
