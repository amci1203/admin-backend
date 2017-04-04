const gulp        = require('gulp'),
      watch       = require('gulp-watch'),
      browserSync = require('browser-sync').create();

gulp.task('default', function () {
    gulp.start('watch');
})

gulp.task('cssInject', ['css'], function () {
    return gulp.src('./app/styles.css')
    .pipe(browserSync.stream());
});

gulp.task('scriptsRefresh', ['scripts'], function () {
    browserSync.reload();
})

gulp.task('LAMP', ['scripts', 'css'], function () {
    browserSync.init({
        notify : false,
        proxy  : 'localhost/beta-pi/app'
    });
    watch('./app/assets/css/**/*.css', function () {
        gulp.start('cssInject');
    });
    watch('./app/assets/js/**/*.js', function () {
        gulp.start('scriptsRefresh');
    })
    watch('./app/**/*.php', function () {
        browserSync.reload();
    });
});

gulp.task('MAMP', ['scripts', 'css'], function () {
    browserSync.init({
        notify : false,
        proxy  : 'localhost:8888'
    });
    watch('./app/assets/css/**/*.css', function () {
        gulp.start('cssInject');
    });
    watch('./app/assets/js/**/*.js', function () {
        gulp.start('scriptsRefresh');
    })
    watch('./app/**/*.php', function () {
        browserSync.reload();
    });
});

gulp.task('watch', ['scripts', 'css'], function () {
    browserSync.init({
        notify: false,
        server: {
            baseDir: 'app'
        }
    });
    watch('./app/assets/css/**/*.css', function () {
        gulp.start('cssInject');
    });
    watch('./app/assets/js/**/*.js', function () {
        gulp.start('scriptsRefresh');
    })
    watch('./app/**/*.php', function () {
        browserSync.reload();
    });
});
