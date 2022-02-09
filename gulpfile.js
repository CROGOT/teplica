// https://webdesign-master.ru/blog/tools/gulp-4-lesson.html
import gulp from 'gulp';
const {src, dest, parallel, series, watch} = gulp;
import sync         from 'browser-sync';
import htmlmin      from 'gulp-htmlmin';
import del          from 'del';
import version      from 'gulp-version-number';
import nunjucks     from 'gulp-nunjucks-render';
import concat       from 'gulp-concat';
import uglify_pkg   from 'gulp-uglify-es';
const uglify = uglify_pkg.default;
import gulpSass         from 'gulp-sass';
import dartSass         from 'sass';
const sass = gulpSass(dartSass);
import autoprefixer from 'gulp-autoprefixer';
import group_media  from 'gulp-group-css-media-queries';
import clean_css    from 'gulp-clean-css';
import rename       from 'gulp-rename';
import newer        from 'gulp-newer';
import webp         from 'gulp-webp';
import imagemin     from 'gulp-imagemin';
// import webpHTML     from 'gulp-webp-html-fix';
// import webpHTML     from 'gulp-webp-html-nosvg';
import webpHTML     from 'gulp-html-img-wrapper';
//import file_include from 'gulp-file-include';

// SERVER
export const server = () => {
  sync.init({
      ui: false,
      notify: false,
      online: true,
      server: { baseDir: 'dist' }
  });
};

function clean(){
  return del('dist');
}
// Copy
export const copy = () => {
    return src([
            'app/fonts/**/*',
            'app/img/**/*',
        ], {
            base: 'app'
        })
        .pipe(dest('dist'))
        .pipe(sync.stream({
            once: true
        }));
};
// HTML
const versionConfig = {
  'value': '%MDS%',
  'append': {
    'key': 'v',
    'to': ['css', 'js'],
    // 'to':{
    //   'files':['*.css']
    // }
  },
};

function setVersion(){
  return src('dist/index.html')
    .pipe(version(versionConfig))
    .pipe(dest('dist'))
    .pipe(sync.stream());
}

export const html = () => {
  return src(['app/**/index.html','!app/**/_*.html'])
    //.pipe(file_include())
    .pipe(nunjucks())
    .pipe(webpHTML())
    .pipe(version(versionConfig))
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true,
    }))
    .pipe(dest('dist'));
    //.pipe(sync.stream());
};

// CSS
export const styles = () => {
    return src('app/scss/main.scss')
    .pipe(sass())
    .pipe(group_media())
    .pipe(autoprefixer({overrideBrowserslist: ['last 5 versions'], cascade: true }))
    .pipe(dest('dist/css'))
    .pipe(clean_css())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(dest('dist/css'));
    //.pipe(sync.stream());
};

// SCRIPTS
export const scripts = () => {
  return src([
    //'node_modules/jquery/dist/jquery.min.js',
    'app/js/main.js'
  ])
    .pipe(concat('main.js'))
    .pipe(dest('dist/js/'))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest('dist/js/'))
    .pipe(sync.stream());
};

//IMAGES
export const images = () => {
  return src('app/img/**/*.*')
    .pipe(newer('dist/img/**/*.*'))
    .pipe(webp())
    .pipe(dest('dist/img'))
    .pipe(src('app/img/**/*.*'))
    .pipe(newer('dist/img/**/*.*'))
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
      optimizayionLevel: 3
    }))
    .pipe(dest('dist/img'));
    //.pipe(sync.stream());
};

function startwatch(){
  watch('app/js/**/*.js',scripts);
  watch('app/**/*.html',series(html,setVersion));
  watch('app/scss/**/*.scss',series(styles,setVersion));
}


export default parallel( series(html, styles, scripts, startwatch), server);