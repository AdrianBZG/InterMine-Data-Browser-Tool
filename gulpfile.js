const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const browserSync = require('browser-sync').create();
const exec = require('child_process').exec;
const open = require('open');
const port = process.env.PORT || 3000;
const clean = require('gulp-clean')
/**
 * Gulp task to copy third party libraries from /node_modules into /vendor
 */
gulp.task('vendor', function(done) {
    // Bootstrap
    gulp.src([
            './node_modules/bootstrap/dist/**/*',
            '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
            '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
        ])
        .pipe(gulp.dest('./public/vendor/bootstrap'))
        // ChartJS
    gulp.src([
            './node_modules/chart.js/dist/*.js'
        ])
        .pipe(gulp.dest('./public/vendor/chart.js'))
        // Font Awesome
    gulp.src([
            './node_modules/font-awesome/**/*',
            '!./node_modules/font-awesome/{less,less/*}',
            '!./node_modules/font-awesome/{scss,scss/*}',
            '!./node_modules/font-awesome/.*',
            '!./node_modules/font-awesome/*.{txt,json,md}'
        ])
        .pipe(gulp.dest('./public/vendor/font-awesome'))
        // jQuery
    gulp.src([
            './node_modules/jquery/dist/*',
            '!./node_modules/jquery/dist/core.js'
        ])
        .pipe(gulp.dest('./public/vendor/jquery'))
        // jQuery Easing
    gulp.src([
            './node_modules/jquery.easing/*.js'
        ])
        .pipe(gulp.dest('./public/vendor/jquery-easing'))
        // InterMineJS
    gulp.src([
            './node_modules/imjs/dist/*',
        ])
        .pipe(gulp.dest('./public/vendor/imjs'))

    // Signals completion of the task
    done();
});

/**
 * Gulp tasks for deleting images directory to ensure unused files are removed
 */
gulp.task('clean:images', function(){
   return gulp.src('public/img', {read:false, allowEmpty: true}).pipe(clean())
})

/**
 * Gulp tasks for deleting mine configs directory to ensure unused files are removed
 */
gulp.task('clean:mine_configs', function(){
   return gulp.src('public/mine_configs', {read:false, allowEmpty: true}).pipe(clean())
})

/**
 * Gulp tasks for deleting vendor directory to ensure unused files are removed
 */
gulp.task('clean:vendor', function(){
   return gulp.src('public/vendor', {read:false, allowEmpty: true}).pipe(clean())
})

/**
 * Gulp task to move the images in the src folder to the public folder
 */
gulp.task('images', function() {
    return gulp.src([
            './src/img/*'
        ])
        .pipe(gulp.dest('./public/img/'))
});

/**
 * Gulp task to move the JSON mine configs in the src folder to the public folder
 */
gulp.task('mine_configs', function() {
    return gulp.src([
            './src/mine_configs/*'
        ])
        .pipe(gulp.dest('./public/mine_configs/'))
});

/**
 * Gulp task to compile SCSS
 */
gulp.task('css:compile', function() {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass.sync({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(gulp.dest('./public/stylesheets'))
});

/**
 * Gulp task to minify CSS
 */
gulp.task('css:minify', function() {
    return gulp.src([
            './src/css/*.css',
            '!./src/css/*.min.css'
        ])
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./public/stylesheets'))
        .pipe(browserSync.stream());
});

/**
 * Gulp task for CSS
 */
gulp.task('css', gulp.series('css:compile', 'css:minify'));

/**
 * Gulp task to minify JavaScript
 */
gulp.task('js:minify', function() {
    return gulp.src([
            './src/js/*.js',
            '!./src/js/*.min.js'
        ])
        //.pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./public/javascripts'))
        .pipe(browserSync.stream());
});

/**
 * Gulp task for JS
 */
gulp.task('js', gulp.series('js:minify'));

/**
 * Gulp task for launching the documentation on src/ files and save it as HTML in the docs folder
 */
gulp.task('documentation', function(cb) {
    exec('documentation build src/** -f html -o docs', function(err, stdout, stderr) {});
})

/**
 * Gulp task for launching browser with server url
 */
gulp.task('browser', function(cb) {
    console.log("Launching Browser");
    open(`http://localhost:${port}`);
    console.log("Browser Launched");
    return cb();
})

/**
 * Gulp task for keeping the browser in sync when the files change. Will load the locally 
 * rendered pug files, and not from the server.
 */
gulp.task('browserSync', async function() {
   browserSync.init({
       injectChanges: true,
       server: {
          baseDir: './public'
       },
       port,
       files: ['./public/**/*', './views/**/*']
   });

   gulp.watch('./src/(css|scss)/*', gulp.series('css'))
   gulp.watch('./src/js/*', gulp.series('js'))
   gulp.watch('./node_modules/*', gulp.series('clean:vendor', 'vendor'))
   gulp.watch('./src/img/*', gulp.series('clean:images', 'images'))
   gulp.watch('./src/mine_configs/*', gulp.series('clean:mine_configs', 'mine_configs'))
});

/**
 * Gulp dev task. Will do an initial build and then sync changes with the browser using BrowserSync
 */
gulp.task('dev', gulp.series(
    gulp.parallel('css', 'js', 'vendor', 'images', 'mine_configs', 'views'), 
    gulp.series('browserSync')
    ))

/**
 * Gulp default task: CSS + JS + Vendor + images
 */
gulp.task('default', gulp.series(gulp.parallel('css', 'js', 'vendor', 'images', 'mine_configs'), 'browser'));
