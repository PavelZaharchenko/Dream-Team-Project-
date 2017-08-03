const gulp = require('gulp');
const less = require('gulp-less');
const uglifycss = require('gulp-uglifycss');
const imagemin = require('gulp-imagemin');

let paths = {
  less: './app/assets/style/style.less',
  img: './app/assets/img/*'
};

gulp.task('less', () => {
  return gulp.src(paths.less)
    .pipe(less())
    .pipe(uglifycss())
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('imagemin', () =>
  gulp.src(paths.img)
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'))
);

gulp.watch(paths.less, ['less']);

gulp.task('default', ['less', 'imagemin']);