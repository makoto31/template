var gulp		= require('gulp');
var concat		= require('gulp-concat');
var closure		= require('gulp-closurecompiler');
var sass 		= require('gulp-sass');
var pleeease 	= require('gulp-pleeease');
var plumber		= require('gulp-plumber');
var notify		= require('gulp-notify');

// js -> 結合 -> minify
gulp.task('js', function(){
	gulp.src('./js/*.js')
		.pipe(plumber({
		      errorHandler: notify.onError("Error: <%= error.message %>")
	    }))
		.pipe(closure({
			fileName: 'script.js'
		}))
		// .pipe(concat('dress.js'))
		.pipe(gulp.dest('./dest'))
});

// SASS -> CSSビルド -> CSS prefix & minify
gulp.task('css', function(){
	gulp.src(['./sass/*.scss', '!./sass/_*.scss'])
		.pipe(plumber({
		      errorHandler: notify.onError("Error: <%= error.message %>")
	    }))
		.pipe(concat('style.scss'))
		.pipe(sass())
		.pipe(pleeease({
			fallbacks:{
				autoprefixer: true
			}
			,optimizers:{
				minifier: true
			}
		}))
		.pipe(gulp.dest('./dest'))
});

// ファイルウォッチ
gulp.task('watch', function(){
	gulp.watch('./js/*.js', ['js']);
	gulp.watch('./sass/*.scss', ['css']);
});

// デフォルト実行タスク
gulp.task('default', ['js', 'css', 'watch']);


// 以下、browser-sync
var browser = require("browser-sync");
gulp.task('browser', function(){
    browser({
        server: {
            baseDir: "../"
        }
        ,files: ['dest/*.html', 'dest/*.js', 'dest/*.css']
        ,ui: false
        ,ghostMode: false
        ,watchOptions: {
            ignoreInitial: true
            ,ignored: '*.*'
        }
        ,startPath: '/gulp/dest/index.html'
    });
});


