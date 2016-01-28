var mockedGulp = {
    task: function (name, dep, fn) {
      console.log('mockedGulp run task ');
      if (!dep) {
        fn.call({}, name, fn);
      } else {
        fn.call({}, name, dep, fn);
      }
    }
  },
  gulpParam = require('./../index.js'),
  expect = require('chai').expect;

describe('gulp-param', function () {

  describe('#task', function () {

    it('should run the task', function (done) {

      var gulp = gulpParam(mockedGulp, ['', '', '']);
      gulp.task('test', function () {
        done();
      });
    });

    it('should pass "moo" in the "param"-argument', function (done) {
      console.log("init gulp");
      var gulp = gulpParam(mockedGulp, ['', '', '', '--param', 'moo']);
      console.log("finished gulp");
      gulp.task('test', function (param) {
        expect(param).to.equal('moo');
        done();
      });
    });

    it('should pass "null" in the "param"-argument if nothing is passed', function (done) {
      var gulp = gulpParam(mockedGulp, ['', '', '']);
      gulp.task('test', function (param) {
        expect(param).to.be.undefined;
        done();
      });
    });

    it('should pass "true" in the "param"-argument', function (done) {
      var gulp = gulpParam(mockedGulp, ['', '', '', '--param']);
      gulp.task('test', function (param) {
        expect(param).to.be.true;
        done();
      });
    });
    it('should pass the params in order defined by function', function (done) {
      var gulp = gulpParam(mockedGulp, ['', '', '', '--param1', 'value1', '--param2', 'value2']);
      gulp.task('test', function (param1, param2) {
        expect(param1).to.be.equal('value1');
        expect(param2).to.be.equal('value2');
        done();
      });
    });
    it('should pass the params in the correct order even if they are define otherwise', function (done) {
      var gulp = gulpParam(mockedGulp, ['', '', '', '--param2', 'value2', '--param1', 'value1']);
      gulp.task('test', function (param2, param1) {
        expect(param1).to.be.equal('value1');
        expect(param2).to.be.equal('value2');
        done();
      });
    });
   /* it('should run callback as well', function (done) {
      var gulp = gulpParam(mockedGulp, ['', '', '', '--param2', 'value2', '--param1', 'value1'],"callback");
      gulp.task('test', function (callback, param2, param1) {
        expect(param1).to.be.equal('value1');
        expect(param2).to.be.equal('value2');
        callback();
      });
    });*/

  });
});
