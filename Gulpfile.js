var gulp  = require('gulp');
var shell = require('gulp-shell');

gulp.task('watch', shell.task([
    'adb forward tcp:2424 tcp:2424',
    'cca push --watch'
], {
    cwd: "/components/PushClient/"
}));