module.exports = function (callback) {
  this.task = function (name, dep, fn) {
    if (!dep) {
      fn.call({}, callback);
    } else {
      fn.call({}, callback);
    }
  }
  return this;
};
