var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-ruby-sass');
var compass = require('gulp-compass');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');

var browserSync = require('browser-sync').create();
var shell = require('gulp-shell')

// Compass task
gulp.task(
	'compass', 
	function() {
		return gulp.src('./sass/**/*.scss')
		.pipe(
			compass(
				{
					config_file: './config.rb',
					environment: 'production',
					css: './css',
					sass: './sass',
					debug: false,
					time: true
				}
			)
		).on(
			'error', 
			function(error) {
				console.log(error.message);
				this.emit('end');
			}
		).pipe(
			autoprefixer(
				{
					browsers: ['last 4 versions'],
					cascade: false
				}
			)
		).pipe(
			gulp.dest(
				'./css'
			)
		)
	}
);

gulp.task('build', ['compass'], function() {
  return gulp.src('')
    .pipe(shell(['node build'], {cwd : './styleguide'}));
})

gulp.task('serve', ['build'], function() {
  browserSync.init({
    server: ""
  });
  gulp.watch('./sass/**/*.scss', ['build']);

  gulp.watch(["index.html", "./templates/**/*.html"]).on('change', browserSync.reload);
});

gulp.task('default', ['build']);