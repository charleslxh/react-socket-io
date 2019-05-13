var del = require('del');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var babel = require('gulp-babel');
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');
var pump = require('pump');

module.exports = function (gulp) {
  gutil.log(gutil.colors.green('use v4 configuration.'));

  var paths = {
    scripts: {
      _clean: {
        src: ['dist/**/*', 'lib/**/*']
      },
      _babel: {
        src: 'src/**/*.js',
        dest: 'lib/'
      },
      _uglify: {
        src: 'dist/**/*.js',
        dest: 'dist'
      },
      _browserify: {
        src: 'lib/index.js',
        dest: 'dist'
      },
      _copy: {
        src: 'dist/**/*.js',
        dest: 'example/build'
      }
    }
  }

  function _clean() {
    return del(paths.scripts._clean.src);
  }

  function _babel() {
    return gulp.src(paths.scripts._babel.src)
      .pipe(babel({
        presets: ['es2015', '@babel/preset-react', 'stage-0'],
        plugins: ['transform-runtime']
      }))
      .pipe(gulp.dest(paths.scripts._babel.dest))
  }

  function _browserify() {
    var b = browserify({
      entries: paths.scripts._browserify.src,
      debug: true
    });

    return b.bundle()
      .pipe(source('react-socket-io.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(paths.scripts._browserify.dest));
  }

  function _uglify(callback) {
    pump([
      gulp.src(paths.scripts._babel.src),
      uglify(),
      gulp.dest(paths.scripts._babel.dest)
    ],
    callback);
  }

  function _copy() {
    return gulp.src(paths.scripts._copy.src)
      .pipe(gulp.dest(paths.scripts._copy.dest));
  }

  function _watch() {
    gulp.watch('src/**/*.js', ['build']).on('change', function(event) {
      gutil.log(gutil.colors.magenta('File ' + event.path + ' was ' + event.type + ', try rebuild'));
    });
  }

  var build = gulp.series(_clean, _babel, _browserify, _copy);

  gulp.task('build', build);

  gulp.task('default', build);
}
