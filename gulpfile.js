var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-ruby-sass');
var compass = require('gulp-compass');
var concat = require('gulp-concat');
var autoPrefixer = require('gulp-autoprefixer');

var browserSync = require('browser-sync').create();
var shell = require('gulp-shell');

var iconFont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');
var clean = require('gulp-clean');
var fs = require('fs');
var _ = require('lodash');

var iconFontSettings = {
  fontClassName: 'icon',
  fontFileName: 'hy-icons',
  fontName: 'hy-icons',
  iconsPath: './icons/',
  svgSrc: './icons/dest/*.svg',
  fontDestination: './fonts/',
  fontCssPath: '../fonts/',
  appendUnicode: true
};

var generateIconSrcPath = iconFontSettings.iconsPath + 'src';
var generateIconDestPath = iconFontSettings.iconsPath + 'dest';
var unicodesJsonFileName = iconFontSettings.iconsPath + 'unicodes.json';

// Compass task
gulp.task('compass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(
      compass(
        {
          config_file: './config.rb',
          environment: 'production',
          css: './css',
          sass: './sass',
          debug: false,
          time: true,
          src: [
            "**/*.scss",
            "!**/__*.scss"
          ]
        }
      )
    ).on(
      'error',
      function (error) {
        console.log(error.message);
        this.emit('end');
      }
    ).pipe(
      autoPrefixer(
        {
          browsers: ['last 3 versions'],
          cascade: false
        }
      )
    ).pipe(
      gulp.dest(
        './css'
      )
    )
});


// Generate icons.
gulp.task('generateUnicodeIconFiles', ['clean'], function () {

  if (!fs.existsSync(generateIconDestPath)) {
    fs.mkdirSync(generateIconDestPath);
  }

  var iconFiles = fs.readdirSync(generateIconSrcPath);
  var unicodes = require('./' + unicodesJsonFileName);

  var unicodeIntValues = _.map(_.values(unicodes), function (unicode) {
    return parseInt(unicode.split('u')[1], 16);
  });

  var nextUnicodeIntValue = _.max(unicodeIntValues);

  _.each(iconFiles, function (file) {
    var unicodeValue;

    if (_.has(unicodes, file)) {
      unicodeValue = unicodes[file];
    } else {
      nextUnicodeIntValue++;
      unicodeValue = 'u' + nextUnicodeIntValue.toString(16).toUpperCase();
      unicodes[file] = unicodeValue;
    }
    fs.createReadStream(generateIconSrcPath + '/' + file)
      .pipe(fs.createWriteStream(generateIconDestPath + '/' + unicodeValue + '-' + file));
  });
  fs.writeFile(unicodesJsonFileName, JSON.stringify(unicodes));
});

// Create icon font from generated icons.
gulp.task('iconFont', ['generateUnicodeIconFiles'], function () {
  gulp.src([iconFontSettings.svgSrc])
    .pipe(iconFont({
      fontName: iconFontSettings.fontFileName,
      appendUnicode: true,
      fontHeight: 1000,
      normalize: true,
      descent: 6
    }))
    .on('glyphs', function (glyphs) {
      gulp.src(iconFontSettings.iconsPath + '__icon_font.scss')
        .pipe(consolidate('lodash', {
          glyphs: glyphs,
          fontFileName: iconFontSettings.fontFileName,
          fontName: iconFontSettings.fontName,
          fontPath: iconFontSettings.fontCssPath,
          className: iconFontSettings.fontClassName
        }))
        .pipe(gulp.dest('sass/icons/'));

      gulp.src(iconFontSettings.iconsPath + '__variables.scss')
        .pipe(consolidate('lodash', {
          glyphs: glyphs,
          className: iconFontSettings.fontClassName
        }))
        .pipe(gulp.dest('sass/icons/'));
    })
    .pipe(gulp.dest(iconFontSettings.fontDestination));
});

// Main tasks.
gulp.task('clean', function () {
  return gulp.src(iconFontSettings.fontDestination + '/' + iconFontSettings.fontFileName + '.*', {read: false})
    .pipe(clean())
    .pipe(gulp.src(generateIconDestPath, {read: false}))
    .pipe(clean());
});

gulp.task('build', ['clean', 'generateUnicodeIconFiles', 'iconFont', 'compass'], function () {
  return gulp.src('')
    .pipe(shell(['node build'], {cwd: './styleguide'}));
});

gulp.task('serve', ['build'], function () {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
  gulp.watch(['./sass/**/*.scss', './templates/**/*.html'], ['build']);

  gulp.watch(['index.html']).on('change', browserSync.reload);
});

gulp.task('default', ['build']);
