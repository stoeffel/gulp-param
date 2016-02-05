var retrieveArguments = require('retrieve-arguments'),
  minimist = require('minimist'),
  R = require('ramda');

module.exports = function (gulp, processArgv, callbackName) {
  var mergeCmdArgs = R.compose(
    R.merge(R.__, minimist(processArgv)),
    R.objOf(callbackName || "callback")
  );

  var wrappedTask = function (taskName, taskDependencies, taskDefinition) {
    if (!taskDefinition && R.is(Function, taskDependencies)) {
      taskDefinition = taskDependencies;
      taskDependencies = undefined;
    }
    taskDefinition = taskDefinition || function () {
      };
    var wrappedTaskFunction = function (originalCallbackFunction) {
      var cmdArgsMap = mergeCmdArgs(originalCallbackFunction);
      return R.compose(
        function (args) {
          return taskDefinition.apply(gulp, args);
        },
        R.map(R.prop(R.__, cmdArgsMap)),
        retrieveArguments
      )(taskDefinition);
    };
    return gulp.task.call(gulp, taskName, taskDependencies || [], wrappedTaskFunction);
  };
  return R.merge(R.clone(gulp), {task: wrappedTask});
};
