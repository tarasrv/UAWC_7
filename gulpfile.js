/**
 * Created by Taras on 13.09.2015.
 */
/*!
 * gulp
 * $ npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 */

// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');

// Styles
gulp.task('styles', function () {
    return gulp.src('src/styles/main.scss')
        .pipe(sass({style: 'expanded',}))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/styles'))
});

// Scripts
gulp.task('scripts', function () {
    return gulp.src('src/scripts/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'))
});

// Images
gulp.task('images', function () {
    return gulp.src('src/img/**/*')
        .pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
        .pipe(gulp.dest('dist/img'))
});

// Clean
gulp.task('clean', function (cb) {
    del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img'], cb)
});


//Copy files
gulp.task('copyHTML', function () {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('dist'))
});

//Copy files
gulp.task('copyVendors', function () {
    return gulp.src('src/vendors/**/*')
        .pipe(gulp.dest('dist/vendors'))
});

//Copy files
gulp.task('copy', function () {
    return gulp.start('copyHTML', 'copyVendors');
});

// Default task
gulp.task('compile', ['clean'], function () {
    gulp.start('styles', 'scripts', 'images', 'copy');
});

// Watch
gulp.task('default', function () {

    // Watch .scss files
    gulp.watch('src/styles/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('src/scripts/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('src/img/**/*', ['images']);

    // Watch HTML files
    gulp.watch('src/*.html', ['styles', 'scripts', 'images', 'copy']);

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', livereload.changed);

})