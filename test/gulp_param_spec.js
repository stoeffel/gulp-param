var mockedGulp = {
    task: function(name, dep, fn) {
      console.log('mockedGulp run task ');
      if (!dep) {
        fn.call({}, name, fn);
      } else {
        fn.call({}, name, dep, fn);
      }
    }
  },
  gulpParam = require('./../index.js'),
  assert = require('assert');

describe('gulp-param', function() {

  describe('#task', function() {

    it('should run the task', function(done) {

      var gulp =  gulpParam(mockedGulp, ['', '', '']);
      gulp.task('test', function() {
        done();
      });
    });

    it('should pass "moo" in the "param"-argument', function(done) {
      console.log("init gulp");
      var gulp =  gulpParam(mockedGulp, ['', '', '', '--param', 'moo']);
      console.log("finished gulp");
      gulp.task('test', function(param) {
        assert.equal(param, 'moo');
        done();
      });
    });

    it('should pass "null" in the "param"-argument if nothing is passed', function(done) {
      var gulp =  gulpParam(mockedGulp,  ['', '', '']);
      gulp.task('test', function(param) {
        assert.equal(param, null);
        done();
      });
    });

    it('should pass "true" in the "param"-argument', function(done) {
      var gulp =  gulpParam(mockedGulp, ['', '', '', '--param']);
      gulp.task('test', function(param) {
        assert.equal(param, true);
        done();
      });
    });
        it('should pass the params in the correct order', function(done) {
      var gulp =  gulpParam(mockedGulp,  ['', '', '', '--param1', 'value1', '--param2', 'value2']);
      gulp.task('test', function(param1, param2) {
        assert.equal(param1, 'value1');
        assert.equal(param2, 'value2');
      });

     gulp =  gulpParam(mockedGulp,  ['', '', '', '--param2', 'value2', '--param1', 'value1']);
      gulp.task('test', function(param2, param1) {
        assert.equal(param1, 'value1');
        assert.equal(param2, 'value2');
        done();
      });
    });
  });
});
