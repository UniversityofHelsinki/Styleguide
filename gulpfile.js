var autoPrefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var consolidate = require('gulp-consolidate');
var fs = require('fs');
var globbing = require('node-sass-globbing');
var gulp = require('gulp');
var iconFont = require('gulp-iconfont');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var shell = require('gulp-shell');
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

var sass_config = {
  importer: globbing,
  outputStyle: 'expanded',
  includePaths: [
    'node_modules/normalize.css/',
    'node_modules/breakpoint-sass/stylesheets/',
  ]
};

// Compile sass.
gulp.task('sass', function () {
  gulp.src('sass/**/*.scss')
    .pipe(sass(sass_config)
    .on('error', sass.logError))
    .pipe(autoPrefixer({
      browsers: ['last 4 versions']
    }))
    .pipe(gulp.dest('css'));
});

// Generate icons.
gulp.task('generateUnicodeIconFiles', function () {

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
gulp.task('iconFont', function () {
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

gulp.task('nodeBuild', function () {
  return gulp.src('')
    .pipe(shell(['node build'], {cwd: './styleguide'}));
});

gulp.task('build', function(cb) {
  runSequence('clean', 'generateUnicodeIconFiles', 'iconFont', 'sass', 'nodeBuild', cb);
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
