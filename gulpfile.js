// <binding />
const gulp = require('gulp'),
  sass = require('gulp-sass'),
  rename = require('gulp-rename'),
  cleanCSS = require('gulp-clean-css'),
  autoprefixer = require('gulp-autoprefixer'),
  gcmq = require('gulp-group-css-media-queries')

// ----- Paths
const paths = {
  styles: {
    src: './imports/ui/styling/stylesheets/**/*.scss',
    dest: './wwwroot/css'
  },
  fonts: {
    src: './imports/ui/styling/fonts/**/*',
    dest: './wwwroot/fonts'
  },
  images: {
      src: './imports/ui/styling/images/**/*',
      dest: './wwwroot/images'
  },
  icons: {
      src: './imports/ui/styling/icons/**/*',
      dest: './wwwroot/icons'
  }
}

// ----- Options
const options = {
  autoprefixer: {
    overrideBrowserslist: ['> 2%', 'last 2 versions'],
    cascade: false
  },
  rename: {
    suffix: '.min'
  }
}

// ----- Build Task
const buildTask = gulp.series(stylesheets, fonts, icons, images)
exports.default = buildTask

// ----- Watch Task
function watchTask() {
  gulp.watch(paths.styles.src, gulp.series(stylesheets, fonts, icons, images))
}

const watch = gulp.series(buildTask, watchTask)
exports.watch = watch

// ----- Styling

function stylesheets() {
  return gulp
    .src(paths.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(gcmq())
    .pipe(autoprefixer(options.autoprefixer))
    // .pipe(gulp.dest(paths.styles.dest))
    .pipe(rename(options.rename))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.styles.dest))
}

function fonts() {
  return gulp.src(paths.fonts.src).pipe(gulp.dest(paths.fonts.dest))
}

function icons() {
  return gulp.src(paths.icons.src).pipe(gulp.dest(paths.icons.dest))
}

function images() {
  return gulp.src(paths.images.src).pipe(gulp.dest(paths.images.dest))
}

exports.stylesheets = stylesheets
exports.fonts = fonts
exports.images = images
exports.icons = icons
