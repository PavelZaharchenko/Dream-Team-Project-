const gulp = require('gulp');
const less = require('gulp-less');
const uglifycss = require('gulp-uglifycss');

let paths = {
  less: ['./app/assets/style/style.less'],
  js: []
};

gulp.task('less', () => {
  return gulp.src(paths.less)
    .pipe(less())
    .pipe(uglifycss())
    .pipe(gulp.dest('./dist/css'));
    
});

gulp.watch(paths.less, ['less']);

gulp.task('default', ['less']);