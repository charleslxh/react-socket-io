var gulp = require('gulp');

if (gulp.series && gulp.parallel) {
  require('./gulp/v4.js')(gulp);
} else {
  require('./gulp/v3.js')(gulp);
}

