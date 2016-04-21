var gulp = require('gulp');
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');
var clean = require('gulp-clean');
var version = require('./package.json').version;
var fs = require('fs');
var _ = require('lodash');

var iconFontSettings = {
    fontClassName : 'hy',
    fontFileName : 'hy-icons_' + version,
    fontName: 'hy-icons',
    svgSrc: 'icons/generated/*.svg',
    fontDest: 'fonts/',
    fontCssPath: '../fonts/',
    targetCssPath: '../css/icons.css',
    appendUnicode: true
};

var genedateIconSrcPath = 'icons/src';
var generateIconDestPath = 'icons/generated';
var unicodesJsonFileName = 'unicodes.json';

gulp.task('generateUnicodeIconFiles', ['clean'], function() {

  if (!fs.existsSync(generateIconDestPath)){
    fs.mkdirSync(generateIconDestPath);
  }

  var iconFiles = fs.readdirSync(genedateIconSrcPath);
  var unicodes = require('./' + unicodesJsonFileName);

  var unicodeIntValues = _.map(_.values(unicodes), function(unicode) {
    return parseInt(unicode.split('u')[1], 16);
  });

  var nextUnicodeIntValue = _.max(unicodeIntValues);

  _.each(iconFiles, function(file) {
    var unicodeValue;

    if(_.has(unicodes, file)) {
      unicodeValue = unicodes[file];
    } else {
      nextUnicodeIntValue++;
      unicodeValue = 'u' + nextUnicodeIntValue.toString(16).toUpperCase();
      unicodes[file] = unicodeValue;
    }
    fs.createReadStream(genedateIconSrcPath + '/' + file).pipe(fs.createWriteStream(generateIconDestPath + '/' + unicodeValue + '-' + file));
  });

  fs.writeFile(unicodesJsonFileName, JSON.stringify(unicodes));
});

gulp.task('iconfont', ['generateUnicodeIconFiles'], function(){
  gulp.src([iconFontSettings.svgSrc])
    .pipe(iconfont({
      fontName: iconFontSettings.fontFileName,
      appendUnicode: true,
      fontHeight: 1000,
      normalize: true,
      descent: 6
     }))
    .on('glyphs', function(glyphs) {
      gulp.src('src/icons.css')
        .pipe(consolidate('lodash', {
          glyphs: glyphs,
          fontFileName : iconFontSettings.fontFileName,
          fontName: iconFontSettings.fontName,
          fontPath: iconFontSettings.fontCssPath,
          className: iconFontSettings.fontClassName
        }))
        .pipe(gulp.dest('css/'));

      gulp.src('src/variables.scss')
        .pipe(consolidate('lodash', {
          glyphs: glyphs,
          className: iconFontSettings.fontClassName
        }))
        .pipe(gulp.dest('sass/'));

      gulp.src('src/preview.html')
        .pipe(consolidate('lodash', {
          glyphs: glyphs,
          className: iconFontSettings.fontClassName
        }))
        .pipe(gulp.dest('preview/'));

    })
    .pipe(gulp.dest(iconFontSettings.fontDest));
});

gulp.task('clean', function () {
  return gulp.src(iconFontSettings.fontDest, {read: false})
    .pipe(clean())
    .pipe(gulp.src(generateIconDestPath, {read: false}))
    .pipe(clean());
});

gulp.task('default', ['clean', 'generateUnicodeIconFiles', 'iconfont']);