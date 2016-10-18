var gulp = require('gulp');
var del = require('del');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var babel = require('gulp-babel');

gulp.task('clean:dist', function(){
  return del(['dist/**/*']);
});

gulp.task('build', ['clean:dist'], function() {
  const b = browserify({
    entries: './src/index.js',
    debug: true
  });

  const DIST_PATH = './dist';
  const EXAMPLE_PATH = './example/build';

  return b.transform('babelify', {
      presets: ['es2015', 'react', 'stage-0'],
      plugins: ['transform-runtime']
    })
    .bundle()
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
