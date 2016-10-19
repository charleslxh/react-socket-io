var gulp = require('gulp');
var del = require('del');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var babel = require('gulp-babel');
var eslint = require('gulp-eslint');

gulp.task('lint', function() {
  gulp.src([
    'src/**/*.js',
    '!node_modules/**',
    '!dist/**',
    '!lib/**',
    '!example/**'
  ])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
})

gulp.task('clean', function() {
  return del(['dist/**/*', 'lib/**/*']);
});

gulp.task('babel', ['clean'], function() {
  gulp.src('src/**/*.js')
    .pipe(babel({
      presets: ['es2015', 'react', 'stage-0'],
      plugins: ['transform-runtime']
    }))
    .pipe(gulp.dest('./lib/'))
})

gulp.task('build', ['babel'], function() {
  var b = browserify({
    entries: './lib',
    debug: true
  });

  var DIST_PATH = './dist';
  var EXAMPLE_PATH = './example/build';

  return b.bundle()
    .pipe(source('react-socket-io.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(DIST_PATH))
    .pipe(gulp.dest(EXAMPLE_PATH));
});

gulp.task('default', ['build'], function() {
  gulp.watch('src/**/*.js', ['build']).on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', rebuilding... ...');
  });
});
