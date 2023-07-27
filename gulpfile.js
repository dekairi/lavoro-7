const {
  src,
  dest,
  parallel,
  series,
  watch
} = require('gulp');

// Load plugins

const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const sourcemap = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const pngcrush = require('imagemin-pngcrush');
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
    .pipe(dest('./build/js/'));
}

// Fonts function

function fonts() {
  const source = './src/fonts/*';

  return src(source)
    .pipe(dest('./build/fonts/'));
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
    .pipe(sourcemap.write("./build/css/"))
    .pipe(cssnano())
    .pipe(dest('./build/css/'))
    .pipe(browsersync.stream());
}

// Html

function html() {
  const source = './src/*.html';

  return src(source)
    .pipe(changed(source))
    .pipe(posthtml([include()]))
    .pipe(dest('./build/'));
}

// Optimize images

function img() {
  return src('./src/img/*')
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.mozjpeg({progressive: true, svgoPlugins: [{removeViewBox: false}], use: [pngcrush()]}),
      imagemin.svgo()
    ]))
    .pipe(dest('./build/img/'));
}

// Watch files

function watchFiles() {
  watch('./src/scss/**/*.scss', css);
  watch('./src/js/*', js);
  watch('./src/img/*', img);
  watch('./src/*.html', html);
}

// BrowserSync

function browserSync() {
  browsersync.init({
    server: {
      baseDir: './build'
    },
    port: 3000
  });
}

// Tasks to define the execution of the functions simultaneously or in series

exports.watch = parallel(watchFiles, browserSync);
exports.default = series(clear, parallel(html, css, img, js, fonts));
