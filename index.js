var retrieveArguments = require('retrieve-arguments'),
    includes = require('lodash.includes'), minimist = require('minimist'),
  stringify = require('node-stringify');

module.exports = function(gulp, processArgv) {


  var  getInjections = function(functionArguments, parsedCmdArguments, originalCallbackFunction) {
    var injections = [], callbackinjected = false;

    console.log('getInjections ('+ functionArguments+')('+stringify(parsedCmdArguments)+')');
    for (var i = 0; i < functionArguments.length; i++) {
      var functionArgument = functionArguments[i], value = parsedCmdArguments[functionArgument];
      if(value) {
        injections.push(value);
      }
    }
    return injections;
  };
  var wrappedTask = function(taskName, taskDependencies, taskDefinition) {
    console.log('run task ');
    var functionArguments, cmdLineArguments, wrappedFunction;

    if (!taskDefinition && typeof taskDependencies === 'function') {
      taskDefinition = taskDependencies;
      taskDependencies = undefined;
    }

    taskDependencies = taskDependencies || [];

    taskDefinition = taskDefinition || function() {};
    functionArguments = retrieveArguments(taskDefinition);

    console.log("functionArguments ("+functionArguments+") form "+taskDefinition);

    cmdLineArguments = minimist(processArgv);

    wrappedFunction = function(originalCallbackFunction) {
      return taskDefinition.apply(gulp, getInjections(functionArguments, cmdLineArguments, originalCallbackFunction));
    };

    return gulp.task.call(gulp, taskName, taskDependencies, wrappedFunction);
  };

  var wrappedGulp = {task:wrappedTask};  //should be better
  wrappedGulp.prototype = gulp;

  return wrappedGulp;
};
