import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import svgSprite from 'gulp-svg-sprite';
import notify from 'gulp-notify';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import squoosh from 'gulp-libsquoosh';
import del from 'del';
import terser from 'gulp-terser';
import svgmin from 'gulp-svgmin';
import groupCssMediaQueries from 'gulp-group-css-media-queries';
import postcssScss from 'postcss-scss';
import postcssUrl from 'postcss-url';
import postcssImport from 'postcss-import';

// Styles

export const styles = () => {
  return gulp.src('source/less/main.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('source/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// HTML

const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'))
    .pipe(browser.stream());
}

// Script

const script = () => {
  return gulp.src('source/js/*js')
    .pipe(terser())
    .pipe(gulp.dest('build/js'))
    .pipe(browser.stream());
}

// Image

const optimiseImage = () => {
  return gulp.src(['source/img/**/*.{jpg,png}', '!source/img/favicon/*.png'])
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'))
}

// WebP

const createWebp = () => {
  return gulp.src(['source/img/**/*.{jpg,png}', '!source/img/favicon/*.png'])
    .pipe(squoosh({
      webp: {}
    }))
    .pipe(gulp.dest('build/img'))
}

// SVG

const svg = () => {
  return gulp.src(['source/img/**/*.svg', '!source/img/svg'])
    .pipe(svgmin())
    .pipe(gulp.dest('build/img'))
}

const sprite = () => {
  return gulp.src('source/img/svg/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../stack.svg'
        }
      }
    }))
    .pipe(gulp.dest('build/img'))
    .pipe(gulp.dest('source/img/'))
}


// Clean

const clean = () => {
  return del('build')
}


// Copy

const copy = () => {
  return gulp.src([
    'source/fonts/*.*',
    'source/img/favicon/*.png',
    'source/manifest.webmanifest',
    'source/favicon.ico'
  ], { base: 'source' })
    .pipe(gulp.dest('build'))
}

// Server

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', styles);
  gulp.watch('build/css/*.css').on('change', browser.reload);
  gulp.watch('source/js/*.js', script);
  gulp.watch('build/js/*.js').on('change', browser.reload);
  gulp.watch('source/*.html').on('change', html);
  gulp.watch('build/*.html').on('change', browser.reload);
}

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
  watcher();
}

// Watcher

const build = gulp.series(
  clean,
  gulp.parallel(
    html,
    styles,
    script,
    optimiseImage,
    createWebp,
    svg,
    sprite,
    copy
  )
)

const start = gulp.series(
  clean,
  gulp.parallel(
    html,
    styles,
    script,
    optimiseImage,
    createWebp,
    svg,
    sprite,
    copy
  ),
  server
)

gulp.task('build', build)
gulp.task('default', start)

