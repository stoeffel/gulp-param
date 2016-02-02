var retrieveArguments = require('retrieve-arguments'), minimist = require('minimist'),
  _ =require('lodash');

module.exports = function (gulp, processArgv, cf) {
  var parsedCmdArguments = minimist(processArgv);
  var pp =  (cf || "callback");
  var prepareArgumentsArray = function (functionArguments, cmdArguments) {
    return _.map(functionArguments,function(fa) {
      return cmdArguments[fa];
    });
  };
  var wrappedTask = function (taskName, taskDependencies, taskDefinition) {
    if (!taskDefinition && typeof taskDependencies === 'function') {
      taskDefinition = taskDependencies;
      taskDependencies = undefined;
    }
    taskDefinition = taskDefinition || function () {};

    var wrappedTaskFunction = function (originalCallbackFunction) {
      return taskDefinition.apply(gulp,
        prepareArgumentsArray(retrieveArguments(taskDefinition), _.assign(
          _.fromPairs([[pp,originalCallbackFunction]]),parsedCmdArguments)));
    };
    return gulp.task.call(gulp, taskName, taskDependencies || [], wrappedTaskFunction);
  };
  return _.assignIn({}, gulp, { task: wrappedTask });
};
