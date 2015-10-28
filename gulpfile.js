// Dev variables
var debug = require('gulp-debug');

var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var del = require('del');
//var gutil = require('gulp-util');

// load plugins
var $ = require('gulp-load-plugins')();

var onError = function (err) {  
  $.notify.onError({
      title:    "Gulp error in " + err.plugin,
      message:  err.toString()
    })(err);
    this.emit('end');
};

//--------------------------//
//  Styles.
//  Scss compilation
//-------------
gulp.task('styles', function() {
    return gulp.src('app/styles/main.scss')
        .pipe($.plumber({
            errorHandler: onError
        }))
        .pipe($.sass({
            errLogToConsole: false
        }))
        .pipe($.autoprefixer('last 2 versions'))
        .pipe(gulp.dest('app/styles'))
        .pipe(reload({
            stream: true
        }))
        //.pipe($.notify("SCSS Compilation complete."));;
});

//--------------------------//
//  JShint for scripts
//-------------
gulp.task('scripts', function() {
    return gulp.src(['app/scripts/**/*.js', '!app/scripts/vendor/*'])
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe(reload({
            stream: true
        }))
});
//--------------------------//
//  HTML & Useref for minifying & concat
//-------------
gulp.task('html', ['styles', 'scripts', 'inject-partials'], function() {

    var assets = $.useref.assets();

    return gulp.src('app/*.html')
        .pipe(assets)
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.minifyCss()))
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(debug())
        .pipe(gulp.dest('dist'))
});

//--------------------------//
//  Images
//-------------
gulp.task('images', function() {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe(reload({
            stream: true,
            once: true
        }))
});


//--------------------------//
//  Inject bower components
//-------------
gulp.task('wiredep', function() {
    var wiredep = require('wiredep').stream;
    gulp.src(['app/*.html'])
        .pipe(wiredep({
            directory: 'app/bower_components'
        }))
        .pipe(debug())
        .pipe(gulp.dest('app'));
});




//--------------------------//
//  Modernizr
//-------------
gulp.task('modernizr', function() {
    gulp.src('app/styles/*.css')
        .pipe($.modernizr({
            options: [
                "setClasses",
                "html5printshiv"
            ],
        }))
        .pipe(gulp.dest('app/scripts/vendor'))
});

//--------------------------//
//  Cleanup
//-------------
gulp.task('clean', function() {
    return del(['app/styles/main.css', 'dist']);
});

//--------------------------//
//  Default tasks.
//-------------

gulp.task('build', ['html', 'images']);

gulp.task('default', ['clean'], function() {
    gulp.start('build');
});


//--------------------------//
//  Serve & Watch
//-------------
gulp.task('serve', ['styles'], function() {
    browserSync.init(null, {
        server: {
            baseDir: 'app',
        },
        debugInfo: false,
    });
});

gulp.task('watch', ['serve'], function() {

    // watch for changes
    gulp.watch(['app/*.html'], reload);

    gulp.watch('app/styles/**/*.scss', ['styles']);

    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('app/images/**/*', ['images']);
    gulp.watch('bower.json', ['wiredep']);

});
