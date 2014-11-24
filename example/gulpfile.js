// $ gulp test --p3 foo --p2 moo --p1 blup
var gulpParam = require('../index.js'),
  gulp = gulpParam(require('gulp'), process.argv);

gulp.task('dep', function(p3, p1) {
  console.log(p3);
  console.log(p1);
});

gulp.task('dep2', function(p3, p2) {
  console.log(p3);
  console.log(p2);
});

gulp.task('test', ['dep', 'dep2'], function(p2, p1) {
  console.log(p1);
  console.log(p2);
});
