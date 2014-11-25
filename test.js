var mockedGulp = {
    task: function(name, dep, fn) {
      if (!dep) {
        fn.call(gulp, name, fn);
      } else {
        fn.call(gulp, name, dep, fn);
      }
    }
  },
  gulpParam = require('./index.js'),
  gulp = gulpParam(mockedGulp, []),
  assert = require('assert');

describe('gulp-param', function() {

  describe('#getInjections', function() {

    it('should return an array', function() {
      assert.deepEqual(gulpParam.getInjections([], []), []);
    });

    it('should return an array with the values of the given args', function() {
      assert.deepEqual(gulpParam.getInjections(['param'], ['--param', 'value']), ['value']);
    });

    it('should return the array in the order of the function params', function() {
      assert.deepEqual(gulpParam.getInjections(['one', 'two'], ['--two', '2', '--one', '1']), ['1', '2']);
    });

    it('should set true as the value if none given', function() {
      assert.deepEqual(gulpParam.getInjections(['flag'], ['--flag']), [true]);
      assert.deepEqual(gulpParam.getInjections(['param', 'flag'], ['--param', 'test', '--flag']), ['test', true]);
    });
  });

  describe('#task', function() {

    it('should run the task', function(done) {
      gulp.argv = ['', '', ''];
      gulp.task('test', function() {
        done();
      });
    });

    it('should pass "moo" in the "param"-argument', function(done) {
      gulp.argv = ['', '', '', '--param', 'moo'];
      gulp.task('test', function(param) {
        assert.equal(param, 'moo');
        done();
      });
    });

    it('should pass "true" in the "param"-argument', function(done) {
      gulp.argv = ['', '', '', '--param'];
      gulp.task('test', function(param) {
        assert.equal(param, true);
        done();
      });
    });

    it('should pass "null" in the "param"-argument if nothing is passed', function(done) {
      gulp.argv = ['', '', ''];
      gulp.task('test', function(param) {
        assert.equal(param, null);
        done();
      });
    });

    it('should pass the params in the correct order', function(done) {
      gulp.argv = ['', '', '', '--param1', 'value1', '--param2', 'value2'];
      gulp.task('test', function(param1, param2) {
        assert.equal(param1, 'value1');
        assert.equal(param2, 'value2');
      });

      gulp.argv = ['', '', '', '--param2', 'value2', '--param1', 'value1'];
      gulp.task('test', function(param2, param1) {
        assert.equal(param1, 'value1');
        assert.equal(param2, 'value2');
        done();
      });
    });
  });
});
