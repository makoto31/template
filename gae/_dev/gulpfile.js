// Node.jsのバージョンが古くてgulp-pleeeaseが動かない対策
require('es6-promise').polyfill();

const gulp		= require('gulp');
const concat		= require('gulp-concat');
const uglify 		= require('gulp-uglify');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require("vinyl-buffer");
const sourcemaps= require('gulp-sourcemaps');

const sass 		= require('gulp-sass');
const pleeease 	= require('gulp-pleeease');
const plumber		= require('gulp-plumber');
const notify		= require('gulp-notify');

// libs.js作成
gulp.task('libs', function(){
	var path = './libs/';
	// js
	gulp.src([
		path + 'jquery-3.1.1.min.js'
		,path + 'underscore-min.js'
		,path + 'velocity.min.js'
		,path + 'jquery.moxa.min.js'
	])
	.pipe(plumber({
	      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
	.pipe(concat('libs.js'))
	.pipe(gulp.dest('../app/public/libs'));
	
	// css
	gulp.src([
		path + 'normalize.css'
	]).pipe(concat('libs.css'))
	.pipe(gulp.dest('../app/public/libs'));
});

// js -> 結合 -> minify
function js(aParam){

	return function(){
		browserify('./' + aParam + '/script.js')
			.transform(babelify, {presets: ["es2015"]
											, plugins: ["transform-remove-strict-mode"]})
			.bundle()
			.pipe(source('script.js'))
			.pipe(buffer())
			.pipe(sourcemaps.init())
			.pipe(uglify())
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('../app/public/' + aParam));
	}
}

// SASS -> CSSビルド -> CSS prefix & minify
function css(aParam){

	return function(){
		gulp.src('./' + aParam + '/*.scss')
			.pipe(plumber({
			      errorHandler: notify.onError("Error: <%= error.message %>")
		    }))
			.pipe(sass())
			.pipe(pleeease({
				fallbacks:{
					autoprefixer: true
				}
				,optimizers:{
					minifier: true
				}
			}))
			.pipe(gulp.dest('../app/public/' + aParam))
			.on('end', function() {
				console.log('[css] ' + aParam + ' end.')
			});
	}
}

// ファイルウォッチ
gulp.task('watch', function(){
	gulp.watch('./hoge/foo/*.js', 		js('hoge/foo'));
	gulp.watch('./hoge/foo/*.scss', 	css('hoge/foo'));
});

// デフォルト実行タスク
gulp.task('default', ['watch']);
