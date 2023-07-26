const {
  src,
  dest,
  parallel,
  series,
  watch
} = require('gulp');

// Load plugins

const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const posthtml = require('gulp-posthtml');
const include = require('posthtml-include');
const browsersync = require('browser-sync').create();

// Clean build

function clear() {
  return src('./build/*', {
    read: false
  })
    .pipe(clean());
}

// JS function

function js() {
  const source = './src/js/*.js';

  return src(source)
    .pipe(changed(source))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(dest('./build/js/'))
    .pipe(browsersync.stream());
}

// CSS function

function css() {
  const source = './src/scss/*.scss';

  return src(source)
    .pipe(changed(source))
    .pipe(sass())
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 versions'],
      cascade: false
    }))
    .pipe(concat('main.css'))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(cssnano())
    .pipe(dest('./build/css/'))
    .pipe(browsersync.stream());
}

// Html

function html() {
  const source = '.src/*.html';

  return src(source)
    .pipe(changed(source))
    .pipe(posthtml([include()]))
    .pipe(dest('./build/'));
}

// Optimize images

function img() {
  return src('./src/img/*')
    .pipe(imagemin())
    .pipe(dest('./build/img'));
}

// Watch files

function watchFiles() {
  watch('./src/scss/*', css);
  watch('./src/js/*', js);
  watch('./src/img/*', img);
}

// BrowserSync

function browserSync() {
  browsersync.init({
    server: {
      baseDir: './'
    },
    port: 3000
  });
}

// Tasks to define the execution of the functions simultaneously or in series

exports.watch = parallel(watchFiles, browserSync);
exports.default = series(clear, parallel(js, css, img, html));
