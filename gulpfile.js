// https://webdesign-master.ru/blog/tools/gulp-4-lesson.html
const {src, dest, parallel, series, watch} = require('gulp');
const browserSync  = require('browser-sync').create();
const del          = require('del');
const nunjucks     = require('gulp-nunjucks-render');
const concat       = require('gulp-concat');
const uglify       = require('gulp-uglify-es').default;
const sass         = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const group_media  = require('gulp-group-css-media-queries');
const clean_css    = require('gulp-clean-css');
const rename       = require('gulp-rename');
const file_include = require('gulp-file-include');

function browsersync(){
  browserSync.init({
    server: { baseDir: 'dist/' },
    notify: false,
    online: true
  })
}
function clean(){
  return del('dist');
}
function html(){
  return src('app/index.html')
    //.pipe(file_include())
    .pipe(nunjucks())
    .pipe(dest('dist/'))
    .pipe(browserSync.stream());
}
function styles(){
    return src('app/scss/main.scss')
    .pipe(sass())
    .pipe(group_media())
    .pipe(autoprefixer({overrideBrowserslist: ['last 5 versions'], cascade: true }))
    .pipe(dest('dist/css/'))
    .pipe(clean_css())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(dest('dist/css/'))
    .pipe(browserSync.stream());
}
function scripts(){
  return src([
    //'node_modules/jquery/dist/jquery.min.js',
    'app/js/main.js'
  ])
    .pipe(concat('main.js'))
    .pipe(dest('dist/js/'))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest('dist/js/'))
    .pipe(browserSync.stream());
}
function startwatch(){
  watch('app/js/**/*.js',scripts);
  watch('app/**/*.html',html);
  watch('app/scss/**/*.scss',styles);
}

exports.browsersync = browsersync;
exports.html = html;
exports.scripts = scripts;
exports.styles = styles;
exports.startwatch = startwatch;
exports.clean = clean;
exports.default = parallel(series( html, styles, scripts, startwatch), browsersync); 