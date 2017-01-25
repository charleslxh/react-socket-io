var del = require('del');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var rename = require('gulp-rename')
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var babel = require('gulp-babel');
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');
var pump = require('pump');
var runSequence = require('run-sequence');

module.exports = function (gulp) {
  gutil.log(gutil.colors.green('use v3 configuration.'));

  gulp.task('lint', function() {
    return gulp.src([
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

  gulp.task('babel', function() {
    return gulp.src('src/**/*.js')
      .pipe(babel({
        presets: ['es2015', 'react', 'stage-0'],
        plugins: ['transform-runtime']
      }))
      .pipe(gulp.dest('./lib/'))
  });

  gulp.task('browserify', function() {
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
  })

  gulp.task('uglify', function(callback) {
    // pump([gulp.src('dist/react-socket-io.js'), uglify(), gulp.dest('dist')], callback);
    return gulp.src('dist/react-socket-io.js')
      .pipe(uglify())
      .on('error', gutil.log)
      .pipe(rename({ extname: '.min.js' }))
      .pipe(gulp.dest('dist'));
  });

  gulp.task('build', function(callback) {
    runSequence('clean', 'babel', 'browserify', 'uglify', callback);
  });

  gulp.task('default', ['build'], function() {
    gulp.watch('src/**/*.js', ['build']).on('change', function(event) {
      gutil.log(gutil.colors.magenta('File ' + event.path + ' was ' + event.type + ', try rebuild'));
    });
  });
}

