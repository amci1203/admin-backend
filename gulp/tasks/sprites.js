var gulp   = require('gulp'),
    rename = require('gulp-rename'),
    sheet  = require('gulp-svg-sprite'),
//    toPNG  = require('gulp-svg2png'),
    del    = require('del'),
    config = {
        shape: { spacing: {
          padding: 1
        }},
        mode: { css: {
            variables: {
               changeSVG2PNG: function () {
                   return function (sprite, render) {
                       return render(sprite).split('.svg').join('.png');
                   }
               }
            },
            sprite: 'sprite.svg',
            render: { css: {
                template: './gulp/templates/sprite.css'
            }}
        }}
    };

gulp.task('cleanSprites', () => {
    return del([
        './app/temp/sprite',
        './app/assets/img/sprites',
        './app/assets/css/modules/_icon.css'
    ])
})
///////////////////////////////////////////////////////////////
gulp.task('createSpriteSheet', ['cleanSprites'], () => {
     return gulp.src('./app/assets/img/icons/**/*.svg')
        //Can't figure out why my custom made SVG causes an error; logging not helping, so leaving it out for now.
        .pipe(sheet(config))
        .pipe(gulp.dest('./app/temp/sprite/'));
})

//gulp.task('createPNGCopy', ['createSpriteSheet'], () => {
//    return gulp.src('./app/temp/sprite/css/*.svg')
//        .pipe(toPNG())
//        .pipe(gulp.dest('./app/temp/sprite/css'))
//})
///////////////////////////////////////////////////////////////
gulp.task('copySpriteCSS', ['createSpriteSheet'], () => {
    return gulp.src('./app/temp/sprite/css/*.css')
        .pipe(rename('_icon.css'))
        .pipe(gulp.dest('./app/assets/css/modules'));
})
gulp.task('copySpriteFile', ['createSpriteSheet'], () => {
    return gulp.src('./app/temp/sprite/css/*.svg')
        .pipe(gulp.dest('./app/assets/img/sprites'));
})
///////////////////////////////////////////////////////////////
gulp.task('endClean', ['copySpriteCSS', 'copySpriteFile'], () => {
    return del(['./app/temp/sprite']);
})
///////////////////////////////////////////////////////////////
gulp.task('icons', ['cleanSprites', 'createSpriteSheet', 'copySpriteCSS', 'copySpriteFile', 'endClean'])
