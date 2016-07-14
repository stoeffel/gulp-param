var retrieveArguments = require('retrieve-arguments'), minimist = require('minimist'),
  stringify = require('node-stringify'), debug = require('debug')('gulp-param');

module.exports = function (gulp, processArgv, callbackFunctionName) {
  // @nrser we're going to use this twice now so just set the default here
  if (!callbackFunctionName) {
    callbackFunctionName = 'callback';
  }
  
  var parsedCmdArguments = minimist(processArgv);
  // @nrser `originalCallbackFunction` will be `undefined` if the task
  // definition does not take the callback function as an argument.
  var prepareArgumentsArray = function (functionArguments, originalCallbackFunction) {
    var arguments = [];
    debug('prepare argument base on function arguments (%s) and parsed commandline (%s)',
      functionArguments, stringify(parsedCmdArguments));

    for (var i = 0; i < functionArguments.length; i++) {
      var functionArgument = functionArguments[i], value = parsedCmdArguments[functionArgument];
      if (value) {
        arguments.push(value);
      } else if (functionArgument === callbackFunctionName) {
        if (typeof originalCallbackFunction === 'undefined') {
          throw new Error("THIS SHOULD NEVER HAPPEN");
        }
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
    
    var wrappedTaskFunction;
    
    // @nrser need to see if `taskDefinition` takes the callback argument
    // so we know if the wrapped function should or not
    //
    // https://github.com/stoeffel/gulp-param/issues/30
    // 
    var taskDefinitionArgs = retrieveArguments(taskDefinition);
    
    if (taskDefinitionArgs.indexOf(callbackFunctionName) === -1) {
      // @nrser `taskDefinition` does not take the callback argument, so the
      // wrapped function should not accept a callback, causing gulp to treat
      // it as synchronous
      wrappedTaskFunction = function () {
        return taskDefinition.apply(gulp, prepareArgumentsArray(taskDefinitionArgs));
      };
    } else {
      // @nrser `taskDefinition` takes the callback argument, so the wrapped
      // function should accept a callback, causing gulp to treat it as 
      // asynchronous
      wrappedTaskFunction = function (originalCallbackFunction) {
        return taskDefinition.apply(gulp, prepareArgumentsArray(taskDefinitionArgs, originalCallbackFunction));
      };
    }

    return origTask.call(gulp, taskName, taskDependencies || [], wrappedTaskFunction);
  };


  gulp.task = wrappedTask;

  return gulp;
};
