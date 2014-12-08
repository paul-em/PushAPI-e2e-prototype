var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');

gulp.task('default', function () {
    var DEST_DIR = 'public';

    return gulp.src('src/*.html')
        .pipe(vulcanize({
            dest: DEST_DIR,
            strip: true
        }))
        .pipe(gulp.dest(DEST_DIR));
});