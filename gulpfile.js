'use strict';

var gulp = require('gulp'),   // Вызов Gulpjs
    sass = require('gulp-sass'), // Компилятор Libsass
    rigger = require('gulp-rigger'), // Импортирует файл в другой файл
    imagemin = require('gulp-imagemin'), // Сжимает картинки
    pngquant = require('imagemin-pngquant'), // Дополнение к Imagemin
    wiredep = require('wiredep').stream,
    browserSync = require("browser-sync"),  // Localhost сервер с livereload и туннелью на localhost
    reload = browserSync.reload;

// Source and distribution folder
var source = 'src/',
    dest = 'dist/';

// Bootstrap scss source
var bootstrapSass = {
        in: './node_modules/bootstrap-sass/'
    };

// fonts
var fonts = {
        in: [source + 'fonts/*.*', bootstrapSass.in + 'assets/fonts/**/*'],
        out: dest + 'fonts/'
    };

// css source file: .scss files
var scss = {
    in: source + 'scss/main.scss',
    out: dest + 'css/',
    watch: source + 'scss/*.scss',
    sassOpts: {
        outputStyle: 'nested',
        precison: 3,
        errLogToConsole: true,
        includePaths: [bootstrapSass.in + 'assets/stylesheets']
    }
};

// copy bootstrap required fonts to dest
gulp.task('fonts', function () {
    return gulp
        .src(fonts.in)
        .pipe(gulp.dest(fonts.out));
});




gulp.task('html', function () {
  gulp.src('src/*.html')
    .pipe(rigger())
    .pipe(gulp.dest('./'))
    .pipe(reload({stream: true}));
});

gulp.task('sass', ['fonts'], function () {
  return gulp.src(scss.in)
    .pipe(sass(scss.sassOpts))
    .pipe(gulp.dest(scss.out))
    .pipe(reload({stream: true}));
});


gulp.task('imagemin', function () {
  gulp.src('src/img/**/*.*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()],
        interlaced: true
    }))
    .pipe(gulp.dest('dist/img/'))
    .pipe(reload({stream: true}));
});

gulp.task('build', [
    'html',
    'sass',
    'imagemin',
]);


gulp.task('watch', function () {
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch(scss.watch, ['sass']);
  gulp.watch('src/img/**/*.*', ['imagemin']);
});


var config = {
    server: {
        baseDir: "./"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "Escritor"
};


gulp.task('webserver', function () {
    browserSync(config);
});


gulp.task('default', ['build', 'webserver', 'watch']);
