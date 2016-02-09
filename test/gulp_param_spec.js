var gulpParam = require('./../index.js'),
  expect = require('chai').expect;

var MockGulp = require('./gulpmock.js');


describe('gulp-param', function () {

  describe('#task', function () {

    it('should run the task', function (done) {

      var gulp = gulpParam(new MockGulp(), ['', '', '']);
      gulp.task('test', function () {
        done();
      });
    });

    it('should pass "moo" in the "param"-argument', function (done) {
      console.log("init gulp");
      var gulp = gulpParam(new MockGulp(), ['', '', '', '--param', 'moo']);
      console.log("finished gulp");
      gulp.task('test', function (param) {
        expect(param).to.equal('moo');
        done();
      });
    });

    it('should pass "null" in the "param"-argument if nothing is passed', function (done) {
      var gulp = gulpParam(new MockGulp(), ['', '', '']);
      gulp.task('test', function (param) {
        expect(param).to.be.undefined;
        done();
      });
    });

    it('should pass "true" in the "param"-argument', function (done) {
      var gulp = gulpParam(new MockGulp(), ['', '', '', '--param']);
      gulp.task('test', function (param) {
        expect(param).to.be.true;
        done();
      });
    });
    it('should pass the params in order defined by function', function (done) {
      var gulp = gulpParam(new MockGulp(), ['', '', '', '--param1', 'value1', '--param2', 'value2']);
      gulp.task('test', function (param1, param2) {
        expect(param1).to.be.equal('value1');
        expect(param2).to.be.equal('value2');
        done();
      });
    });
    it('should pass the params in the correct order even if they are define otherwise', function (done) {
      var gulp = gulpParam(new MockGulp(), ['', '', '', '--param2', 'value2', '--param1', 'value1']);
      gulp.task('test', function (param2, param1) {
        expect(param1).to.be.equal('value1');
        expect(param2).to.be.equal('value2');
        done();
      });
    });
    it('should run callback when it is defined', function (done) {

      var gulp = gulpParam(new MockGulp(done), ['', '', '', '--p1', 'p1'],"callback");
      gulp.task('test', function (callback, p1) {
        expect(p1).to.be.equal('p1');

        callback();
      });
    });
    it('should run callback because default name of callback', function (done) {

      var gulp = gulpParam(new MockGulp(done), ['', '', '', '--p1', 'p1']);
      gulp.task('test', function (p1, callback) {
        expect(p1).to.be.equal('p1');

        callback();
      });
    });
    it('should not pass callback due to different names', function (done) {

      var gulp = gulpParam(new MockGulp(done), ['', '', '', '--p1', 'p1'],"notExistingParam");
      gulp.task('test', function (callback, p1) {
        expect(p1).to.be.equal('p1');
        expect(callback).to.be.undefined;
        done();
      });
    });
    it('should fill only set in cmdLine, the rest should be undefined ', function (done) {

      var gulp = gulpParam(new MockGulp(done), ['', '', '', '--p2', 'p2']);
      gulp.task('test', function (p1, p2, p3) {
        expect(p1).to.be.undefined;
        expect(p2).to.be.equal('p2');
        expect(p3).to.be.undefined;
        done();
      });
    });

    it('should not remove any other function of gulp', function () {

      var gulp = gulpParam(new MockGulp(), ['', '', '', '--p2', 'p2']);
      expect(gulp.src('yes')).to.be.equal('yes');
    });

    it('should use a empty task if none defined', function () {

      var gulp = gulpParam(new MockGulp(), ['', '', '', '--p2', 'p2']);
      gulp.task('test');
    });

  });
});
