var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-ruby-sass');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');

// sass task
gulp.task('sass', function () {
	sass(
		'./sass/main.scss', 
		{ style: 'expanded' }
	).pipe(autoprefixer({
            browsers: ['last 4 versions'],
            cascade: false
    })).pipe(
    	gulp.dest(
    		'./css'
    	)
    );
});

gulp.task('watch', function() {
	// watch scss files
	gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('default', ['sass', 'watch']);