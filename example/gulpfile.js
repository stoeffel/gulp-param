// $ gulp test --foo foo --moo moo --blup
var gulpParam = require('../index.js'),
  uglify = require('gulp-uglify'),
  origGulp = require('gulp'),
  gulp = gulpParam(origGulp, process.argv);

gulp.task('dep', function(foo, moo) {
  console.log(foo);
  console.log(moo);
  if (foo) 
    console.log('Hello');
});

gulp.task('dep2', function(foo, blup, callback) {
  console.log(foo);
  console.log(blup);
  callback();
});

gulp.task('compress', function(out) {
  return gulp.src('*.js')
    .pipe(uglify())
    .pipe(gulp.dest(out || 'dist'));
});

gulp.task('test', ['dep', 'dep2'], function(blup, moo) {
  console.log(moo);
  console.log(blup);
});

console.log(gulp === origGulp)
gulp.task('default', ['test']);
