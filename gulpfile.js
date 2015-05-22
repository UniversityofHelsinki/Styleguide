var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-ruby-sass');
var compass = require('gulp-compass');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');

// Compass task
gulp.task(
	'compass', 
	function() {
		gulp.src('./sass/**/*.scss')
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

gulp.task('watch', function() {
	// watch scss files
	gulp.watch('./sass/**/*.scss', ['compass']);
});

gulp.task('default', ['compass', 'watch']);