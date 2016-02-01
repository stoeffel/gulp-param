var retrieveArguments = require('retrieve-arguments'), minimist = require('minimist'),
  stringify = require('node-stringify'), debug = require('debug')('gulp-param');

module.exports = function (gulp, processArgv, callbackFunctionName) {
  var parsedCmdArguments = minimist(processArgv);
  var prepareArgumentsArray = function (functionArguments, originalCallbackFunction) {
    var arguments = [];
    debug('prepare argument base on function arguments (%s) and parsed commandline (%s)',
      functionArguments, stringify(parsedCmdArguments));

    for (var i = 0; i < functionArguments.length; i++) {
      var functionArgument = functionArguments[i], value = parsedCmdArguments[functionArgument];
      if (value) {
        arguments.push(value);
      } else if (functionArgument === (callbackFunctionName || "callback")) {
        arguments.push(originalCallbackFunction);
      } else {arguments.push(undefined);}
    }
    return arguments;
  };

  var origTask = gulp.task;
  var wrappedTask = function (taskName, taskDependencies, taskDefinition) {
    if (!taskDefinition && typeof taskDependencies === 'function') {
      taskDefinition = taskDependencies;
      taskDependencies = undefined;
    }
    taskDefinition = taskDefinition || function () {};

    var wrappedTaskFunction = function (originalCallbackFunction) {
      return taskDefinition.apply(gulp, prepareArgumentsArray(retrieveArguments(taskDefinition), originalCallbackFunction));
    };
    return origTask.call(gulp, taskName, taskDependencies || [], wrappedTaskFunction);
  };


  gulp.task = wrappedTask;

  return gulp;
};
