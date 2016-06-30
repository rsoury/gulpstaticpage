import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import watch from 'gulp-watch';
import stylus from 'gulp-stylus';
import jade from 'gulp-jade';
import plumber from 'gulp-plumber';
import htmlmin from 'gulp-htmlmin';
import cssmin from 'gulp-clean-css';
import browserSync from 'browser-sync';
import webpack from 'webpack-stream';
import wbpk_conf from './webpack.config';

gulp.task('dev', ['default', 'browser-sync']);
gulp.task('default', ['jade', 'stylus']);
gulp.task('jade', () => {
    return gulp.src(['views/index.jade'])
        .pipe(plumber())
        .pipe(jade())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./dist/'))
});
gulp.task('browser-sync', ['webpack'], () => {
    browserSync({
        ui: {
            port: 5557,
        },
        proxy: {
            //This localhost is setup with local apache config. It may changed based on how you server local static pages.
            target: 'http://localhost/~USER/static/dist/',
            ws: false,
        },
        port: 3001,
        browser: "google chrome",
        reloadDelay: 1000,
        open: false,
    });
    gulp.watch('public/stylesheets/*.styl', ['styl']);
    gulp.watch('views/*.jade', ['jade']).on('change', browserSync.reload);
    gulp.watch(["public/javascripts/*.js", "!public/javascripts/*.min.js"], ['js-watch']).on('change', browserSync.reload);
});
gulp.task('webpack', () => {
    return gulp.src(['public/javascripts/scripts.js'])
        .pipe(webpack(wbpk_conf))
        .on('error', () => {
            console.log('error is frontend script.');
        })
        .pipe(gulp.dest('./dist/javascripts/'));
});
gulp.task('js-watch', ['webpack']);
gulp.task('stylus', () => {
    return gulp.src('public/stylesheets/*.styl')
        .pipe(plumber())
        .pipe(stylus())
        .pipe(cssmin({ compatibility: 'ie8' }))
        .pipe(gulp.dest('./dist/stylesheets/'))
        .on("error", () => {});
});
gulp.task('styl', () => {
    return gulp.src('public/stylesheets/*.styl')
        .pipe(plumber())
        .pipe(stylus())
        .pipe(gulp.dest('./dist/stylesheets/'))
        .pipe(browserSync.stream())
        .on("error", () => {});
});