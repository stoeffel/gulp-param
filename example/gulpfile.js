// $ gulp test --foo foo --moo moo -b blup
var gulpParam = require('../index.js'),
  gulp = gulpParam(require('gulp'), process.argv);

gulp.task('dep', function(foo, moo) {
  console.log(foo);
  console.log(moo);
  if (foo) 
    console.log('Hello');
});

gulp.task('dep2', function(foo, blup) {
  console.log(foo);
  console.log(blup);
});

gulp.task('test', ['dep', 'dep2'], function(blup, moo) {
  console.log(moo);
  console.log(blup);
});

gulp.task('default', ['test', 'dep']);
