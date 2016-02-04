var retrieveArguments = require('retrieve-arguments'), minimist = require('minimist'), R = require('ramda');

module.exports = function (gulp, processArgv, callbackName) {
  var cmdArgs = minimist(processArgv);
  var wrappedTask = function (taskName, taskDependencies, taskDefinition) {
    if (!taskDefinition && typeof taskDependencies === 'function') {
      taskDefinition = taskDependencies;
      taskDependencies = undefined;
    }
    taskDefinition = taskDefinition || function () {};

    var wrappedTaskFunction = function (originalCallbackFunction) {
      var cmdArgsMap = R.merge(R.objOf(callbackName || "callback")(originalCallbackFunction) , cmdArgs);
      var mapFunctionParameters = R.map(function (fnArgument) { return cmdArgsMap[fnArgument];});
      return taskDefinition.apply(gulp, mapFunctionParameters(retrieveArguments(taskDefinition)));
    };
    return gulp.task.call(gulp, taskName, taskDependencies || [], wrappedTaskFunction);
  };
  return R.merge(R.clone(gulp),{task: wrappedTask});
};
