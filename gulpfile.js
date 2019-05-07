const { series, src, dest, watch } = require('gulp');
const zip = require('gulp-zip');
const phpConnect = require('gulp-connect-php');
const browserSync = require('browser-sync').create();

const PORT = 8082;

function deploy() {
    return src(['*.html', '*.php', 'vendor/**/*', 'css/**/*', 'fonts/**/*', 'js/**/*'], { base: '.' }).
      pipe(zip('website.zip')).
      pipe(dest('dist'));
}

function php(done) {
    phpConnect.server({base: './', port: PORT, keepalive: true});
    done();
}

// BrowserSync
function browserSyncFn(done) {
  browserSync.init({
      proxy: 'localhost:' + PORT,
      hostname: 'localhost:' + PORT,
      port: 8084
    });
    done();
};

// BrowserSync Reload
function browserSyncReload() {
    browserSync.reload();
    // done();
}

function dev(cb) {
    watch(['./*.php']).on('change', () => { browserSync.reload(); });
    cb();
};

exports.dev = series(php, browserSyncFn, dev);
exports.default = deploy;
